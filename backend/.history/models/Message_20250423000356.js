const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["text", "voice", "file"], default: "text" },
  content: String,
  fileUrl: String,
  createdAt: { type: Date, default: Date.now },
  deletedFor: [{ type: mongoose.Schema.Types.ObjectId }],
});

module.exports = mongoose.model("Message", MessageSchema);
