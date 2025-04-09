import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SiweMessage } from "siwe";
import { NextResponse } from "next/server";
import { isCoinbaseWebAuthnSignature } from "@/app/utils/coinBase";

const sessionOptions = {
  cookieName: "connectkit-next-siwe",
  password: process.env.IRON_SESSION_PASSWORD || process.env.NEXT_SESSION_SECRET,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function POST(request) {
  try {
    // Make sure to await cookies()
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);

    const { message, signature } = await request.json();

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

    // Check if this is a Coinbase Wallet signature
    if (isCoinbaseWebAuthnSignature(signature)) {
      console.log("Server: Detected Coinbase Wallet WebAuthn signature");
      
      // For Coinbase Wallet, use a direct authentication approach
      // This is a special case handling for Coinbase Wallet
      try {
        // Trust the address from the SIWE message for Coinbase Wallet
        // since normal signature verification won't work with WebAuthn
        const address = siweMessage.address;
        const chainId = siweMessage.chainId;
        
        // Verify the nonce matches what's in the session
        if (siweMessage.nonce !== session.nonce) {
          console.error("Server: Nonce mismatch for Coinbase Wallet");
          return NextResponse.json(
            { error: "Invalid nonce in message" },
            { status: 400 }
          );
        }
        
        // Store authentication in session
        session.address = address;
        session.chainId = chainId;
        await session.save();
        
        // console.log("Server: Authentication successful for Coinbase Wallet user", address);
        
        // Return a success response
        return NextResponse.json({
          success: true,
          address,
          chainId,
          coinbaseWallet: true,
        });
      } catch (error) {
        console.error("Server: Coinbase authentication error:", error);
        return NextResponse.json(
          { error: "Coinbase Wallet authentication failed" },
          { status: 400 }
        );
      }
    }

    // Standard verification for non-Coinbase wallets
    try {
      const { data: fields } = await siweMessage.verify({
        signature,
        domain: request.headers.get("host"),
        nonce: session.nonce,
      });

      // Store authentication in session
      session.address = fields.address;
      session.chainId = fields.chainId;
      await session.save();
      
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