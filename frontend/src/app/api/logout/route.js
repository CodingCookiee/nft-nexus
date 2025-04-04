// import { getIronSession } from "iron-session";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// const sessionOptions = {
//   cookieName: "siwe",
//   password: process.env.IRON_SESSION_PASSWORD,
//   cookieOptions: {
//     secure: process.env.NODE_ENV === "production",
//   },
// };

// export async function POST() {
//   try {
//     const cookieStore = await cookies();
//     const session = await getIronSession(cookieStore, sessionOptions);
    
//     // Clear session
//     session.destroy();
    
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error signing out:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }