import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: [
        '/',
        '/auth/:path*',
    ]
}


export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const isPublic = [
        '/',
        '/auth/login',
        '/auth/signup',
        '/auth/forgot-password',
        '/auth/reset-password',
    ].includes(path);
    
    // Getting the token from the cookie
    const token = request.cookies.get("token")?.value || "";

    if(isPublic && token){
        return NextResponse.redirect(new URL("/user/dashboard", request.nextUrl))
    }

    if(!isPublic && !token){
        return NextResponse.redirect(new URL("/auth/login", request.nextUrl))
    }
}