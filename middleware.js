import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export async function middleware(request) {
    const token = await getToken({
        req : request,
        secret: process.env.AUTH_SECRET
    });
    const pathname = request.nextUrl.pathname;
    console.log(token);
    if((pathname === "/signin" || pathname === "/signup") && token){
        return NextResponse.redirect(new URL('/', request.url));
    }
    else if(pathname === '/dashboard' && !token){
        return NextResponse.redirect(new URL('/signin', request.url));

    }
    return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/signin", "/signup"],
};
