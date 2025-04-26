const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");

// ✅ User Signup Controller
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ⬆️ Upload profile image to Cloudinary
    const uploadedImg = await cloudinary.uploader.upload(req.file.path);

    // 🔒 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🆕 Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profileImage: uploadedImg.secure_url,
    });

    await newUser.save();

    // 🔑 Create JWT token
    const token = jwt.sign(
      { user: { id: newUser._id } },
      process.env.JWT_SECRET
    );
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Signup failed");
  }
};

// ✅ User Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // 🔒 Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // 🔑 Return token
    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Login failed");
  }
};
