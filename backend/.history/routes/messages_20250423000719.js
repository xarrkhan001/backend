// 🗑️ Delete Message Routes

const express = require("express");
const { deleteMessage } = require("../controllers/messageController");
const auth = require("../middleware/auth");
const router = express.Router();

router.delete("/:messageId", auth, deleteMessage); // Delete a message

module.exports = router;
