import { authMiddleware } from "@clerk/nextjs";
import { is } from "date-fns/locale";
import { NextRequest, NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/api/:path*"],
  ignoredRoutes: ["localhost:3001/api/:path*"],
  // debug: true,
});

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
  matcher: ["/((?!.*\\..*|_next).*)", "/", '/(api|trpc)(.*)'],
};
