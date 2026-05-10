import { io, Socket } from "socket.io-client";

class RealtimeService {
  private socket: Socket | null = null;
  private listeners: Set<(event: any) => void> = new Set();
  private statusListeners: Set<(status: any) => void> = new Set();
  private initialized = false;

  connect() {
    if (this.initialized) return;
    this.initialized = true;
    
    // In production, the socket server is on the same host/port
    this.socket = io();

    this.socket.on("regulatory-event", (event) => {
      this.listeners.forEach(cb => cb(event));
    });

    this.socket.on("filings-init", (filings) => {
      this.filingListeners.forEach(cb => cb({ type: 'INIT', data: filings }));
    });

    this.socket.on("filing-created", (filing) => {
      this.filingListeners.forEach(cb => cb({ type: 'CREATED', data: filing }));
    });

    this.socket.on("filing-updated", (filing) => {
      this.filingListeners.forEach(cb => cb({ type: 'UPDATED', data: filing }));
    });

    this.socket.on("system-status", (status) => {
      this.statusListeners.forEach(cb => cb(status));
    });

    this.socket.on("connect", () => console.log("[WS] Connected to CDSCO Node"));
  }

  private filingListeners: Set<(update: { type: string, data: any }) => void> = new Set();

  subscribeFilings(cb: (update: { type: string, data: any }) => void) {
    this.filingListeners.add(cb);
    return () => { this.filingListeners.delete(cb); };
  }

  subscribeEvents(cb: (event: any) => void) {
    this.listeners.add(cb);
    return () => { this.listeners.delete(cb); };
  }

  subscribeStatus(cb: (status: any) => void) {
    this.statusListeners.add(cb);
    return () => { this.statusListeners.delete(cb); };
  }
}

export const realtimeService = new RealtimeService();
