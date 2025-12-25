import { io, Socket } from 'socket.io-client';
import { env } from './config/env';

let socket: Socket | null = null;

export const connectSocket = (userId: number): Socket => {
    if (socket?.connected) {
        return socket;
    }

    const wsUrl = env.apiBaseUrl

    socket = io(wsUrl, {
        query: { userId: userId.toString() },
        transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
        console.log('WebSocket connected:', socket?.id);
    });

    socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
    });

    socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
    });

    return socket;
};

export const disconnectSocket = (): void => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = (): Socket | null => socket;
