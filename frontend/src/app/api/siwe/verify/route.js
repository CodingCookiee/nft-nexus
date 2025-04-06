import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SiweMessage } from "siwe";
import { NextResponse } from "next/server";

const sessionOptions = {
  cookieName: "connectkit-next-siwe",
  password: process.env.IRON_SESSION_PASSWORD || process.env.NEXT_SESSION_SECRET || "fallback_secret_at_least_32_chars_long",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function POST(request) {
  try {
    // Make sure to await cookies()
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);

    // Log the current session nonce for debugging
    // console.log("Server: Current session nonce:", session.nonce);

    const { message, signature } = await request.json();
    // console.log("Server: Received message:", message);
    // console.log("Server: Received signature:", signature);

    // Parse the message
    let siweMessage;
    try {
      siweMessage = new SiweMessage(message);
    } catch (error) {
      console.error("Server: Error parsing message:", error);
      return NextResponse.json(
        { error: `Error parsing message: ${error.message}` },
        { status: 400 }
      );
    }

    // Verify the signature
    try {
      const { data: fields } = await siweMessage.verify({
        signature,
        domain: request.headers.get("host"),
        nonce: session.nonce,
      });

      // console.log("Server: Verification successful:", fields);

      // Store authentication in session
      session.address = fields.address;
      session.chainId = fields.chainId;
      await session.save();

      // console.log("Server: Authentication successful for", fields.address);
      
      // Return a success response
      return NextResponse.json({
        success: true,
        address: fields.address,
        chainId: fields.chainId,
      });
    } catch (error) {
      console.error("Server: Verification error:", error);
      return NextResponse.json(
        { error: `Verification error: ${error.message}` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Server: SIWE verification error", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
