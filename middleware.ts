import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
// import { clerkMiddleware } from "@clerk/nextjs/server";
// import { createRouteMatcher } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: ["/api/:path*"],
  // ignoredRoutes: [`${process.env.MIDDLEWARE_FRONTEND_SUBDOMAIN}/api/:path*`],
  // debug: true,
});
// const isProtectedRoute = createRouteMatcher([
//   '/dashboard(.*)',
//   '/forum(.*)',
// ]);

// export async function middleware(req: NextRequest) {
//   if (req.nextUrl.pathname.startsWith("/api/shiftsStore")) {
//     const res = NextResponse.next();

//     res.headers.append("Access-Control-Allow-Origin", "http://localhost:3001");
    
//     res.headers.append(
//       "Access-Control-Allow-Methods",
//       "GET,DELETE,PATCH,POST,PUT,OPTIONS"
//     );
//     res.headers.append("Access-Control-Allow-Headers", "Content-Type");
//     return res;
//   }
// }

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
