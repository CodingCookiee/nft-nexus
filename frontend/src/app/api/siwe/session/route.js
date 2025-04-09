import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const sessionOptions = {
  cookieName: "connectkit-next-siwe",
  password: process.env.IRON_SESSION_PASSWORD || process.env.NEXT_SESSION_SECRET,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function GET() {
  try {
    // Make sure to await cookies()
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);

    // console.log("Server: Session data:", {
    //   address: session.address,
    //   chainId: session.chainId
    // });

    // Check if user is authenticated
    if (!session.address) {
      console.log("Server: User not authenticated");
      return NextResponse.json({ address: null });
    }

    // Return session data
    return NextResponse.json({
      address: session.address,
      chainId: session.chainId,
    });
  } catch (error) {
    console.error("Error getting session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
