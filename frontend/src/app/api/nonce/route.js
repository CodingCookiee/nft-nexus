// import { getIronSession } from "iron-session";
// import { cookies } from "next/headers";
// import { generateNonce } from "siwe";
// import { NextResponse } from "next/server";

// const sessionOptions = {
//   cookieName: "siwe",
//   password: process.env.IRON_SESSION_PASSWORD,
//   cookieOptions: {
//     secure: process.env.NODE_ENV === "production",
//   },
// };

// export async function GET() {
//   try {
//     const cookieStore = await cookies();
//     const session = await getIronSession(cookieStore, sessionOptions);

//     session.nonce = generateNonce();
//     await session.save();

  
//     return NextResponse.json({ nonce: session.nonce });
//   } catch (error) {
//     console.error("Error generating nonce:", error);
//     return NextResponse.json({ error: "Failed to generate nonce" }, { status: 500 });
//   }
// }