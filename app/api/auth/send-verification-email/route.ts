import { connectToDB } from "@/config/db-config";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { decodeToken } from "@/helpers/decode-token";
import { generate } from "otp-generator";
import { sendMail } from "@/helpers/mailer";

connectToDB();

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 10px; background-color: #fff; display:flex; justify-content:center; align-items:center;">
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; ">
        <h2 style="color: #333; text-align: center;">OTP Email</h2>
        <p style="color: #666; line-height: 1.6; text-align: center;">Your One Time Password (OTP) is:</p>
        <div style="font-size: 24px; text-align: center; margin-bottom: 30px;"><strong>{{OTP_CODE}}</strong></div>
        <p style="color: #999; text-align: center;">Please use this OTP to complete your action. This OTP is valid for a {{TIME}} minutes.</p>
        <p style="margin-top: 30px; text-align: center; color: #999;">This email was sent to you in response to your request. If you didn't request this, you can safely ignore this email.</p>
    </div>
</body>
</html>

`

export async function POST(request: NextRequest) {
  try {
    // First we will check if user is loggged in or not & also if user is already verified or not
    const decoded = decodeToken(request);
    if (!decoded) {
      return NextResponse.json(
        {
          message: "Please login first",
          success: false,
        },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.id);
    if (user.isVerified) {
      return NextResponse.json(
        {
          message: "User is already verified",
          success: false,
        },
        { status: 200 }
      );
    }

    // Generate OTP
    const otp = generate(6, {
      digits: true,
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });

    console.log(otp);

    // Save OTP in database
    await User.findByIdAndUpdate(decoded.id, {
      verifyEmailOTP: otp,
      verifyEmailExpire: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Send OTP to user's email
    const info = await sendMail(
      user.email,
      "Verify your email",
      html.replace("{{OTP_CODE}}", otp).replace("{{TIME}}", "10")
    );

    if (!info) {
      return NextResponse.json(
        {
          message: "Failed to send OTP",
          success: false,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "OTP sent to your email",
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
