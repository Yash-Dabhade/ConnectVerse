import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { nanoid } from "nanoid";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be atleast of 6 char"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    verificationToken: String,
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // Check if the password field has been modified
  if (!this.isModified("password")) return next();
  // Hash the password using bcrypt with a salt round of 10
  this.password = await bcrypt.hash(this.password, 10);
  // Move to the next middleware or save operation
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

//generate and return verification password token
userSchema.methods.getVerificationToken = function () {
  //generate a long and random string

  let generatedToken = crypto.randomBytes(20).toString("hex");

  //getting a hash - make sure to get hash on backend
  this.verificationToken = generatedToken;

  return generatedToken;
};

//generate and return forget password token
userSchema.methods.getForgotPasswordToken = function () {
  //generate a long and random string
  const generatedToken = crypto.randomBytes(20).toString("hex");

  //getting a hash - make sure to get hash on backend
  this.forgotPasswordToken = generatedToken;

  //expiry time of the token
  this.forgotPasswordExpiry =
    Date.now() + process.env.FORGOT_PASSWORD_EXPIRY * 24 * 60 * 60 * 1000;

  return generatedToken;
};

export const User = mongoose.model("User", userSchema);
