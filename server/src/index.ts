import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./libs/DB";
import routes from "./routes";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
// Initialize socket server
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// store online users
export const userSocketMap = new Map();

// socket connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;
  if (userId) userSocketMap.set(userId, socket);

  // emit online users to all connected users
  io.emit("get-online-users", Array.from(userSocketMap.keys()));

  socket.on("disconnect", (socket) => {
    userSocketMap.delete(userId);
    io.emit("get-online-users", Array.from(userSocketMap.keys()));
  });
});

// variables
const PORT = Number(process.env.PORT) || 5000;
// middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/status", (req, res) => res.send("OK"));
app.use("/api", routes);
app.use("*", (req, res) => res.status(404).send("Not Found"));
// DB Connection
connectDB();
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
