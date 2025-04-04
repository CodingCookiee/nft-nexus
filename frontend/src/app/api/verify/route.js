// import { getIronSession } from "iron-session";
// import { cookies } from "next/headers";
// import { SiweMessage } from "siwe";
// import { NextResponse } from "next/server";

// const sessionOptions = {
//   cookieName: "siwe",
//   password: process.env.IRON_SESSION_PASSWORD,
//   cookieOptions: {
//     secure: process.env.NODE_ENV === "production",
//   },
// };

// export async function POST(request) {
//   try {
//     const cookieStore = await cookies();
//     const session = await getIronSession(cookieStore, sessionOptions);

//     // Log the current session nonce for debugging
//     console.log("Server: Current session nonce:", session.nonce);

//     const { message, signature } = await request.json();
//     console.log("Server: Received message type:", typeof message);
//     console.log("Server: Received message:", message);
//     console.log("Server: Received signature:", signature);

//     // Create SIWE message based on what was received
//     let siweMessage;
//     try {
//       if (typeof message === "string") {
//         // Try to parse as JSON if it's a string
//         console.log("Server: Parsing message from string");
//         siweMessage = new SiweMessage(JSON.parse(message));
//       } else if (typeof message === "object") {
//         // If it's already an object, pass directly
//         console.log("Server: Using message object directly");

//         // If it's a SIWE message object with prepareMessage method
//         if (message.prepareMessage) {
//           siweMessage = message;
//         } else {
//           // If it's a plain object, create new SIWE message
//           siweMessage = new SiweMessage(message);
//         }
//       } else {
//         throw new Error("Invalid message format");
//       }

//       console.log("Server: Parsed SIWE message:", siweMessage);
//     } catch (parseError) {
//       console.error("Server: Error parsing message:", parseError);
//       return NextResponse.json(
//         {
//           ok: false,
//           message: `Error parsing message: ${parseError.message}`,
//         },
//         {
//           status: 400,
//         }
//       );
//     }

//     // Verify the message
//     try {
//       const fields = await siweMessage.verify({ signature });
//       console.log("Server: Verification fields:", fields);

//       if (!fields || !fields.data || !fields.data.nonce) {
//         throw new Error("Invalid verification result");
//       }

//       if (fields.data.nonce !== session.nonce) {
//         console.error("Server: Nonce mismatch:", {
//           messageNonce: fields.data.nonce,
//           sessionNonce: session.nonce,
//         });

//         return NextResponse.json(
//           {
//             ok: false,
//             message: "Invalid nonce",
//           },
//           {
//             status: 422,
//           }
//         );
//       }

//       // Store authentication in session
//       session.siwe = fields;
//       session.address = fields.data.address;
//       await session.save();

//       console.log("Server: Authentication successful for", fields.data.address);
//       // Return a success response
//       return NextResponse.json({
//         ok: true,
//         address: fields.data.address,
//       });
//     } catch (verifyError) {
//       console.error("Server: Verification error:", verifyError);
//       return NextResponse.json(
//         {
//           ok: false,
//           message: `Verification error: ${verifyError.message}`,
//         },
//         {
//           status: 400,
//         }
//       );
//     }
//   } catch (error) {
//     console.error("Server: SIWE verification error", error);
//     return NextResponse.json(
//       {
//         ok: false,
//         message: error.message,
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }
