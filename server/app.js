/**************************************************************
 *  server.js  —  Express + Mongoose + Socket.IO Chat Backend *
 *************************************************************/

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const authRoutes = require("./router/authRoutes");
const postRoutes = require("./router/postRoutes");
const commentRoutes = require("./router/commentRoutes");
const userRoutes = require("./router/userRouts");
const productRoutes = require("./router/productRoutes");
const orderRoutes = require("./router/orderRoutes");
const adminRoutes = require("./router/adminRoutes");

const Message = require("./model/message");
const { checkUser, requireMidllware } = require("./midllware/authMidllware");

const app = express();

/* ─────────────── Express Middleware ─────────────── */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  require("cors")({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/* ─────────────── MongoDB Connection ─────────────── */
const dbUrl =
  "mongodb+srv://aya:12345@smiling.pgesm.mongodb.net/artissans?retryWrites=true&w=majority";

mongoose
  .connect(dbUrl)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

/* ─────────────── REST Routes ─────────────── */
app.use(checkUser);
app.get("/protected", requireMidllware, (req, res) =>
  res.status(200).json({ message: "You are authorized", userId: req.userId })
);
app.get("/check", checkUser, (req, res) =>
  res.status(200).json({ user: res.locals.user })
);

app.use("/api/auth", authRoutes);
app.use("/api/blog", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin", adminRoutes);

/* ─────────────── HTTP + Socket.IO Server ─────────────── */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5500"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const onlineUsers = new Map(); // userId ➜ socket.id
const makeChatId = (u1, u2) => [u1.toString(), u2.toString()].sort().join("_");

/* ─────────────── Socket.IO Logic ─────────────── */
io.on("connection", (socket) => {
  console.log("🔌  Socket connected:", socket.id);
  let currentUserId = null;

  /* 1️⃣  Registration */
  socket.on("register", ({ token }) => {
    try {
      const { id } = jwt.verify(token, process.env.secret); // must match your login secret
      socket.data.userId = id; //  ← critical
      onlineUsers.set(id.toString(), socket.id);
      socket.emit("registration_success"); // optional ack
      console.log("🔐 registered", id);
    } catch (e) {
      console.error("❌ invalid token:", e.message);
    }
  });

  /* 2️⃣  Load chat history */
  socket.on("load_messages", async ({ with: otherUserId }) => {
    console.log("📜 load_messages for", socket.data.userId, "↔", otherUserId);
    const currentUserId = socket.data.userId;
    if (!currentUserId) return;

    const chatId = makeChatId(currentUserId, otherUserId);
    const history = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .lean();

    socket.emit("messages_history", history);
  });

  socket.on("private_message", async ({ receiverId, text, type = "text" }) => {
    console.log("✅ back‑end got PM", {
      from: socket.data.userId,
      to: receiverId,
      text,
    });
    const senderId = socket.data.userId;
    if (!senderId || !receiverId) return;

    const chatId = makeChatId(senderId, receiverId);
    const newMsg = await Message.create({
      chatId,
      sender: senderId,
      receiver: receiverId,
      text,
      type,
      read: false,
      createdAt: new Date(),
    });

    socket.emit("receive_message", newMsg); // echo
    const receiverSocket = onlineUsers.get(receiverId.toString());
    if (receiverSocket) io.to(receiverSocket).emit("receive_message", newMsg);
  });

  /* 4️⃣  Mark as read */
  socket.on("mark_read", async ({ with: otherUserId }) => {
    if (!socket.data.userId) return;
    const chatId = makeChatId(socket.data.userId, otherUserId);
    await Message.updateMany(
      { chatId, receiver: socket.data.userId, read: false },
      { $set: { read: true } }
    );
  });
  // const makeChatId = (a, b) => [a, b].sort().join("_");

  /* 5️⃣  Disconnect */
  socket.on("disconnect", () => {
    if (currentUserId) {
      onlineUsers.delete(currentUserId);
      console.log("❌ User offline:", currentUserId);
    }
  });
});

/* ─────────────── Start Server ─────────────── */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀  REST listening on  http://localhost:${PORT}`);
  console.log(`📡  WS   listening on  ws://localhost:${PORT}`);
});

module.exports = io;
