import { NextRequest, NextResponse } from "next/server";

export function middleware (request: NextRequest) {
  const access_token = request.cookies.get('access_token')?.value;
  const refresh_token = request.cookies.get('refresh_token')?.value;

  if(request.nextUrl.pathname === "/creditcard") {
    if(!access_token && !refresh_token) {
      return NextResponse.redirect(new URL("/auth", request.url))
    }
  }

  // console.log(access_tokentoken, refresh_token);
  // return NextResponse.next()

};

export const config = {
  matcher: ["/creditcard"]
  // matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)']
}