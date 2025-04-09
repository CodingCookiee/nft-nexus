import { getIronSession } from "iron-session";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const sessionOptions = {
  cookieName: "connectkit-next-siwe",
  password:
    process.env.IRON_SESSION_PASSWORD || process.evn.NEXT_SESSION_SECRET,
  cookiesOptions: {
    secure: process.env.NODE_ENV == "production",
    sameSite: "lax",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
  },
};

async function clearSession() {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);

    await session.destroy();

    return NextResponse.json({
      success: true,
    });
    session;
  } catch (error) {
    console.error("Error logging out", error);
    return NextResponse.json(
      { error: "Failed to logout user" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return clearSession();
}

export async function GET() {
  return clearSession();
}
