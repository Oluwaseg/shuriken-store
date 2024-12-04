import crypto from 'crypto';
import fs from 'fs';
import hbs from 'hbs';
import nodemailer from 'nodemailer';
import path from 'path';

// Get directory name in ES module environment
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Registering Handlebars partials and helpers
hbs.registerPartials(path.join(__dirname, '../emails/partials'));

// Use `import` for helpers instead of `require`
import { formatDate } from '../emails/helpers/dateHelper.js';
hbs.registerHelper('formatDate', formatDate);

const generateOTP = () => crypto.randomInt(100000, 999999);

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
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

  console.log('Message sent: %s', info.messageId);
};

export const sendOTP = async (user) => {
  const otp = generateOTP();
  const currentDate = new Date();
  // Path to the OTP Handlebars template
  const otpTemplatePath = path.join(__dirname, '../emails/templates/otp.hbs');

  // Read the template file
  const templateSource = fs.readFileSync(otpTemplatePath, 'utf-8');

  const formattedDate = formatDate(currentDate);

  // Compile the Handlebars template
  const otpMessage = hbs.compile(templateSource)({
    userName: user.name,
    otp,
    companyUrl: 'https://yourcompany.com',
    currentDate: formattedDate,
  });

  // Directly use sendEmail to send OTP
  try {
    await sendEmail({
      email: user.email,
      subject: 'OTP Verification',
      html: otpMessage,
    });

    console.log('OTP sent successfully');
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }

  // Store OTP and its expiration time in your user model
  user.otp = otp;
  user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes expiration
  await user.save();
};

export const sendWelcomeEmail = async (user) => {
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate); // Format the current date

  // Path to the welcome email Handlebars template
  const welcomeTemplatePath = path.join(
    __dirname,
    '../emails/templates/welcome_email.hbs'
  );

  // Read the Handlebars template
  const templateSource = fs.readFileSync(welcomeTemplatePath, 'utf-8');

  // Compile the Handlebars template
  const welcomeMessage = hbs.compile(templateSource);

  // Generate the email content by passing dynamic data to the template
  const htmlContent = welcomeMessage({
    userName: user.name,
    companyUrl: 'https://yourcompany.com',
    currentDate: formattedDate,
    year: new Date().getFullYear(), // Add the year for the footer
  });

  // Send the email using the sendEmail function
  await sendEmail({
    email: user.email,
    subject: 'Welcome to Our Store!',
    html: htmlContent,
  });
};

export const sendPasswordReset = async (user, resetUrl) => {
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);

  const resetTemplatePath = path.join(
    __dirname,
    '../emails/templates/forgot_password.hbs'
  );

  const templateSource = fs.readFileSync(resetTemplatePath, 'utf-8');

  const resetMessage = hbs.compile(templateSource)({
    userName: user.name,
    resetUrl: resetUrl,
  });

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      html: resetMessage,
      currentDate: formattedDate,
    });

    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

export const sendPasswordResetSuccess = async (user) => {
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);

  const resetSuccessTemplatePath = path.join(
    __dirname,
    '../emails/templates/reset_password.hbs'
  );

  const templateSource = fs.readFileSync(resetSuccessTemplatePath, 'utf-8');

  const resetSuccessMessage = hbs.compile(templateSource)({
    userName: user.name,
  });

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Successful',
      html: resetSuccessMessage,
      currentDate: formattedDate,
    });

    console.log('Password reset success email sent successfully');
  } catch (error) {
    console.error('Error sending password reset success email:', error);
    throw new Error('Failed to send password reset success email');
  }
};

// Order Confirmation Function
export const sendOrderConfirmation = async (user, order) => {
  if (!user.email) {
    console.error(
      'User email is missing. Cannot send order confirmation email.'
    );
    throw new Error('User email is required to send order confirmation.');
  }
  const templatePath = path.join(
    __dirname,
    '../emails/templates/order_confirmation.hbs'
  );

  // Convert order to a plain object
  const plainOrder = order.toObject();

  // Read and compile the template source
  const templateSource = fs.readFileSync(templatePath, 'utf-8');
  const orderConfirmationMessage = hbs.compile(templateSource)({
    userName: user.name,
    orderItems: plainOrder.orderItems,
    totalPrice: plainOrder.totalPrice,
    orderStatus: plainOrder.orderStatus,
    createdAt: plainOrder.createdAt,
  });

  // Send email
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Order Confirmation',
      html: orderConfirmationMessage,
    });

    console.log('Order confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw new Error('Failed to send order confirmation email');
  }
};

// Order Status Update Notification Function
export const sendOrderStatusUpdate = async (
  user,
  order,
  customMessage = ''
) => {
  if (!user.email) {
    console.error(
      'User email is missing. Cannot send order status update email.'
    );
    throw new Error('User email is required to send order status update.');
  }

  // Path to the status update email template
  const statusUpdateTemplatePath = path.join(
    __dirname,
    '../emails/templates/order_status_update.hbs'
  );

  // Convert order to a plain object
  const plainOrder = order.toObject();

  plainOrder.orderItems.forEach((item) => {
    item.total = item.quantity * item.price; // Directly calculate total
  });

  // Read and compile the template source
  const templateSource = fs.readFileSync(statusUpdateTemplatePath, 'utf-8');
  const orderStatusUpdateMessage = hbs.compile(templateSource)({
    userName: user.name,
    orderItems: plainOrder.orderItems,
    totalPrice: plainOrder.totalPrice,
    orderStatus: plainOrder.orderStatus,
    createdAt: plainOrder.createdAt,
    shippingInfo: plainOrder.shippingInfo,
    customMessage,
  });

  // Send email
  try {
    await sendEmail({
      email: user.email,
      subject: `Your Order Status Update: ${order.orderStatus}`,
      html: orderStatusUpdateMessage,
    });

    console.log('Order status update email sent successfully');
  } catch (error) {
    console.error('Error sending order status update email:', error);
    throw new Error('Failed to send order status update email');
  }
};
