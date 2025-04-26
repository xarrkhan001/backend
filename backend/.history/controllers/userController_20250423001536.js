const User = require("../models/User");

// ✅ Get authenticated user's profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Error getting user profile" });
  }
};

// ✅ Get all users (chat list)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("username profileImage online");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching users" });
  }
};

// ✅ Delete a user (Admin-style feature)
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting user" });
  }
};
