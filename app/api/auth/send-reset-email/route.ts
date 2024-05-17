import { connectToDB } from "@/config/db-config";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { sendMail } from "@/helpers/mailer";
import jwt from "jsonwebtoken";

connectToDB();

const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border: 1px solid #ddd;">
        <p>Dear {{USERNAME}},</p>
        <p>We received a request to reset the password for your account associated with this email address. If you made this request, please follow the instructions below to reset your password.</p>
        <p style="text-align: center;">
            <a href="{{RESET_URL}}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </p>
        <p>If you did not request a password reset, please disregard this email. Your account is secure, and no changes will be made.</p>
        <p>For your security, this link will expire in {{HOUR}} hours. If the link has expired, you can request a new one by visiting our <a href="{{REQUEST_URL}}">password reset page</a>.</p>
    </div>
</body>
</html>

`;

export async function POST(request: NextRequest) {
  try {
    // First we will grab the registered email from the request body
    const { email } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }

    // Generate a reset token
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
    }
    
    const resetToken =  jwt.sign(payload, process.env.JWT_TOKEN_SECRET!, {
      expiresIn: "1h"
    });

    // Save reset token in database
    await User.findByIdAndUpdate(user._id, { passwordResetToken: resetToken });

    // Send token to user's email
    const info = await sendMail(
      user.email,
      "Reset Your Password",
      html
        .replace("{{USERNAME}}", user.username)
        .replace(
          "{{RESET_URL}}",
          `${process.env.BASE_URL}/auth/reset-password/?token=${resetToken}`
        )
        .replace("{{HOUR}}", "1")
        .replace(
          "{{REQUEST_URL}}",
          `${process.env.BASE_URL}/auth/forgot-password`
        )
    );

    if (!info) {
      return NextResponse.json(
        {
          message: "Failed to send email to your registered email address",
          success: false,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Email sent successfully to your registered email address",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}
