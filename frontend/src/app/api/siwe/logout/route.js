import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const sessionOptions = {
  cookieName: "connectkit-next-siwe",
  password: process.env.IRON_SESSION_PASSWORD || process.env.NEXT_SESSION_SECRET || "fallback_secret_at_least_32_chars_long",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

// Helper function to clear the session
async function clearSession() {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);

    // Clear the session
    session.address = undefined;
    session.chainId = undefined;
    session.siwe = undefined;
    await session.save();

    console.log("Server: Session cleared successfully");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging out:", error);
    return NextResponse.json(
      { error: "Failed to log out" },
      { status: 500 }
    );
  }
}

// Support both POST and GET methods for logout
export async function POST() {
  return clearSession();
}

export async function GET() {
  return clearSession();
}
