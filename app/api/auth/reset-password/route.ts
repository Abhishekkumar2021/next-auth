import { connectToDB } from "@/config/db-config";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import jwt from "jsonwebtoken";
import { hash } from "bcryptjs";

connectToDB();

export async function POST(request: NextRequest) {
  try {
    // extract token and password from the request body
    const { token, password } = await request.json();

    // If token or password is not provided
    if (!token || !password) {
      return NextResponse.json(
        {
          message: "Token or password not provided",
          success: false,
        },
        { status: 400 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_TOKEN_SECRET!);
    if (!decoded) {
      return NextResponse.json(
        {
          message: "Invalid token",
          success: false,
        },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.id);
    
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }
    

    // If token is expired
    if (user.passwordResetExpire < new Date() || token !== user.passwordResetToken) {
      return NextResponse.json(
        {
          message: "Token expired",
          success: false,
        },
        { status: 400 }
      );
    }

    // hash the password
    const hashedPassword = await hash(password, 10);

    // Update user password
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      passwordResetToken: "",
      passwordResetExpire: undefined,
    });

    return NextResponse.json(
      {
        message: "Password updated successfully",
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
