// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const response = NextResponse.next();

  // Set CORS headers
  response.headers.set("Access-Control-Allow-Origin", "*"); // Mengizinkan semua origin
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  // Jika request adalah OPTIONS, segera respons dengan 200 OK
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  return response;
}

// Pastikan matcher hanya sesuai dengan kebutuhan API
export const config = {
  matcher: ["/api/:path*"], // Middleware hanya diterapkan pada rute /api/*
};
