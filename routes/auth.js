// 🛠️ Signup and Login Routes

const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { signup, login } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", upload.single("profileImage"), signup); // Signup user
router.post("/login", login); // Login user

module.exports = router;
