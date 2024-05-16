import { decodeToken } from "@/helpers/decode-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const decoded = decodeToken(request);

        // If user is not logged in
        if (!decoded) {
            return NextResponse.json({
                message: "Please login first",
                success: false
            }, { status: 401 });
        }

        // Clear the cookie
        const response = NextResponse.json({
            message: "User logged out successfully",
            success: true
        }, { status: 200 });
        response.cookies.delete("token");

        return response;
    } catch (error: any) {
        NextResponse.json({
            message: error.message,
            success: false
        }, { status: 500 });
    }
}