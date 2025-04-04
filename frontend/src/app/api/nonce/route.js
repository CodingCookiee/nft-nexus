import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { generateNonce } from "siwe";
import { NextResponse } from "next/server";

const sessionOptions = {
  cookieName: "siwe",
  password: process.env.NEXT_IRON_SESSION_PASSWORD,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function GET() {
  const session = await getIronSession(cookies(), sessionOptions);

  session.nonce = generateNonce();
  await session.save();

  return new NextResponse(session.nonce, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
