const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const OTP = require("../models/OTP");
const crypto = require("crypto");
const mailSender = require("../utils/mailSender");


const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,           // ✅ must be true on HTTPS
  sameSite: isProduction ? "none" : "lax",  // ✅ cross-site cookie handling
  maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  path: "/",
};



// Signup
exports.signUp = async (req, res) => {
  try {
    const {
      fullName,
      userName,
      phoneNumber,
      email,
      password,
      confirmPassword,
      otp,
    } = req.body;

    // Required fields check
    if (
      !fullName ||
      !userName ||
      !phoneNumber ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords don't match",
      });
    }

    // Email exists?
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    // Username exists?
    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({
        success: false,
        message: "Username not available! Choose a different USERNAME",
      });
    }

    // Phone number exists?
    const existingNumber = await User.findOne({ phoneNumber });
    if (existingNumber) {
      return res.status(400).json({
        success: false,
        message:
          "Phone Number already linked with another account! Choose a different phone number.",
      });
    }

    // Verify OTP
    const response = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullName,
      userName,
      phoneNumber,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      user,
      message: "Signup successful",
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during signup",
    });
  }
};

// Login
exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User doesn't exist. Please sign up first." });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }

    // JWT payload
    const payload = { id: existingUser._id, email: existingUser.email };

    // Create token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });


    // Remove password before sending
    existingUser.password = undefined;

    res.cookie("token", token, cookieOptions)
      .status(200)
      .json({
        success: true,
        user: existingUser,
        message: "User logged in successfully",
      });
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong during login" });
  }
};


// Send OTP
exports.sendotp = async (req, res) => {
  console.log("OTP request received");

  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists. Please login",
      });
    }

    // Generate numeric OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false, // numeric only
    });

    // Add obfuscation for security
    const uniqueOtp = crypto
      .createHash("sha256")
      .update(otp + email + Date.now())
      .digest("hex")
      .substring(0, 6);

    // Save OTP in DB
    await OTP.create({ email, otp: uniqueOtp });

    // TODO: Send OTP to email via mailSender here
    // await mailSender(email, "Your OTP Code", `Your OTP is ${otp}`);

    return res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
      data: uniqueOtp, // REMOVE in production
    });
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.logout = (req, res) => {

  res.clearCookie("token", cookieOptions);

  console.log("User logged out successfully");

  return res.json({
    success: true,
    message: "Logged out successfully",
  });
};


