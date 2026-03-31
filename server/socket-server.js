const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  },
});

const documentRooms = new Map();

io.on("connection", (socket) => {
  const { documentId, userId, userName, userEmail } = socket.handshake.query;

  if (!documentId || !userId) {
    console.log("❌ Missing required query params");
    return;
  }

  socket.join(`document-${documentId}`);

  // Track active users
  if (!documentRooms.has(documentId)) {
    documentRooms.set(documentId, new Map());
  }
  const room = documentRooms.get(documentId);
  room.set(userId, {
    id: userId,
    name: userName || "Anonymous",
    email: userEmail || "",
  });

  // Send current users to new user
  socket.emit("active-users", Array.from(room.values()));

  // Notify others
  socket.to(`document-${documentId}`).emit("user-joined", {
    id: userId,
    name: userName || "Anonymous",
    email: userEmail || "",
  });

  // Handle typing status
  socket.on("typing", (data) => {
    socket.to(`document-${documentId}`).emit("typing-status", data);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    if (documentRooms.has(documentId)) {
      documentRooms.get(documentId).delete(userId);
      socket.to(`document-${documentId}`).emit("user-left", userId);
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`✅ Socket.IO server running on port ${PORT}`);
});
