import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: [
        '/',
        '/profile/:id*',
        '/dashboard',
        '/login',
        '/signup',
    ]
}


export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const isPublic = [
        '/',
        '/login',
        '/signup',
    ].includes(path);
    
    // Getting the token from the cookie
    const token = request.cookies.get("token")?.value || "";

    if(isPublic && token){
        return NextResponse.redirect(new URL("/dashboard", request.nextUrl))
    }

    if(!isPublic && !token){
        return NextResponse.redirect(new URL("/login", request.nextUrl))
    }
}