import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import validator from 'validator';

// Define schema
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false, // Prevent returning password by default in queries
  },
  image: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  avatar: [
    {
      public_id: {
        type: String,
        required: [true, 'Image public ID is required'],
      },
      url: { type: String, required: [true, 'Image URL is required'] },
    },
  ],
  shippingInfo: {
    address: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    postalCode: {
      type: Number,
      required: false,
    },
    phoneNo: {
      type: String,
      required: false,
    },
  },
  birthday: {
    type: Date,
  },
  bio: {
    type: String,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  otp: String,
  otpExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

// Generate username if not provided
schema.pre('save', async function (next) {
  // Hash password if it is new or modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Generate username if it is a new document or name is modified
  if (this.isModified('name') || this.isNew) {
    const initials = this.name.substring(0, 3);
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    const randomUsername = `${initials}-${randomNumber}`;
    this.username = randomUsername;
  }

  next();
});

// jwt token
schema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// compare password
schema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generating Passwod Reset Token
schema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Expires in 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

schema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
schema.set('toJSON', {
  virtuals: true,
});

// Define model
const User = mongoose.model('User', schema);

export default User;
