const Message = require("../models/Message");

// ✅ Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { deleteForEveryone } = req.body;

    if (deleteForEveryone) {
      // ❌ Permanently delete message
      await Message.findByIdAndDelete(messageId);
    } else {
      // 👤 Delete only for current user
      await Message.findByIdAndUpdate(messageId, {
        $addToSet: { deletedFor: req.user.id },
      });
    }

    res.json({ msg: "Message deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error deleting message" });
  }
};
