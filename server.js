import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000; // Usar puerto 3000 para desarrollo

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();


app.prepare().then(() => {
  const httpServer = createServer(handler);
  console.log(process.env.NODE_ENV); //develompent

  const io = new Server(httpServer, {
    connectionStateRecovery: {},
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Emit the socket.id to the client when connected
    socket.emit("client_id", socket.id);

    socket.on("join_room", (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
      socket
        .to(room)
        .emit("message", `${socket.id} has joined the room ${room}`);
    });

    socket.on("leave_room", (room) => {
      socket.leave(room);
      console.log(`Socket ${socket.id} left room ${room}`);
      socket.to(room).emit("message", `${socket.id} has left the room ${room}`);
    });

    socket.on("chat_message", (data) => {
      const { room, message } = data;
      io.to(room).emit("chat_message", { id: socket.id, message });
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
