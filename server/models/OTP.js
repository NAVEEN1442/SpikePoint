const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../template/otpTemplate")

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5, // Document will expire after 5 minutes
    },
});

// Function to send OTP via email
async function otpSender(email, otp) {
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Required: OTP for Your Account",
            otpTemplate(otp),
        );

        console.log("Email sent successfully:", mailResponse);
    } catch (error) {
        console.error("Error occurred while sending email:", error);
        throw error; // Propagate error to handle it in the calling context
    }
}

// Pre-save hook to send OTP email after the document is saved
OTPSchema.pre("save", async function (next) {
    console.log("New document is being saved to the database");

    if (this.isNew) {
        try {
            await otpSender(this.email, this.otp);
        } catch (error) {
            next(error); // Pass the error to Mongoose error handling
        }
    }
    next();
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;
