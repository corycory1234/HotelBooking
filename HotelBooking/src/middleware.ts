import { NextRequest, NextResponse } from "next/server";
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  // matcher: ['/', '/(en|zh-TW)/:path*']
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

// export function middleware (request: NextRequest) {
//   // const { pathname } = request.nextUrl;

  
//   // 1. 若是系統或靜態資源路徑，就不管它
//   // if (
//   //   pathname.startsWith('/_next') ||
//   //   pathname.startsWith('/api') ||
//   //   pathname.startsWith('/favicon.ico') ||
//   //   pathname.startsWith('/robots.txt') ||
//   //   pathname.startsWith('/assets') ||       // 視你的專案而定
//   //   pathname.match(/\.(png|jpg|jpeg|gif|svg|css|js|json|ico)$/) // 擴充排除各種檔案
//   // ) {
//   //   return NextResponse.next();
//   // }

//   // // 2. 若已經是 /en 或 /zh-TW 前綴 -> 不理會
//   // if (/^\/(en|zh-TW)(\/|$)/.test(pathname)) {
//   //   return NextResponse.next();
//   // }

//   // // 3. 只在根路徑 "/" 做語言偵測，其它路徑直接通過
//   // if (pathname === '/') {
//   //   const acceptLanguage = request.headers.get('accept-language')?.toLowerCase() || '';
//   //   const preferredLocale = acceptLanguage.includes('zh') ? 'zh-TW' : 'en';
//   //   return NextResponse.redirect(new URL(`/${preferredLocale}`, request.url));
//   // }

//   // // 4. 其餘情況就直接放行
//   // return NextResponse.next();

//   const access_token = request.cookies.get('access_token')?.value;
//   const refresh_token = request.cookies.get('refresh_token')?.value;

//   if(request.nextUrl.pathname === "/creditcard") {
//     if(!access_token && !refresh_token) {
//       return NextResponse.redirect(new URL("/auth", request.url))
//     } 
//   };

// };


// export const config = {
//   // matcher: ['/((?!.*\\.).*)', '/'], 
//   // matcher: ['/', '/((?!en|zh-TW).*)'],
//   // matcher: '/((?!en-US|zh-TW).*)',
//   // matcher: ['/'],
//   matcher: ["/creditcard"]
//   // matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)']
// }