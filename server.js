const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors"); // CORS Middleware

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow any frontend to connect
    methods: ["GET", "POST"],
  },
});

app.use(cors()); // Apply CORS middleware

// Store connected users (Only for 2 users)
let connectedUsers = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Store users
  if (!connectedUsers.user1) {
    connectedUsers.user1 = socket.id;
  } else if (!connectedUsers.user2) {
    connectedUsers.user2 = socket.id;
  }

  // Handle Offer (SDP)
  socket.on("offer", (offer) => {
    console.log("Offer received from:", socket.id);
    const targetUser =
      socket.id === connectedUsers.user1
        ? connectedUsers.user2
        : connectedUsers.user1;
    if (targetUser) {
      io.to(targetUser).emit("offer", offer);
    }
  });

  // Handle Answer (SDP)
  socket.on("answer", (answer) => {
    console.log("Answer received from:", socket.id);
    const targetUser =
      socket.id === connectedUsers.user1
        ? connectedUsers.user2
        : connectedUsers.user1;
    if (targetUser) {
      io.to(targetUser).emit("answer", answer);
    }
  });

  // Handle ICE Candidates
  socket.on("ice-candidate", (candidate) => {
    console.log("ICE Candidate received from:", socket.id);
    const targetUser =
      socket.id === connectedUsers.user1
        ? connectedUsers.user2
        : connectedUsers.user1;
    if (targetUser) {
      io.to(targetUser).emit("ice-candidate", candidate);
    }
  });

  // Handle Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (connectedUsers.user1 === socket.id) {
      delete connectedUsers.user1;
    } else if (connectedUsers.user2 === socket.id) {
      delete connectedUsers.user2;
    }
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Signaling server is running on port ${PORT}`);
});
