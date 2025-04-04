import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { generateNonce } from "siwe";
import { NextResponse } from "next/server";

const sessionOptions = {
  cookieName: "siwe",
  password: process.env.IRON_SESSION_PASSWORD,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function GET() {
  const session = await getIronSession(cookies(), sessionOptions);

  session.nonce = generateNonce();
  await session.save();

  return new NextResponse({ nonce: session.nonce }, {
    status: 200,
    message: "Nonce generated",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
