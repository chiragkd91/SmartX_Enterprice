/**
 * SmartBizFlow - WebSocket Service
 * Handles real-time communication and live updates
 */

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
  userId?: string;
}

interface WebSocketEventHandlers {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventHandlers: WebSocketEventHandlers = {};
  private isConnecting = false;
  private messageQueue: WebSocketMessage[] = [];

  constructor() {
    this.connect();
  }

  private getWebSocketUrl(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = (import.meta as any).env?.VITE_WS_URL || window.location.host;
    return `${protocol}//${host}/ws`;
  }

  connect(): void {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;

    try {
      this.ws = new WebSocket(this.getWebSocketUrl());
      this.setupEventHandlers();
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.handleReconnect();
    }
  }

  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('✅ WebSocket connected');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.eventHandlers.onConnect?.();
      this.flushMessageQueue();
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.eventHandlers.onMessage?.(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.isConnecting = false;
      this.eventHandlers.onDisconnect?.();
      
      if (!event.wasClean) {
        this.handleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.eventHandlers.onError?.(error);
    };
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  send(message: Omit<WebSocketMessage, 'timestamp'>): void {
    const fullMessage: WebSocketMessage = {
      ...message,
      timestamp: Date.now()
    };

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(fullMessage));
    } else {
      this.messageQueue.push(fullMessage);
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message && this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message));
      }
    }
  }

  // Real-time messaging
  sendMessage(recipientId: string, content: string, type: 'text' | 'file' = 'text'): void {
    this.send({
      type: 'message',
      data: {
        recipientId,
        content,
        messageType: type
      }
    });
  }

  // Real-time notifications
  sendNotification(userId: string, notification: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    action?: string;
  }): void {
    this.send({
      type: 'notification',
      data: {
        userId,
        notification
      }
    });
  }

  // Live dashboard updates
  subscribeToDashboard(userId: string): void {
    this.send({
      type: 'subscribe_dashboard',
      data: { userId }
    });
  }

  // Real-time collaboration
  joinCollaborationSession(sessionId: string, userId: string): void {
    this.send({
      type: 'join_session',
      data: {
        sessionId,
        userId
      }
    });
  }

  leaveCollaborationSession(sessionId: string, userId: string): void {
    this.send({
      type: 'leave_session',
      data: {
        sessionId,
        userId
      }
    });
  }

  // Live status updates
  updateStatus(userId: string, status: 'online' | 'away' | 'busy' | 'offline'): void {
    this.send({
      type: 'status_update',
      data: {
        userId,
        status
      }
    });
  }

  // Real-time data synchronization
  syncData(module: string, action: 'create' | 'update' | 'delete', data: any): void {
    this.send({
      type: 'data_sync',
      data: {
        module,
        action,
        data
      }
    });
  }

  // Event handlers
  on(event: keyof WebSocketEventHandlers, handler: any): void {
    this.eventHandlers[event] = handler;
  }

  off(event: keyof WebSocketEventHandlers): void {
    delete this.eventHandlers[event];
  }

  // Connection management
  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'User initiated disconnect');
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getConnectionState(): string {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'closed';
      default:
        return 'unknown';
    }
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService; 