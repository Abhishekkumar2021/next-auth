import mongoose from "mongoose";
const { Schema } = mongoose;
import jwt from "jsonwebtoken";

enum Role {
    User = "user",
    Admin = "admin",
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: [Role.User, Role.Admin],
        default: Role.User,
    },

    // Tokens & Expire
    forgotPasswordOTP: String,
    forgotPasswordExpire: Date,
    verifyEmailOTP: String,
    verifyEmailExpire: Date,
  },
  { timestamps: true }
);


// Methods 
userSchema.methods.generateToken = function() {
  const payload = {
    id: this._id,
    username: this.username,
    email: this.email,
  }
  
  return jwt.sign(payload, process.env.JWT_TOKEN_SECRET!, {
    expiresIn: process.env.JWT_TOKEN_EXPIRE
  });
}

const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;