"use client";

import { SIWEConfig } from "connectkit";
import { SiweMessage } from "siwe";

export const siweConfig = {
  getNonce: async () => {
    console.log("Fetching nonce...");
    try {
      const res = await fetch("/api/nonce");

      console.log("Nonce response :", res.status);

      const resClone = await res.clone();
      const resText = await resClone.text();
      console.log("Nonce response text:", resText);
    
      
      if (!res.ok) {
      
        console.error("Failed to fetch nonce:", resText);
        throw new Error(`Failed to fetch nonce: ${res.status} ${resText}`);
      }
      
      const data = await res.json();
      console.log("Nonce received:", data.nonce);
      return data.nonce;
    } catch (error) {
      console.error("Error in getNonce:", error);
      throw error;
    }
  },
  createMessage: ({ nonce, address, chainId }) => new SiweMessage({
    domain: window.location.host,
    address,
    statement: "Sign In With Ethereum to prove you control this wallet.",
    uri: window.location.origin,
    version: "1",
    chainId,
    nonce,
  }),
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
        const resText = await res.text();
        console.error("Error verifying message:", resText);
        throw new Error(`Error verifying message: ${res.status} ${resText}`);
      }
      
      const data = await res.json();
      console.log("Verification result:", data);
      return data;
    } catch (error) {
      console.error("Error in verifyMessage:", error);
      throw error;
    }
  },
};