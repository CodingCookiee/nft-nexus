import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SiweMessage } from "siwe";
import { NextResponse } from "next/server";

const sessionOptions = {
  cookieName: "siwe",
  password: process.env.NEXT_IRON_SESSION_PASSWORD,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function POST(request) {
  const session = await getIronSession(cookies(), sessionOptions);

  try {
    const { message, signature } = await request.json();
    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.verify({ signature });

    if (fields.data.nonce !== session.nonce) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid nonce",
        },
        {
          status: 422,
        }
      );
    }
    session.siwe = fields;
    await session.save();
  } catch (error) {
    console.error("SIWE verification error", error);
    return NextResponse.json(
      {
        ok: false,
        message: error.message,
      },
      {
        status: 400,
      }
    );
  }
}
