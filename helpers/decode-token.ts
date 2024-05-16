import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function decodeToken(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value || "";
        const decoded : any = jwt.verify(token, process.env.JWT_TOKEN_SECRET!);
        return decoded; 
    } catch (error: any) {
        throw new Error(error.message);
    }
}