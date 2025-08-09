const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator  = require("otp-generator")
const OTP = require("../models/OTP")
const crypto = require("crypto");
const mailSender = require("../utils/mailSender");

//signup


exports.signUp = async (req, res) => {
    try {
    
        const { fullName,userName,phoneNumber,email, password, confirmPassword, otp} = req.body;

        if (!fullName||!phoneNumber||!email || !password || !confirmPassword || !otp) {
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

        const existingUserName = await User.findOne({userName});

        if (existingUserName) {
            return res.status(400).json({
                success: false,
                message: "Username not available! Choose a different USERNAME",
            });
        }

        const existingNumber = await User.findOne({phoneNumber});

        if (existingNumber) {
            return res.status(400).json({
                success: false,
                message: "Phone Number already linked with another account! Choose a different phone number. ",
            });
        }

        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

        console.log(response);
		if (response.length === 0) {
			// OTP not found for the email
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		} else if (otp !== response[0].otp) {
			// Invalid OTP
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
            expiresIn: "15d", // ✅ updated here
        });

        existingUser.token = token;
        existingUser.password = undefined;

        const options = {
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // ✅ updated here
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

exports.sendotp = async (req, res) => {
  console.log("OTP request received");

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists, please login",
      });
    }

    // Generate 6-digit numeric OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Optional: extra obfuscation
    const uniqueOtp = crypto
      .createHash("sha256")
      .update(otp + email + Date.now())
      .digest("hex")
      .substring(0, 6);

    // Save to DB (triggers email send via OTP model pre-save)
    await OTP.create({ email, otp: uniqueOtp });

    return res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
      data: uniqueOtp, // You can remove this in production for security
    });
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

