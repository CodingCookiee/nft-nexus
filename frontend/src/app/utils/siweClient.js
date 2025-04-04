"use client";

import { SIWEConfig } from "connectkit";
import { SiweMessage } from "siwe";

export const siweConfig = {
  getNonce: async () => {
    console.log("Fetching nonce...");
    try {
      const res = await fetch("/api/nonce");
      console.log("Nonce response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to fetch nonce:", errorText);
        throw new Error(`Failed to fetch nonce: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      console.log("Nonce received:", data.nonce);
      return data.nonce;
    } catch (error) {
      console.error("Error in getNonce:", error);
      throw error;
    }
  },

  createMessage: ({ nonce, address, chainId }) => {
    const message = new SiweMessage({
      domain: window.location.host,
      address: address,
      statement: "Sign In With Ethereum to prove you control this wallet.",
      uri: window.location.origin,
      version: "1",
      chainId: chainId,
      nonce: nonce,
      issuedAt: new Date().toISOString(),
    });
    console.log("Created SIWE message:", message);
    return message;
  },

  verifyMessage: async ({ message, signature }) => {
    console.log("Verifying message:", { message, signature });
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, signature }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error verifying message:", errorText);
        throw new Error(`Error verifying message: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      console.log("Verification result:", data);
      return data;
    } catch (error) {
      console.error("Error in verifyMessage:", error);
      throw error;
    }
  },

  // Add the missing methods required by ConnectKit
  getSession: async () => {
    console.log("Getting session...");
    try {
      const res = await fetch("/api/session");
      if (!res.ok) {
        if (res.status === 401) {
          return null; // Not authenticated
        }
        throw new Error(`Failed to get session: ${res.status}`);
      }

      const data = await res.json();
      console.log("Session data:", data);
      return data;
    } catch (error) {
      console.error("Error getting session:", error);
      return null;
    }
  },

  signOut: async () => {
    console.log("Signing out...");
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(`Failed to sign out: ${res.status}`);
      }

      console.log("Signed out successfully");
      return true;
    } catch (error) {
      console.error("Error signing out:", error);
      return false;
    }
  },
};
