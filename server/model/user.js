const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter a name"],
    minLength: [4, "minimun name lenght is 4"],
  },
  email: {
    type: String,
    required: [true, "please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "pleas enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter a password"],
    minLength: [6, "minimun password lenght is 6"],
  },
  profilePicture: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  commandedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  passwordResetcode: String,
  passwordResetExpires: Date,
  passwrdChangedAt: Date,
  passwordResetVerified: Boolean,
  createdAt: { type: Date, default: Date.now },
});
//fire funtion befor doc saved in db
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    const salt = await bcrypt.genSalt();
    update.password = await bcrypt.hash(update.password, salt);

    this.setUpdate(update);
  }
  next();
});
userSchema.statics.login = async function (email, password) {
  const user = await User.findOne({ email });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email ");
};
const User = mongoose.model("User", userSchema);
module.exports = User;
