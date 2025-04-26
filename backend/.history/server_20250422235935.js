require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");

const app = express();
const server = http.createServer(app);

// 🔌 Socket.IO Setup
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
require("./sockets/socket")(io);

// 🧠 DB Connection
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// 📦 API Routes
app.use("/api/auth", authRoutes); // 👉 Signup / Login
app.use("/api/users", userRoutes); // 👉 Fetch users / profile
app.use("/api/messages", messageRoutes); // 👉 Delete messages

// Server Start
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
