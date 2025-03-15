const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors"); // ✅ CORS Middleware

const app = express();
const server = http.createServer(app);

// ✅ Enable CORS for your frontend domain
app.use(
  cors({
    origin: "https://blog.grocerymall.in", // ✅ Allowed origin
    methods: ["GET", "POST"], // ✅ Allowed methods
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "https://blog.grocerymall.in", // ✅ Allow frontend domain
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("offer", (data) => {
    io.to(data.target).emit("offer", { offer: data.offer, sender: socket.id });
  });

  socket.on("answer", (data) => {
    io.to(data.target).emit("answer", { answer: data.answer });
  });

  socket.on("ice-candidate", (data) => {
    io.to(data.target).emit("ice-candidate", { candidate: data.candidate });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
