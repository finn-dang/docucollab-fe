declare module "y-websocket" {
  import * as Y from "yjs";

  export class WebsocketProvider {
    constructor(
      serverUrl: string,
      room: string,
      doc: Y.Doc,
      options?: { connect?: boolean; awareness?: any; params?: any }
    );

    // Observable methods
    on(event: "status", handler: (event: { status: "connected" | "disconnected" }) => void): void;
    on(event: "sync", handler: (isSynced: boolean) => void): void;
    on(event: "awareness-update", handler: (changed: any, origin: any) => void): void;
    on(event: "awareness", handler: (changed: any) => void): void;
    on(event: string, handler: (...args: any[]) => void): void;

    off(event: "status", handler: (event: { status: "connected" | "disconnected" }) => void): void;
    off(event: "sync", handler: (isSynced: boolean) => void): void;
    off(event: "awareness-update", handler: (changed: any, origin: any) => void): void;
    off(event: string, handler: (...args: any[]) => void): void;

    destroy(): void;
    disconnect(): void;
    connect(): void;

    ws: WebSocket | null;
    awareness: any;
    shouldConnect: boolean;
    status: "connected" | "disconnected";
  }

  export function setupWSConnection(conn: any, req: any, options?: any): void;
}
