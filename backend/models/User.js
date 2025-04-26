const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  profileImage: String,
  online: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
