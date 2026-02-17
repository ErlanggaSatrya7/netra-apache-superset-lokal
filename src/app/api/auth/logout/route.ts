import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    // Bantai semua cookies
    cookieStore.set("titan_session_token", "", {
      expires: new Date(0),
      path: "/",
    });
    cookieStore.set("user_role", "", { expires: new Date(0), path: "/" });
    return NextResponse.json({ success: true, redirect: "/login" });
  } catch (e) {
    return NextResponse.json(
      { error: "LOGOUT_PROTOCOL_FAILED" },
      { status: 500 }
    );
  }
}
