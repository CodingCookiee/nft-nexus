"use client";

import { configureClientSIWE } from "connectkit-next-siwe";

export const siweClient = configureClientSIWE({
  apiRoutePrefix: "/api/siwe", // This should match your route folder structure 
  statement: "Sign In With Ethereum to prove you control this wallet.",
  getNonce: async () => {
    try {
      const res = await fetch("/api/siwe/nonce");
      if (!res.ok) throw new Error("Failed to fetch nonce");
      
      // Get the nonce as plain text
      const nonce = await res.text();
      
      // Check if the nonce is valid
      if (!nonce || nonce.includes('{') || nonce.includes('}')) {
        // console.error("Invalid nonce format:", nonce);
        throw new Error("Invalid nonce format received from server");
      }
      
      // console.log("Nonce fetched:", nonce);
      return nonce;
    } catch (error) {
      // console.error("Error fetching nonce:", error);
      throw error;
    }
  },
  verifyMessage: async ({ message, signature }) => {
    try {
      const res = await fetch("/api/siwe/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, signature }),
      });
      
      if (!res.ok) throw new Error("Failed to verify message");
      return await res.json();
    } catch (error) {
      console.error("Error verifying message:", error);
      throw error;
    }
  },
  getSession: async () => {
    try {
      const res = await fetch("/api/siwe/session");
      if (!res.ok) throw new Error("Failed to fetch session");
      return await res.json();
    } catch (error) {
      console.error("Error fetching session:", error);
      throw error;
    }
  },
  signOut: async () => {
    try {
      // console.log("Client: Attempting to sign out");
      
      // Try GET request first (which should work now)
      let res = await fetch("/api/siwe/logout");
      
      // If GET fails, try POST as fallback
      if (!res.ok) {
        // console.log("Client: GET logout failed, trying POST");
        res = await fetch("/api/siwe/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      
      if (!res.ok) {
        console.error("Client: Sign out failed with status:", res.status);
        throw new Error("Failed to sign out");
      }
      
      const data = await res.json();
      // console.log("Client: Sign out response:", data);
      return data;
    } catch (error) {
      console.error("Client: Error signing out:", error);
      // Return success even if there's an error to allow UI to update
      return { success: true };
    }
  },
});
