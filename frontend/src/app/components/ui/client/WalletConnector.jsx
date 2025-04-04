"use client";

import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { Text, Loader, Button } from "../common";
import { useRouter } from 'next/navigation';
import { useSIWE } from "connectkit";
import styled from "styled-components";

const StyledButton = styled.button`
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: ${props => props.compact ? '10px 16px' : '14px 24px'};
  color: #ffffff;
  background: #4B0082;
  font-size: ${props => props.compact ? '14px' : '16px'};
  font-weight: 500;
  border-radius: 10rem;
  box-shadow: 0 4px 24px -6px #4B0082;

  transition: 200ms ease;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 6px 40px -6px #4B0082;
  }
  &:active {
    transform: translateY(-3px);
    box-shadow: 0 6px 32px -6px #4B0082;
  }
`;

export default function WalletConnector({ compact = false }) {
  const { address, isConnecting, isDisconnected } = useAccount();
  const { signIn, signOut, status, isSignedIn } = useSIWE();
  const router = useRouter();
  
  // Handle SIWE status changes
  const getButtonText = (isConnected, show) => {
    if (isConnected) {
      if (isSignedIn) {
        return "Authenticated";
      } else {
        return "Verify Wallet";
      }
    } else {
      return "Connect Wallet";
    }
  };

  return (
    <div className={compact ? "w-full" : "w-full min-h-screen flex flex-col items-center justify-center p-10 gap-10"}>
      {isConnecting ? (
        <div className="flex items-center justify-between gap-4">
          <Loader width="w-14" height="h-14" />
          <Text variant="small" color="secondary" weight="normal" >
            Connecting to the wallet... 
          </Text>
        </div>
      ) : (
        <div className={compact ? "w-full" : "max-w-5xl w-full flex  items-center justify-center"}>
          <ConnectKitButton.Custom>
            {({ isConnected, show, truncatedAddress, ensName }) => {
              return (
                <div className="flex flex-col items-center justify-between gap-4">
                  <StyledButton onClick={show} compact={compact}>
                    {isConnected ? 
                      ensName ?? truncatedAddress ?? "Connected" : 
                      "Connect Wallet"
                    }
                  </StyledButton>
                  {isConnected && !isSignedIn && (
                    <Button 
                      variant='outline' 
                      onClick={() => signIn()} 
                      className="ml-2"
                    >
                      Verify Wallet
                    </Button>
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
            Wallet verified with SIWE ✓
          </Text>
        </div>
      )}
    </div>
  );
}