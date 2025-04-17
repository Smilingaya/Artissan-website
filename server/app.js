const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./router/authRoutes");
const postRoutes = require("./router/postRoutes");
const commentRoutes = require("./router/commentRoutes");
const userRouts = require("./router/userRouts");
const productRoutes = require("./router/productRoutes");
const { checkUser, requireMidllware } = require("./midllware/authMidllware");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

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
app.use(checkUser);
// TEST ROUTES:
app.get("/protected", requireMidllware, (req, res) => {
  res.status(200).json({ message: "You are authorized", userId: req.userId });
});

app.get("/check", checkUser, (req, res) => {
  res.status(200).json({ user: res.locals.user });
});
app.use("/api/auth", authRoutes);
app.use("/api/blog", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/user", userRouts);
app.use("/api/product", productRoutes);
