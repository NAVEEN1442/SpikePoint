const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const OTP = require("../models/OTP");
const crypto = require("crypto");
const mailSender = require("../utils/mailSender");

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

    if (!fullName || !phoneNumber || !email || !password || !confirmPassword || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords don't match",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    const existingUserName = await User.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({
        success: false,
        message: "Username not available! Choose a different USERNAME",
      });
    }

    const existingNumber = await User.findOne({ phoneNumber });
    if (existingNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone Number already linked with another account! Choose a different phone number.",
      });
    }

    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist. Please sign up first.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const payload = {
      email: existingUser.email,
      id: existingUser._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    existingUser.token = token;
    existingUser.password = undefined;

    const options = {
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      user: existingUser,
      token,
      message: "User logged in successfully",
    });

  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during login",
    });
  }
};

// Send OTP
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists. Please login",
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: true,
    });

    let uniqueOtp = crypto
      .createHash("sha256")
      .update(otp + email + Date.now())
      .digest("hex")
      .substring(0, 6);

    const newOTP = new OTP({ email, otp: uniqueOtp });
    await OTP.create(newOTP);

    return res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
      data: uniqueOtp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
