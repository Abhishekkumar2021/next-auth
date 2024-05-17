import { decodeToken } from "@/helpers/decode-token";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/config/db-config";
import User from "@/models/user";

connectToDB();

export async function GET(request: NextRequest) {
  try {
    const decoded = decodeToken(request);
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "You are not authorized to access this route.",
      });
    }
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 401 });
  }
}
