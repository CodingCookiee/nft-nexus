"use client";

import { Web3Provider } from "../Web3Provider";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import Account from "./components/ui/client/Account";
import Text from "./components/ui/common/text";

import styled from "styled-components";
const StyledButton = styled.button`
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 14px 24px;
  color: #ffffff;
  background: #1a88f8;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10rem;
  box-shadow: 0 4px 24px -6px #1a88f8;

  transition: 200ms ease;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 6px 40px -6px #1a88f8;
  }
  &:active {
    transform: translateY(-3px);
    box-shadow: 0 6px 32px -6px #1a88f8;
  }
`;

export default function Home() {
  const { address, isConnecting, isDisconnected } = useAccount();

  return (
    <Web3Provider>
      <main className="w-full min-h-screen flex  flex-col items-center justify-center p-10 gap-10">
        <div className="max-w-5xl w-full flex items-center justify-center">
          <Text variant="h1" color="default">
            Welcome to Wagmi App
          </Text>
        </div>
        <div className="max-w-5xl w-full flex items-center justify-center">
          <ConnectKitButton.Custom>
            {({ isConnected, show, truncatedAddress, ensName }) => {
              return (
                <StyledButton onClick={show}>
                  {isConnected ? ensName ?? "Disconnect" : "Connect Wallet"}
                </StyledButton>
              );
            }}
          </ConnectKitButton.Custom>
        </div>
        <div className="max-w-5xl w-full flex items-center justify-center">
          if (isConnecting) return{" "}
          <Text variant="h3" color="secondary">
            Connecting...
          </Text>
          ; if (isDisconnected) return{" "}
          <Text variant="h3" color="secondary">
            Disconnected
          </Text>
          ; if (isConnecting) return{" "}
          <Text variant="h3" color="secondary">
            Connecting...
          </Text>
          ; if (isDisconnected) return{" "}
          <Text variant="h3" color="secondary">
            Disconnected
          </Text>
          ;
        </div>
      </main>
    </Web3Provider>
  );
}
