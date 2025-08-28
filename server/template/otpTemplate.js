
const otpTemplate = (otp) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>SpikePoint - OTP Verification</title>
      <style>
        body {
    background-color: #0a0a0a;
    /* Using a more modern font stack for a professional feel */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #ffffff; /* Softer white for better readability in a dark theme */
    margin: 0;
    padding: 0;
}

.container {
    /* Replaced border with a shadow and top-accent for a modern, professional look */
    border-top: 4px solid #FFD60A;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
    border-radius: 12px; /* Softer, more curved border */
    max-width: 650px;
    margin: 40px auto;
    padding: 30px;
    text-align: center;
    background: #111111;
}

.logo {
    max-width: 180px;
    margin-bottom: 20px;
    /* Adding a curve and a top accent to the logo to match the container style */
    border-radius: 12px;
    border-top: 4px solid #FFD60A;
}

.title {
    font-size: 24px; /* Slightly larger title for better hierarchy */
    font-weight: bold;
    margin-bottom: 15px;
    color: #FFD60A;
}

.message {
    font-size: 17px;
    margin-bottom: 25px;
    color:#ffffff;
}

.otp-box {
    display: inline-block;
    padding: 12px 25px;
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 4px; /* Adjusted for readability */
    color: #000;
    background-color: #FFD60A;
    border-radius: 8px;
    margin: 20px 0;
}

.note {
    font-size: 14px;
    color: #cccccc;
    margin-top: 20px;
}

.support {
    font-size: 14px;
    color: #999999;
    margin-top: 25px;
}

a {
    color: #FFD60A;
    text-decoration: none;
    transition: color 0.3s ease; /* Smooth transition for hover effects */
}

a:hover {
    color: #fff;
    text-decoration: underline;
}
      </style>
    </head>

    <body>
      <div class="container">
        <img class="logo" src="https://res.cloudinary.com/ddp7jprij/image/upload/v1756186060/WhatsApp_Image_2025-08-25_at_21.20.21_ea0fdc4f_assbyp.jpg" alt="SpikePoint Logo" />
        <div class="title">SpikePoint OTP Verification</div>
        
        <div class="message">
          Dear User,<br />
          Please use the following One-Time Password (OTP) to continue with your request on <strong>SpikePoint</strong>:
        </div>
        
        <div class="otp-box">${otp}</div>
        
        <div class="message">
          🔒 This OTP is valid for <strong>5 minutes</strong> and can be used only once.  
          Do not share this code with anyone.
        </div>
        
        <div class="note">
          If you did not request this verification, please ignore this email.  
          Your account remains safe with us.
        </div>

        <div class="support">
          Need help? Contact us anytime at 
          <a href="mailto:support@spikepoint.com">support@spikepoint.com</a>
        </div>
      </div>
    </body>
  </html>
  `;
};

module.exports = otpTemplate;
