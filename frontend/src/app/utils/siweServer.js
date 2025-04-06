import { SiweMessage } from "siwe";
import { createHash, randomBytes } from "crypto";
import { getIronSession } from "iron-session";
import { NextResponse } from "next/server";
import { mainnet } from "wagmi/chains";
import { http, createPublicClient } from "viem";

// Create a public client for verifying messages
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
});

// Session configuration
const sessionConfig = {
  cookieName: "connectkit-next-siwe",
  password: process.env.IRON_SESSION_PASSWORD || process.env.NEXT_SESSION_SECRET ,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
  },
};

// Helper to get session from request
async function getSession(request) {
  const session = await getIronSession(request.cookies, sessionConfig);
  return session;
}

// Generate a random nonce
function generateNonce() {
  // Generate a random alphanumeric string of length 16
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = randomBytes(16);
  
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(randomValues[i] % chars.length);
  }
  
  return result;
}

// Verify a SIWE message
async function verifyMessage({ message, signature }) {
  try {
    const siweMessage = new SiweMessage(message);
    
    // Parse the message to get the domain
    const parsedMessage = siweMessage.toMessage();
    const domain = parsedMessage.domain || "localhost:3000";
    
    const fields = await siweMessage.verify({
      signature,
      domain,
    });

    if (fields.success) {
      return {
        success: true,
        data: {
          address: fields.data.address,
          chainId: fields.data.chainId,
        },
      };
    }

    return {
      success: false,
      error: "Invalid signature",
    };
  } catch (error) {
    console.error("Error verifying message:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Clear the session
async function clearSession(request) {
  const session = await getSession(request);
  session.destroy();
  return { success: true };
}

// API route handler
async function apiRouteHandler(request, { params }) {
  const { route } = params;
  const routeName = Array.isArray(route) ? route[0] : route;

  switch (routeName) {
    case "nonce":
      return NextResponse.json({ nonce: generateNonce() });

    case "verify":
      if (request.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
      }
      
      try {
        const body = await request.json();
        const { message, signature } = body;
        
        if (!message || !signature) {
          return NextResponse.json(
            { error: "Message and signature are required" },
            { status: 400 }
          );
        }

        const result = await verifyMessage({ message, signature });
        
        if (!result.success) {
          return NextResponse.json(
            { error: result.error },
            { status: 400 }
          );
        }

        const session = await getSession(request);
        session.siwe = {
          address: result.data.address,
          chainId: result.data.chainId,
        };
        await session.save();
        
        return NextResponse.json({ success: true, session: session.siwe });
      } catch (error) {
        console.error("Error in verify route:", error);
        return NextResponse.json(
          { error: "Failed to verify message" },
          { status: 500 }
        );
      }

    case "session":
      try {
        const session = await getSession(request);
        
        if (!session.siwe) {
          return NextResponse.json({ address: null });
        }
        
        return NextResponse.json(session.siwe);
      } catch (error) {
        console.error("Error in session route:", error);
        return NextResponse.json(
          { error: "Failed to get session" },
          { status: 500 }
        );
      }

    case "logout":
      if (request.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
      }
      
      try {
        await clearSession(request);
        return NextResponse.json({ success: true });
      } catch (error) {
        console.error("Error in logout route:", error);
        return NextResponse.json(
          { error: "Failed to log out" },
          { status: 500 }
        );
      }

    default:
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
  }
}

export const siweServer = {
  getSession,
  generateNonce,
  verifyMessage,
  clearSession,
  apiRouteHandler,
};
