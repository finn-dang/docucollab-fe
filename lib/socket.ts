import { io, Socket } from "socket.io-client";

type EventCallback = (...args: any[]) => void;

class SocketService {
  private socket: Socket | null = null;
  private eventListeners: Map<string, Set<EventCallback>> = new Map();
  private documentId: string | null = null;
  private userId: string | null = null;
  private userName: string | null = null;
  private userEmail: string | null = null;

  connect(documentId: string, userId: string, userName: string, userEmail: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.documentId = documentId;
    this.userId = userId;
    this.userName = userName;
    this.userEmail = userEmail;

    this.socket = io("http://localhost:3001", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      query: {
        documentId,
        userId,
        userName,
        userEmail,
      },
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      this.emitEvent("connect");
    });

    this.socket.on("disconnect", (reason: string) => {
      this.emitEvent("disconnect", reason);
    });

    this.socket.on("connect_error", (error: Error) => {
      this.emitEvent("connect_error", error);
    });

    this.socket.onAny((event: string, ...args: any[]) => {
      const callbacks = this.eventListeners.get(event);
      if (callbacks) {
        callbacks.forEach((callback) => {
          callback(...args);
        });
      }
    });
  }

  private emitEvent(event: string, ...args: any[]): void {
    const callbacks = this.eventListeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        callback(...args);
      });
    }
  }

  emit(event: string, data: any): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
    }
  }

  on(event: string, callback: EventCallback): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)?.add(callback);
  }

  off(event: string, callback: EventCallback): void {
    const callbacks = this.eventListeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.eventListeners.delete(event);
      }
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.documentId = null;
      this.userId = null;
      this.userName = null;
      this.userEmail = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

const socketService = new SocketService();
export default socketService;
