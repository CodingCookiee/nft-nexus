"use client";

import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { Button, Text, Loader } from "../common";

export default function SIWEButton() {
  const { address, chainId } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { signMessageAsync } = useSignMessage();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Get the nonce
      const nonceRes = await fetch("/api/nonce");
      if (!nonceRes.ok) throw new Error("Failed to get nonce");
      const { nonce } = await nonceRes.json();

      // 2. Create SIWE message
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign In With Ethereum to prove you control this wallet.",
        uri: window.location.origin,
        version: "1",
        chainId: chainId,
        nonce: nonce,
      });

      // 3. Sign message
      const messageToSign = message.prepareMessage();
      const signature = await signMessageAsync({ message: messageToSign });

      // 4. Verify signature
      const verifyRes = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          signature,
        }),
      });

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json();
        throw new Error(errorData.message || "Verification failed");
      }

      setIsAuthenticated(true);
      console.log("Successfully authenticated!");
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <Text variant="small" color="success" className="mt-2">
        ✓ Wallet verified
      </Text>
    );
  }

  return (
    <div className="mt-2">
      <Button variant="outline" onClick={handleSignIn} disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center">
            <Loader width="w-4" height="h-4" className="mr-2" />
            Verifying...
          </span>
        ) : (
          "Verify Wallet"
        )}
      </Button>

      {error && (
        <Text variant="small" color="error" className="mt-1">
          Error: {error}
        </Text>
      )}
    </div>
  );
}
