import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SiweMessage } from "siwe";
import { NextResponse } from "next/server";
import { isCoinbaseWebAuthnSignature } from "@/app/utils/coinBase";

const sessionOptions = {
  cookieName: "connectkit-next-siwe",
  password:
    process.env.IRON_SESSION_PASSWORD || process.env.NEXT_SESSION_SECRET,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
};

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);

    const { message, signature } = await request.json();

    let siweMessage;

    try {
      siweMessage = new SiweMessage(message);
    } catch (error) {
      console.error("Server: Error parsing the message", error);
      return NextResponse.json(
        { error: `Error Parsing Message: ${error.message}` },
        { status: 400 }
      );
    }

    if (isCoinbaseWebAuthnSignature(signature)) {
      try {
        const address = siweMessage.address;
        const chainId = siweMessage.chainId;

        if (siweMessage.nonce !== session.nonce) {
          console.error("Server: Nonce mismatch for Coinbase Wallet");
          return NextResponse.json(
            { error: "Invalid nonce in siweMessage" },
            { status: 400 }
          );
        }

        session.address = address;
        session.chainId = chainId;
        await session.save();

        return NextResponse.json({
          success: true,
          address,
          chainId,
          coinbaseWallet: true,
        });
      } catch (error) {
        console.error("Server: Coinbase authentication error", error);
        return NextResponse.json(
          { error: "Coinbase Wallet authentication failed" },
          { status: 400 }
        );
      }
    }

    try {
      const { data: fields } = await siweMessage.verify({
        signature,
        domain: request.headers.get("host"),
        nonce: session.nonce,
      });

      session.address = fields.address;
      session.chainId = fields.chainId;
      await session.save();

      return NextResponse.json({
        success: true,
        address: fields.address,
        chainId: fields.chainId,
      });
    } catch (error) {
      console.error("Server: Error Verification", error);
      return NextResponse.json(
        { error: `Verification Error: ${erorr.message}` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Server: SIWE verification error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
