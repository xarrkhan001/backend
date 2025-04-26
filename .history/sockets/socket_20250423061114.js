const Message = require("../models/Message");
const cloudinary = require("../config/cloudinary");

module.exports = (io) => {
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    onlineUsers.set(userId, socket.id);

    io.emit("userStatus", { userId, online: true });

    // 📤 Send Message
    socket.on(
      "sendMessage",
      async ({ sender, receiver, type, content, file }) => {
        let fileUrl = "";
        if (file) {
          const result = await cloudinary.uploader.upload(file, {
            resource_type: "auto",
          });
          fileUrl = result.secure_url;
        }

        const message = await Message.create({
          sender,
          receiver,
          type,
          content,
          fileUrl,
        });

        const receiverSocket = onlineUsers.get(receiver);
        if (receiverSocket) io.to(receiverSocket).emit("newMessage", message);
        socket.emit("messageSent", message);
      }
    );

    // 🗑️ Delete Message
    socket.on("deleteMessage", async ({ messageId, forEveryone }) => {
      if (forEveryone) {
        await Message.findByIdAndDelete(messageId);
      } else {
        await Message.findByIdAndUpdate(messageId, {
          $addToSet: { deletedFor: userId },
        });
      }
      io.emit("messageDeleted", { messageId, forEveryone });
    });

    // 📞 WebRTC Signaling
    socket.on("callUser", ({ from, to, signalData }) => {
      const receiverSocket = onlineUsers.get(to);
      if (receiverSocket) {
        io.to(receiverSocket).emit("incomingCall", { from, signalData });
      }
    });

    socket.on("answerCall", ({ to, signal }) => {
      const callerSocket = onlineUsers.get(to);
      if (callerSocket) {
        io.to(callerSocket).emit("callAccepted", signal);
      }
    });

    socket.on("endCall", ({ to }) => {
      const otherSocket = onlineUsers.get(to);
      if (otherSocket) {
        io.to(otherSocket).emit("callEnded");
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("userStatus", { userId, online: false });
    });
  });
};
