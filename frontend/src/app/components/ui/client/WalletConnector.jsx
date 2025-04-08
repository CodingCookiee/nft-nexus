"use client";

import { useEffect, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { Text, Loader, Button, PageTransitionOverlay } from "../common";
import { useRouter } from "next/navigation";
import { useSIWE } from "connectkit";
import styled from "styled-components";
import Link from "next/link";

const StyledButton = styled.button`
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: ${(props) => (props.compact ? "10px 16px" : "14px 24px")};
  color: #ffffff;
  background: #4b0082;
  font-size: ${(props) => (props.compact ? "14px" : "16px")};
  font-weight: 500;
  border-radius: 10rem;
  box-shadow: 0 4px 24px -6px #4b0082;

  transition: 200ms ease;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 6px 40px -6px #4b0082;
  }
  &:active {
    transform: translateY(-3px);
    box-shadow: 0 6px 32px -6px #4b0082;
  }
`;

export default function WalletConnector({
  compact = false,
  onSuccessfulAuth,
  redirectPath,
}) {
  const [redirecting, setIsRedirecting] = useState(false);
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const router = useRouter();
  const {
    isSignedIn,
    signIn,
    signOut,
    status,
    error,
    isLoading: siweLoading,
  } = useSIWE();

  const handleDashboardClick = (e) => {
    e.preventDefault(); // Prevent default link behavior
    setIsRedirecting(true);

    // Wait a moment to show the transition before navigating
    setTimeout(() => {
      router.push("/dashboard");
    }, 300);
  };

  // Monitor auth state changes and notify parent component
  // useEffect(() => {
  //   if (isConnected && isSignedIn && onSuccessfulAuth) {
  //     console.log("WalletConnector: Authentication successful, notifying parent");
  //     onSuccessfulAuth();

  //     // If redirectPath is provided and we're not already redirecting via parent
  //     if (redirectPath && !onSuccessfulAuth) {
  //       const timer = setTimeout(() => {
  //         console.log(`WalletConnector: Redirecting to ${redirectPath}`);
  //         router.push(redirectPath);
  //       }, 500);

  //       return () => clearTimeout(timer);
  //     }
  //   }
  // }, [isConnected, isSignedIn, onSuccessfulAuth, redirectPath, router]);

  return (
    <>
      {/* Redirect overlay */}
      <PageTransitionOverlay
        show={redirecting}
        message="Redirecting to dashboard..."
        status="loading"
        bgColor="bg-indigo-100/90 dark:bg-indigo-900/90"
      />
      <div
        className={
          compact
            ? "w-full"
            : "w-full min-h-screen flex flex-col items-center justify-center p-10 gap-10"
        }
      >
        {isConnecting || siweLoading ? (
          <div className="flex items-center justify-between gap-4">
            <Loader width="w-5" height="h-5" />
            <Text
              variant="small"
              color="secondary"
              weight="normal"
              className="uppercase text-xs"
            >
              {isConnecting ? "Connecting..." : "Verifying..."}
            </Text>
          </div>
        ) : (
          <div
            className={
              compact
                ? "w-full"
                : "max-w-5xl w-full flex items-center justify-center flex-col"
            }
          >
            <ConnectKitButton.Custom>
              {({ isConnected, show, truncatedAddress, ensName }) => {
                return (
                  <div className="w-full flex flex-col items-center justify-center gap-4 ">
                    <StyledButton
                      onClick={show}
                      compact={compact}
                      className="px-5"
                    >
                      {isConnected
                        ? ensName ?? truncatedAddress ?? "Connected"
                        : "Connect Wallet"}
                    </StyledButton>

                    {isSignedIn && (
                      <div className="flex flex-col items-center gap-2.5">
                        <div className="flex items-center text-green-500">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="text-sm">Wallet verified</span>
                        </div>

                        <div className="">
                          <Link
                            href="/dashboard"
                            onClick={handleDashboardClick}
                          >
                            <StyledButton compact={compact}>
                              <Text
                                variant="small"
                                weight="semibold"
                                className="text-white "
                              >
                                Launch Dashboard
                              </Text>
                            </StyledButton>
                          </Link>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="text-red-500 text-sm mt-2">
                        Error: {error.message}
                      </div>
                    )}
                  </div>
                );
              }}
            </ConnectKitButton.Custom>
          </div>
        )}

        {!compact && address && (
          <div className="max-w-5xl w-full flex items-center justify-center">
            <Text variant="h3" color="secondary">
              Connected to {address.slice(0, 6)}...{address.slice(-4)}
            </Text>
          </div>
        )}

        {!compact && isSignedIn && (
          <div className="max-w-5xl w-full flex items-center justify-center">
            <Text variant="h5" color="success">
              ✓ Wallet verified with SIWE
            </Text>
          </div>
        )}
      </div>
    </>
  );
}
