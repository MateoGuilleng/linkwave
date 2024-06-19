import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = dev ? "localhost" : "0.0.0.0";
const port = process.env.PORT || 5000; // Usar el puerto de la variable de entorno o 5000
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: dev ? "http://localhost:3000" : "https://tu-dominio.com", // Configurar el origen permitido
      methods: ["GET", "POST"],
    },
    connectionStateRecovery: {},
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Emitimos el socket.id al cliente cuando se conecta
    socket.emit("client_id", socket.id);

    socket.on("chat message", (msg) => {
      io.emit("chat message", { id: socket.id, message: msg });
    });

    socket.on("hello", (message, callback) => {
      console.log(`Received message from client: ${message}`);
      socket.emit("responseEvent", "Hello client, this is the server!");
      io.emit("sendmsg", "world");
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  httpServer.once("error", (err) => {
    console.error(err);
    process.exit(1);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
