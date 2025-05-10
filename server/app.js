require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io"); // Import socket.io server
const authRoutes = require("./router/authRoutes");
const postRoutes = require("./router/postRoutes");
const commentRoutes = require("./router/commentRoutes");
const userRoutes = require("./router/userRouts");
const productRoutes = require("./router/productRoutes");
const orderRoutes = require("./router/orderRoutes");
const adminRoutes = require("./router/adminRoutes");
const User = require("./model/user");
const { checkUser, requireMidllware } = require("./midllware/authMidllware");
const { SchemaMessage } = require("./model/message"); // Assuming message model is here
const cors = require("cors");

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  // Integrate Socket.IO with the server
  cors: {
    origin: "*", // Allow all origins for now
    methods: ["GET", "POST"],
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);
const dbUrl =
  "mongodb+srv://aya:12345@smiling.pgesm.mongodb.net/artissans?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose
  .connect(dbUrl)
  .then(() =>
    server.listen(3000, () => console.log("Server is running on port 3000"))
  )
  .catch((err) => console.log(err));

// Routes
app.use(checkUser);
// Test Routes:
app.get("/protected", requireMidllware, (req, res) => {
  res.status(200).json({ message: "You are authorized", userId: req.userId });
});

app.get("/check", checkUser, (req, res) => {
  res.status(200).json({ user: res.locals.user });
});

app.use("/api/auth", authRoutes);
app.use("/api/blog", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin", adminRoutes);

// Socket.IO Logic
const onlineUsers = new Map(); // Keep track of online users

io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);

  // Register user when they connect
  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // Handle private messages
  socket.on("private_message", async ({ senderId, receiverId, message }) => {
    // Check if users can chat based on follow system (this assumes you have a User model)
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    // Save the message to the database
    const newMsg = new SchemaMessage({ senderId, receiverId, message });
    await newMsg.save();

    // Send the message to the receiver if they're online
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("receive_message", newMsg);
    }

    // Send the message back to the sender
    socket.emit("receive_message", newMsg);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    for (let [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});
