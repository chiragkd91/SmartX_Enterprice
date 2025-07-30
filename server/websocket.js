import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import dbService from './database.js';

class WebSocketManager {
  constructor() {
    this.wss = null;
    this.clients = new Map(); // Map of userId -> Set of WebSocket connections
    this.rooms = new Map(); // Map of roomId -> Set of WebSocket connections
    this.heartbeatInterval = null;
  }

  initialize(server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws',
      verifyClient: this.verifyClient.bind(this)
    });

    this.wss.on('connection', this.handleConnection.bind(this));
    this.startHeartbeat();
    
    console.log('WebSocket server initialized');
  }

  verifyClient(info) {
    try {
      const url = new URL(info.req.url, 'http://localhost');
      const token = url.searchParams.get('token');
      
      if (!token) {
        return false;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      info.req.user = decoded;
      return true;
    } catch (error) {
      console.error('WebSocket authentication failed:', error);
      return false;
    }
  }

  handleConnection(ws, req) {
    const user = req.user;
    console.log(`WebSocket connection established for user: ${user.email}`);

    // Store connection
    if (!this.clients.has(user.id)) {
      this.clients.set(user.id, new Set());
    }
    this.clients.get(user.id).add(ws);

    // Set up connection properties
    ws.userId = user.id;
    ws.userEmail = user.email;
    ws.userRole = user.role;
    ws.isAlive = true;
    ws.rooms = new Set();

    // Handle messages
    ws.on('message', (data) => this.handleMessage(ws, data));
    
    // Handle connection close
    ws.on('close', () => this.handleDisconnection(ws));
    
    // Handle pong responses for heartbeat
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    // Send welcome message
    this.sendToClient(ws, {
      type: 'connection',
      message: 'Connected to real-time server',
      timestamp: new Date().toISOString()
    });

    // Join user to their personal room
    this.joinRoom(ws, `user_${user.id}`);

    // Join user to role-based room
    this.joinRoom(ws, `role_${user.role}`);

    // Notify about online status
    this.broadcastUserStatus(user.id, 'online');
  }

  handleMessage(ws, data) {
    try {
      const message = JSON.parse(data.toString());
      
      switch (message.type) {
        case 'ping':
          this.sendToClient(ws, { type: 'pong', timestamp: new Date().toISOString() });
          break;
          
        case 'join_room':
          this.joinRoom(ws, message.room);
          break;
          
        case 'leave_room':
          this.leaveRoom(ws, message.room);
          break;
          
        case 'chat_message':
          this.handleChatMessage(ws, message);
          break;
          
        case 'notification_read':
          this.handleNotificationRead(ws, message);
          break;
          
        case 'typing_start':
          this.handleTypingStart(ws, message);
          break;
          
        case 'typing_stop':
          this.handleTypingStop(ws, message);
          break;
          
        case 'subscribe_updates':
          this.handleSubscribeUpdates(ws, message);
          break;
          
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
      this.sendToClient(ws, {
        type: 'error',
        message: 'Invalid message format'
      });
    }
  }

  handleDisconnection(ws) {
    console.log(`WebSocket disconnected for user: ${ws.userEmail}`);
    
    // Remove from clients
    if (this.clients.has(ws.userId)) {
      this.clients.get(ws.userId).delete(ws);
      if (this.clients.get(ws.userId).size === 0) {
        this.clients.delete(ws.userId);
        // Notify about offline status only if no other connections
        this.broadcastUserStatus(ws.userId, 'offline');
      }
    }

    // Remove from all rooms
    ws.rooms.forEach(roomId => {
      if (this.rooms.has(roomId)) {
        this.rooms.get(roomId).delete(ws);
        if (this.rooms.get(roomId).size === 0) {
          this.rooms.delete(roomId);
        }
      }
    });
  }

  joinRoom(ws, roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    
    this.rooms.get(roomId).add(ws);
    ws.rooms.add(roomId);
    
    this.sendToClient(ws, {
      type: 'room_joined',
      room: roomId,
      timestamp: new Date().toISOString()
    });
    
    console.log(`User ${ws.userEmail} joined room: ${roomId}`);
  }

  leaveRoom(ws, roomId) {
    if (this.rooms.has(roomId)) {
      this.rooms.get(roomId).delete(ws);
      if (this.rooms.get(roomId).size === 0) {
        this.rooms.delete(roomId);
      }
    }
    
    ws.rooms.delete(roomId);
    
    this.sendToClient(ws, {
      type: 'room_left',
      room: roomId,
      timestamp: new Date().toISOString()
    });
  }

  handleChatMessage(ws, message) {
    const chatMessage = {
      type: 'chat_message',
      id: Date.now().toString(),
      room: message.room,
      userId: ws.userId,
      userEmail: ws.userEmail,
      message: message.message,
      timestamp: new Date().toISOString()
    };
    
    // Broadcast to room
    this.broadcastToRoom(message.room, chatMessage, ws);
    
    // Store message in database (implement as needed)
    this.storeChatMessage(chatMessage);
  }

  handleNotificationRead(ws, message) {
    // Mark notification as read
    dbService.markNotificationAsRead(message.notificationId, ws.userId)
      .then(() => {
        this.sendToClient(ws, {
          type: 'notification_read_confirmed',
          notificationId: message.notificationId
        });
      })
      .catch(console.error);
  }

  handleTypingStart(ws, message) {
    this.broadcastToRoom(message.room, {
      type: 'typing_start',
      userId: ws.userId,
      userEmail: ws.userEmail,
      room: message.room
    }, ws);
  }

  handleTypingStop(ws, message) {
    this.broadcastToRoom(message.room, {
      type: 'typing_stop',
      userId: ws.userId,
      userEmail: ws.userEmail,
      room: message.room
    }, ws);
  }

  handleSubscribeUpdates(ws, message) {
    const { entity, entityId } = message;
    const subscriptionRoom = `${entity}_${entityId}`;
    this.joinRoom(ws, subscriptionRoom);
  }

  // Broadcasting methods
  sendToClient(ws, message) {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  sendToUser(userId, message) {
    if (this.clients.has(userId)) {
      this.clients.get(userId).forEach(ws => {
        this.sendToClient(ws, message);
      });
    }
  }

  broadcastToRoom(roomId, message, excludeWs = null) {
    if (this.rooms.has(roomId)) {
      this.rooms.get(roomId).forEach(ws => {
        if (ws !== excludeWs) {
          this.sendToClient(ws, message);
        }
      });
    }
  }

  broadcastToRole(role, message, excludeWs = null) {
    this.broadcastToRoom(`role_${role}`, message, excludeWs);
  }

  broadcastToAll(message, excludeWs = null) {
    this.clients.forEach(connections => {
      connections.forEach(ws => {
        if (ws !== excludeWs) {
          this.sendToClient(ws, message);
        }
      });
    });
  }

  broadcastUserStatus(userId, status) {
    this.broadcastToAll({
      type: 'user_status',
      userId,
      status,
      timestamp: new Date().toISOString()
    });
  }

  // Real-time notifications
  sendNotification(userId, notification) {
    this.sendToUser(userId, {
      type: 'notification',
      ...notification,
      timestamp: new Date().toISOString()
    });
  }

  sendSystemAlert(message, priority = 'info') {
    this.broadcastToAll({
      type: 'system_alert',
      message,
      priority,
      timestamp: new Date().toISOString()
    });
  }

  // Entity update notifications
  notifyEntityUpdate(entity, entityId, action, data, userId = null) {
    const message = {
      type: 'entity_update',
      entity,
      entityId,
      action, // 'created', 'updated', 'deleted'
      data,
      userId,
      timestamp: new Date().toISOString()
    };

    // Broadcast to entity-specific room
    this.broadcastToRoom(`${entity}_${entityId}`, message);
    
    // Broadcast to entity type room
    this.broadcastToRoom(`${entity}_updates`, message);
  }

  // Attendance real-time updates
  notifyAttendanceUpdate(employeeId, attendanceData) {
    this.notifyEntityUpdate('attendance', employeeId, 'updated', attendanceData);
    
    // Notify HR role
    this.broadcastToRole('hr', {
      type: 'attendance_update',
      employeeId,
      data: attendanceData,
      timestamp: new Date().toISOString()
    });
  }

  // Leave request notifications
  notifyLeaveRequest(leaveRequest) {
    // Notify managers and HR
    this.broadcastToRole('manager', {
      type: 'leave_request',
      data: leaveRequest,
      timestamp: new Date().toISOString()
    });
    
    this.broadcastToRole('hr', {
      type: 'leave_request',
      data: leaveRequest,
      timestamp: new Date().toISOString()
    });
  }

  // Support ticket notifications
  notifySupportTicket(ticket, action) {
    // Notify IT support team
    this.broadcastToRole('it_support', {
      type: 'support_ticket',
      action,
      data: ticket,
      timestamp: new Date().toISOString()
    });
    
    // Notify ticket creator
    if (ticket.createdBy) {
      this.sendToUser(ticket.createdBy, {
        type: 'support_ticket_update',
        action,
        data: ticket,
        timestamp: new Date().toISOString()
      });
    }
  }

  // CRM notifications
  notifyLeadUpdate(lead, action) {
    // Notify sales team
    this.broadcastToRole('sales', {
      type: 'lead_update',
      action,
      data: lead,
      timestamp: new Date().toISOString()
    });
    
    // Notify assigned user
    if (lead.assignedTo) {
      this.sendToUser(lead.assignedTo, {
        type: 'lead_assigned',
        data: lead,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Heartbeat to keep connections alive
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.clients.forEach(connections => {
        connections.forEach(ws => {
          if (!ws.isAlive) {
            ws.terminate();
            return;
          }
          
          ws.isAlive = false;
          ws.ping();
        });
      });
    }, 30000); // 30 seconds
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
  }

  // Utility methods
  getOnlineUsers() {
    return Array.from(this.clients.keys());
  }

  getConnectionCount() {
    let count = 0;
    this.clients.forEach(connections => {
      count += connections.size;
    });
    return count;
  }

  getRoomMembers(roomId) {
    if (!this.rooms.has(roomId)) {
      return [];
    }
    
    return Array.from(this.rooms.get(roomId)).map(ws => ({
      userId: ws.userId,
      userEmail: ws.userEmail,
      userRole: ws.userRole
    }));
  }

  // Store chat messages (implement based on your database)
  async storeChatMessage(message) {
    try {
      // This would store the message in your database
      // For now, just log it
      console.log('Chat message:', message);
    } catch (error) {
      console.error('Failed to store chat message:', error);
    }
  }

  // Cleanup
  close() {
    this.stopHeartbeat();
    
    if (this.wss) {
      this.wss.clients.forEach(ws => {
        ws.terminate();
      });
      this.wss.close();
    }
    
    this.clients.clear();
    this.rooms.clear();
  }
}

export default WebSocketManager;