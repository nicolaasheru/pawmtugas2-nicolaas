const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true },
  level: { type: Number, default: 1 }, // Set type to Number and default value to 1
  password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
