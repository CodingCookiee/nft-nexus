import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { generateNonce } from "siwe";
import { NextResponse } from "next/server";

const sessionOptions = {
  cookieName: "connectkit-next-siwe",
  password:
    process.env.IRON_SESSION_PASSWORD || process.env.NEXT_SESSION_SECRET,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);

    session.nonce = generateNonce();
    await session.save();

    return new NextResponse(session.nonce, {
      status: 200,
      success: true,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("Error generating nonce :", error);
    return NextResponse.json({ error: "Failed to generate nonce" }, { status: 400 });
  }
}
