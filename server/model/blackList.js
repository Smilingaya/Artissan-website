const mongoose = require("mongoose");

const blacklistedUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  reason: {
    type: String,
    default: "Violated terms",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BlacklistedUser", blacklistedUserSchema);
