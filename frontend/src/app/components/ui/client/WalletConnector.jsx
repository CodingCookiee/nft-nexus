"use client";

import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi"; 
import { Text, Loader } from "../common";
import { useRouter } from "next/navigation";
import { useSIWE } from "connectkit";
import styled from "styled-components";

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

export default function WalletConnector({ compact = false }) {
  const { address, isConnecting, isDisconnected } = useAccount();
  // Remove the useNetwork reference
  const { isSignedIn, signIn, signOut, status, error } = useSIWE();
  const router = useRouter();

  return (
    <div
      className={
        compact
          ? "w-full"
          : "w-full min-h-screen flex flex-col items-center justify-center p-10 gap-10"
      }
    >
      {isConnecting ? (
        <div className="flex items-center justify-between gap-4">
          <Loader width="w-10" height="h-10" />
          <Text variant="small" color="secondary" weight="normal">
            Connecting to the wallet...
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
                <div className="flex flex-col items-center gap-4">
                  <StyledButton onClick={show} compact={compact}>
                    {isConnected
                      ? ensName ?? truncatedAddress ?? "Connected"
                      : "Connect Wallet"}
                  </StyledButton>

                  {/* {isConnected && !isSignedIn && status !== "loading" && (
                    <button
                      onClick={signIn}
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                    >
                      Verify Wallet
                    </button>
                  )}

                  {status === "loading" && (
                    <div className="flex items-center space-x-2">
                      <Loader width="w-4" height="h-4" />
                      <span className="text-sm text-gray-500">Verifying...</span>
                    </div>
                  )} */}

                  {isSignedIn && (
                    <div className="flex flex-col items-center">
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
                      <button
                        onClick={signOut}
                        className="mt-2 px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                      >
                        Sign out
                      </button>
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
  );
}