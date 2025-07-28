import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Image, 
  File, 
  Video, 
  Phone, 
  Users, 
  Search,
  MoreHorizontal,
  Smile,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Share2,
  Download,
  Eye,
  Clock,
  Check,
  CheckCheck,
  AlertCircle,
  Settings,
  Plus,
  Hash,
  AtSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image' | 'video';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  readBy: string[];
  isEdited: boolean;
  replyTo?: Message;
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'channel';
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  isActive: boolean;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: Date;
}

export default function RealTimeChat() {
  const [activeChat, setActiveChat] = useState<string>('general');
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Mock data - replace with WebSocket/API calls
  useEffect(() => {
    const mockChats: ChatRoom[] = [
      {
        id: 'general',
        name: 'General',
        type: 'channel',
        participants: ['user1', 'user2', 'user3'],
        unreadCount: 3,
        isActive: true
      },
      {
        id: 'hr-team',
        name: 'HR Team',
        type: 'group',
        participants: ['user1', 'user2'],
        unreadCount: 0,
        isActive: false
      },
      {
        id: 'john-doe',
        name: 'John Doe',
        type: 'direct',
        participants: ['user1'],
        unreadCount: 1,
        isActive: false
      }
    ];

    const mockUsers: User[] = [
      {
        id: 'user1',
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
        status: 'online'
      },
      {
        id: 'user2',
        name: 'John Doe',
        avatar: '/avatars/john.jpg',
        status: 'away'
      },
      {
        id: 'user3',
        name: 'Mike Wilson',
        avatar: '/avatars/mike.jpg',
        status: 'busy'
      }
    ];

    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: 'user2',
        senderName: 'John Doe',
        senderAvatar: '/avatars/john.jpg',
        content: 'Good morning everyone! 👋',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text',
        readBy: ['user1', 'user3'],
        isEdited: false
      },
      {
        id: '2',
        senderId: 'user3',
        senderName: 'Mike Wilson',
        senderAvatar: '/avatars/mike.jpg',
        content: 'Morning! How\'s the project going?',
        timestamp: new Date(Date.now() - 1800000),
        type: 'text',
        readBy: ['user1', 'user2'],
        isEdited: false
      },
      {
        id: '3',
        senderId: 'user1',
        senderName: 'Sarah Johnson',
        senderAvatar: '/avatars/sarah.jpg',
        content: 'Great progress! I\'ll share the latest updates.',
        timestamp: new Date(Date.now() - 900000),
        type: 'text',
        readBy: ['user2'],
        isEdited: false
      },
      {
        id: '4',
        senderId: 'user1',
        senderName: 'Sarah Johnson',
        senderAvatar: '/avatars/sarah.jpg',
        content: '',
        fileName: 'project-update.pdf',
        fileSize: 2048576,
        fileUrl: '/files/project-update.pdf',
        timestamp: new Date(Date.now() - 600000),
        type: 'file',
        readBy: ['user2'],
        isEdited: false
      }
    ];

    setChats(mockChats);
    setUsers(mockUsers);
    setMessages(mockMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'user1',
      senderName: 'Sarah Johnson',
      senderAvatar: '/avatars/sarah.jpg',
      content: message,
      timestamp: new Date(),
      type: 'text',
      readBy: [],
      isEdited: false
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    // Simulate message being read
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, readBy: ['user2', 'user3'] }
            : msg
        )
      );
    }, 2000);

    toast({
      title: 'Message Sent',
      description: 'Your message has been delivered',
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileMessage: Message = {
      id: Date.now().toString(),
      senderId: 'user1',
      senderName: 'Sarah Johnson',
      senderAvatar: '/avatars/sarah.jpg',
      content: '',
      fileName: file.name,
      fileSize: file.size,
      fileUrl: URL.createObjectURL(file),
      timestamp: new Date(),
      type: 'file',
      readBy: [],
      isEdited: false
    };

    setMessages(prev => [...prev, fileMessage]);
    
    toast({
      title: 'File Uploaded',
      description: `${file.name} has been shared`,
    });
  };

  const handleStartCall = () => {
    setIsVideoCall(true);
    toast({
      title: 'Video Call',
      description: 'Starting video call...',
    });
  };

  const handleEndCall = () => {
    setIsVideoCall(false);
    toast({
      title: 'Call Ended',
      description: 'Video call has been ended',
    });
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    toast({
      title: 'Recording Started',
      description: 'Voice message recording...',
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast({
      title: 'Recording Stopped',
      description: 'Voice message recorded',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getMessageStatus = (message: Message) => {
    if (message.readBy.length > 0) {
      return <CheckCheck className="h-3 w-3 text-blue-600" />;
    }
    return <Check className="h-3 w-3 text-gray-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return <File className="h-4 w-4 text-red-600" />;
      case 'doc':
      case 'docx': return <File className="h-4 w-4 text-blue-600" />;
      case 'xls':
      case 'xlsx': return <File className="h-4 w-4 text-green-600" />;
      case 'ppt':
      case 'pptx': return <File className="h-4 w-4 text-orange-600" />;
      default: return <File className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-80 border-r bg-background">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  activeChat === chat.id ? 'bg-muted' : 'hover:bg-muted/50'
                }`}
                onClick={() => setActiveChat(chat.id)}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={chat.type === 'direct' ? '/avatars/john.jpg' : undefined} />
                    <AvatarFallback>
                      {chat.type === 'channel' ? <Hash className="h-4 w-4" /> : chat.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {chat.isActive && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{chat.name}</h3>
                    {chat.lastMessage && (
                      <span className="text-xs text-muted-foreground">
                        {chat.lastMessage.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage?.content || 'No messages yet'}
                    </p>
                    {chat.unreadCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/avatars/john.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">General</h2>
                <p className="text-sm text-muted-foreground">
                  {isConnected ? '3 members, 2 online' : 'Connecting...'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleStartCall}>
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleStartCall}>
                <VideoIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.senderId === 'user1' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.senderId !== 'user1' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.senderAvatar} />
                    <AvatarFallback>{msg.senderName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[70%] ${msg.senderId === 'user1' ? 'order-1' : 'order-2'}`}>
                  {msg.senderId !== 'user1' && (
                    <p className="text-sm font-medium mb-1">{msg.senderName}</p>
                  )}
                  
                  <div className={`rounded-lg p-3 ${
                    msg.senderId === 'user1' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    {msg.type === 'text' && (
                      <p className="text-sm">{msg.content}</p>
                    )}
                    
                    {msg.type === 'file' && (
                      <div className="flex items-center gap-2">
                        {getFileIcon(msg.fileName!)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{msg.fileName}</p>
                          <p className="text-xs opacity-70">{formatFileSize(msg.fileSize!)}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className={`flex items-center gap-1 mt-1 ${
                    msg.senderId === 'user1' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className="text-xs text-muted-foreground">
                      {msg.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {msg.senderId === 'user1' && getMessageStatus(msg)}
                    {msg.isEdited && (
                      <span className="text-xs text-muted-foreground">(edited)</span>
                    )}
                  </div>
                </div>
                
                {msg.senderId === 'user1' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.senderAvatar} />
                    <AvatarFallback>{msg.senderName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t bg-background">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Image className="h-4 w-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button onClick={handleSendMessage} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Hidden file input */}
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            multiple
          />
        </div>
      </div>

      {/* Online Users Sidebar */}
      <div className="w-64 border-l bg-background">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Online Users</h3>
        </div>
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`}></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.status}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
} 