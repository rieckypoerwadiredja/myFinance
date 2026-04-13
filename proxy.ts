import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy() {
    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  },
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth/signin).*)"],
};
