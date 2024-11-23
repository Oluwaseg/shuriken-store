import nodemailer from "nodemailer";
import crypto from "crypto";

const generateOTP = () => crypto.randomInt(100000, 999999);

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const message = {
    from: process.env.EMAIL_USERNAME,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
};

export const sendOTP = async (user) => {
  const otp = generateOTP();
  const otpMessage = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              color: #333;
          }
          .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              margin-top: 20px;
          }
          .header {
              background-color: #007bff;
              color: #fff;
              padding: 20px;
              text-align: center;
          }
          .hero {
              background-color: #f1f1f1;
              padding: 30px;
              text-align: center;
          }
          .hero h1 {
              margin: 0;
              font-size: 24px;
              color: #333;
          }
          .content {
              padding: 20px;
              text-align: center;
          }
          .content p {
              font-size: 16px;
              line-height: 1.5;
          }
          .footer {
              background-color: #007bff;
              color: #fff;
              text-align: center;
              padding: 15px;
              font-size: 14px;
          }
          .footer a {
              color: #fff;
              text-decoration: none;
              font-weight: bold;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h2>ShopIT</h2>
          </div>
          <div class="hero">
              <h1>OTP Verification</h1>
          </div>
          <div class="content">
              <p>Hello ${user.name},</p>
              <p>Your OTP code is <strong>${otp}</strong>.</p>
              <p>This code will expire in 10 minutes.</p>
              <p>If you did not request this, please ignore this email.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Your Company Name</p>
              <p><a href="#">Unsubscribe</a> | <a href="#">Contact Us</a></p>
          </div>
      </div>
  </body>
  </html>
  `;

  await sendEmail({
    email: user.email,
    subject: "OTP Verification",
    html: otpMessage,
  });

  user.otp = otp;
  user.otpExpire = Date.now() + 10 * 60 * 1000;
  await user.save();
};

const welcomeMessage = (userName) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin-top: 20px;
        }
        .header {
            background-color: #007bff;
            color: #fff;
            padding: 20px;
            text-align: center;
        }
        .hero {
            background-color: #e9ecef;
            padding: 30px;
            text-align: center;
        }
        .hero h1 {
            margin: 0;
            font-size: 24px;
            color: #333;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
        }
        .footer {
            background-color: #007bff;
            color: #fff;
            text-align: center;
            padding: 15px;
            font-size: 14px;
        }
        .footer a {
            color: #fff;
            text-decoration: none;
            font-weight: bold;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            font-size: 16px;
            color: #fff;
            background-color: #28a745;
            border-radius: 5px;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Welcome to Our Store!</h2>
        </div>
        <div class="hero">
            <h1>Hello ${userName},</h1>
        </div>
        <div class="content">
            <p>Congratulations on verifying your account!</p>
            <p>We’re thrilled to have you on board. You can now enjoy a seamless shopping experience, browse through our wide range of products, and take advantage of exclusive offers.</p>
            <p>If you need any assistance, our support team is always here to help. Feel free to reach out if you have any questions.</p>
            <p>As a special welcome, <a href="#" class="button">Start Shopping</a></p>
            <p>Thank you for joining us, and happy shopping!</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Our Store. All rights reserved.</p>
            <p><a href="#">Unsubscribe</a> | <a href="#">Contact Us</a></p>
        </div>
    </div>
</body>
</html>
`;

export const sendWelcomeEmail = async (user) => {
  const htmlContent = welcomeMessage(user.name);

  await sendEmail({
    email: user.email,
    subject: "Welcome to Our Store!",
    html: htmlContent,
  });
};
