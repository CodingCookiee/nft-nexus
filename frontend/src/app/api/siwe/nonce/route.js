import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { generateNonce } from "siwe";
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

    // Generate a nonce using siwe's generateNonce function
    session.nonce = generateNonce();
    await session.save();

    // console.log("Generated nonce:", session.nonce);
    
    // Return the nonce as plain text, not JSON
    return new Response(session.nonce, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error("Error generating nonce:", error);
    return NextResponse.json({ error: "Failed to generate nonce" }, { status: 500 });
  }
}
