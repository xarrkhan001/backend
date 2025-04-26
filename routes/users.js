// 🧍‍♂️ User Info Routes

const express = require("express");
const {
  getMe,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/me", auth, getMe); // Authenticated user details
router.get("/", auth, getAllUsers); // All users with online status
router.delete("/:userId", auth, deleteUser); // Delete a user

module.exports = router;
