import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * TITAN AUTH GATEWAY v31.0
 * Logic: Validating Seeding Identities (Adidas Dataset Ready)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 1. NEURAL LOOKUP
    const user = await prisma.users.findUnique({
      where: { email: email },
    });

    // 2. IDENTITY VALIDATION
    if (!user) {
      return NextResponse.json({ error: "NODE_NOT_FOUND" }, { status: 404 });
    }

    if (user.password !== password) {
      return NextResponse.json(
        { error: "SECURITY_KEY_MISMATCH" },
        { status: 401 }
      );
    }

    // 3. SESSION HANDSHAKE (Simple session for v31.0)
    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        role: user.role,
        id: user.id,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "INTERNAL_AUTH_FAILURE" },
      { status: 500 }
    );
  }
}
