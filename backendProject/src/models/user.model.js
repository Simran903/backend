import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define a new Mongoose schema for the User model
const userSchema = new mongoose.Schema(
  {
    // Username field: Required, unique, stored in lowercase, trimmed, and indexed for faster queries
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    // Email field: Required, unique, stored in lowercase, and trimmed
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Full name field: Required, trimmed, and indexed for faster queries
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    // Avatar field: Required, stores a URL or path to the user's avatar image
    avatar: {
      type: String,
      required: true,
    },
    // Cover image field: Required, stores a URL or path to the user's cover image
    coverImage: {
      type: String
    },
    // Watch history field: Array of references to Video documents (stores video IDs)
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    // Password field: Required, includes a custom validation error message if not provided
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    // Refresh token field: Optional, stores a token used for generating new access tokens
    refreshToken: {
      type: String,
    },
  },
  {
    // Automatically add `createdAt` and `updatedAt` timestamps
    timestamps: true,
  }
);

// Pre-save middleware: Hash the password before saving if it's modified or new
userSchema.pre("save", async function (next) {
  // If the password hasn't been modified, skip hashing and proceed to the next middleware
  if (!this.isModified("password")) return next();

  // Hash the password using bcrypt with a salt factor of 10
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Instance method: Compare a plain-text password with the hashed password stored in the database
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
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

// Export the User model, which is based on the userSchema
export const User = mongoose.model("User", userSchema);
