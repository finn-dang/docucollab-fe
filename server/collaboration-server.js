const { WebSocketServer } = require("ws");
const http = require("http");
const Y = require("yjs");
const { setupWSConnection } = require("y-websocket/bin/utils");

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (conn, req) => {
  setupWSConnection(conn, req, { debounceTime: 100 });
  console.log("✅ Client connected");
});

server.listen(1234, () => {
  console.log("✅ Yjs WebSocket server running on ws://localhost:1234");
});
