import { connectToDB } from "@/config/db-config";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connectToDB();

// GET /api/users/signup
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Please provide all fields",
          success: false,
        },
        { status: 400 }
      );
    }

    // Check if user exists or not
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      )
    }

    // Compare passwords
    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        {
          message: "Invalid password",
          success: false,
        },
        { status: 400 }
      );
    }

    // Generate token and send it in form of cookie
    const token = user.generateToken();

    const reponse = NextResponse.json(
      {
        message: "Logged in successfully",
        success: true,
        data: {
          token,
        },
      },
      { status: 200 }
    );
    
    reponse.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE!) * 24 * 60 * 60 * 1000),
    });

    return reponse;
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}
