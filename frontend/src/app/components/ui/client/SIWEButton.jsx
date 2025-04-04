"use client";

import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { Button, Text, Loader } from "../common";
import { useDirectSIWE } from "../../../hooks/useDirectSIWE";

export default function SIWEButton() {
  const { signIn, signOut, isLoading, error, isAuthenticated } =
    useDirectSIWE();

  if (isAuthenticated) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Text variant="small" color="success" className="mt-2">
          ✓ Wallet verified
        </Text>
        <Button
          variant="outline"
          onClick={signOut}
          disabled={isLoading}
          size="sm"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="mt-2">
        <Button variant="outline" onClick={signIn} disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2.5">
              <Loader width="w-4" height="h-4" className="mr-2" />
              Verifying...
            </span>
          ) : (
            "Verify Wallet"
          )}
        </Button>
      </div>
      <div className="mt-2">
        {error && (
          <Text variant="small" color="error" align='center' className="mt-1">
            Error: {error}
          </Text>
        )}
      </div>
    </div>
  );
}
