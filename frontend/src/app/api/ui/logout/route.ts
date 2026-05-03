import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? new URL(req.url).origin;
    const cookieStore = await cookies();

    // ✅ serialize cookies for server-to-server request
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    // ✅ call Better Auth sign-out with forwarded cookies
    await fetch(`${baseUrl}/api/auth/sign-out`, {
      method: "POST",
      headers: {
        cookie: cookieHeader,
      },
    });

    // ✅ clear cookies on RESPONSE (this is what the browser listens to)
    const res = NextResponse.redirect(new URL("/login", req.url));

    cookieStore.getAll().forEach((c) => {
      // If you know exact cookie names, use that list (better than includes)
      if (c.name.includes("auth") || c.name.includes("session")) {
        // Works for most cookies
        res.cookies.set(c.name, "", { path: "/", maxAge: 0 });

        // Also try without path (some setups)
        res.cookies.set(c.name, "", { maxAge: 0 });
      }
    });

    return res;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
