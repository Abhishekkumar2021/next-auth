import { connectToDB } from "@/config/db-config";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { decodeToken } from "@/helpers/decode-token";

connectToDB();

export async function POST(request: NextRequest) {
  try {
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

    // Get the OTP from the request body
    const body = await request.json();

    // If OTP is not provided
    if (!body?.otp) {
      return NextResponse.json(
        {
          message: "Please provide OTP",
          success: false,
        },
        { status: 400 }
      );
    }

    // Check if the OTP is valid
    if (body.otp !== user.verifyEmailOTP || new Date() > user.verifyEmailExpire) {
      return NextResponse.json(
        {
          message: "Invalid OTP",
          success: false,
        },
        { status: 400 }
      );
    }

    // Update the user as verified
    await User.findByIdAndUpdate(decoded.id, {
      isVerified: true,
    });

    return NextResponse.json(
      {
        message: "Email is verified successfully",
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
