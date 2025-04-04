"use client";

import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { Button, Text, Loader } from "../components/ui/common";

export function useDirectSIWE() {
  const { address, chainId } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { signMessageAsync } = useSignMessage();

  // Check if user is already authenticated
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/session");
        if (res.ok) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkSession();
  }, []);

  const signIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Get the nonce
      const nonceRes = await fetch("/api/nonce");
      if (!nonceRes.ok) throw new Error("Failed to get nonce");
      const { nonce } = await nonceRes.json();

      // 2. Create SIWE message
      const siweMessage = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign In With Ethereum to prove you control this wallet.",
        uri: window.location.origin,
        version: "1",
        chainId: chainId,
        nonce: nonce,
      });

      // 3. Get the message to sign
      const messageToSign = siweMessage.prepareMessage();

      // 4. Sign the message
      const signature = await signMessageAsync({ message: messageToSign });

      // 5. Verify the signature
      const verifyRes = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: siweMessage,
          signature,
        }),
      });

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json();
        throw new Error(errorData.message || "Verification failed");
      }

      setIsAuthenticated(true);
      console.log("Successfully authenticated!");
      return true;
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to sign out");
      }

      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error("Error signing out:", error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    signOut,
    isLoading,
    error,
    isAuthenticated,
  };
}
