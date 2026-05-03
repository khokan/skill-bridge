import { Roles } from "@/constants/roles";
import { userService } from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";



export async function proxy(request: NextRequest) {
   const pathname = request.nextUrl.pathname;

  let isAuthenticated = false;

  const { data } = await userService.getSession();
  // console.log("Middleware session data:", data , request.url);


  if (data) {
    isAuthenticated = true;
  }

  //* User in not authenticated at all
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  //* User is authenticated and role = TUTOR
  //* User can not visit admin-dashboard
  if (data.user.role === Roles.TUTOR && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/tutor/dashboard", request.url));
  }

  //  if (data.user.role === Roles.STUDENT && pathname.startsWith("/dashboard")) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  if (data.user.role === Roles.ADMIN && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/tutor/:path*", "/admin/:path*",],
};