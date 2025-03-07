const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./router/authRoutes");
const postRoutes = require("./router/postRoutes");
const { checkUser } = require("./midllware/authMidllware");
const app = express();

// Middleware
app.use(express.json());

// Database connection
const dbUrl =
  "mongodb+srv://aya:12345@smiling.pgesm.mongodb.net/artissans?retryWrites=true&w=majority";

mongoose
  .connect(dbUrl)
  .then(() =>
    app.listen(3000, () => console.log("Server is running on port 3000"))
  )
  .catch((err) => console.log(err));

// Routes
//app.get("*", checkUser);   **errore**
app.use("/api/auth", authRoutes);
app.use("/api/blog", postRoutes);
