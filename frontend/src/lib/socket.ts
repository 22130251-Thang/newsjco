import { io, Socket } from 'socket.io-client';
import { env } from './config/env';

class SocketService {
    private static instance: SocketService;
    private socket: Socket | null = null;

    private constructor() { }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public connect(userId: number): Socket {
        if (this.socket?.connected) {
            return this.socket;
        }

        const wsUrl = env.apiBaseUrl;

        this.socket = io(wsUrl, {
            query: { userId: userId.toString() },
            transports: ['websocket', 'polling'],
        });

        this.socket.on('connect', () => {
            console.log('WebSocket connected:', this.socket?.id);
        });

        this.socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        this.socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
        });

        return this.socket;
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    public getSocket(): Socket | null {
        return this.socket;
    }

    public joinArticleRoom(slug: string): void {
        if (this.socket?.connected) {
            this.socket.emit('joinArticle', slug);
        }
    }

    public leaveArticleRoom(slug: string): void {
        if (this.socket?.connected) {
            this.socket.emit('leaveArticle', slug);
        }
    }
}

export const socketService = SocketService.getInstance();

export const connectSocket = (userId: number): Socket => socketService.connect(userId);
export const disconnectSocket = (): void => socketService.disconnect();
export const getSocket = (): Socket | null => socketService.getSocket();
export const joinArticleRoom = (slug: string): void => socketService.joinArticleRoom(slug);
export const leaveArticleRoom = (slug: string): void => socketService.leaveArticleRoom(slug);
