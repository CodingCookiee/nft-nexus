import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const sessionOptions = {
  cookieName: "siwe",
  password: process.env.IRON_SESSION_PASSWORD,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);

    // Check if user is authenticated
    if (!session.siwe?.data?.address) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Return session data
    return NextResponse.json({
      address: session.siwe.data.address,
      chainId: session.siwe.data.chainId,
      issuedAt: session.siwe.data.issuedAt,
    });
  } catch (error) {
    console.error("Error getting session:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
