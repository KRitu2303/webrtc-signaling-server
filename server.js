const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public")); // Serve static files from 'public' folder

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("offer", ({ offer, target }) => {
        console.log("Offer received from:", socket.id, "Sending to:", target);
        io.to(target).emit("offer", { offer, sender: socket.id });
    });

    socket.on("answer", ({ answer, target }) => {
        console.log("Answer received from:", socket.id, "Sending to:", target);
        io.to(target).emit("answer", { answer, sender: socket.id });
    });

    socket.on("ice-candidate", ({ candidate, target }) => {
        console.log("ICE Candidate received from:", socket.id, "Sending to:", target);
        io.to(target).emit("ice-candidate", { candidate, sender: socket.id });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
