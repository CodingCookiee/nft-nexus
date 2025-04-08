"use client";

import { ConnectKitProvider } from "connectkit";
import { WagmiProvider, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig } from "connectkit";
import { siweClient } from '../../utils/siweClient.js';


const chainId = parseInt(process.env.NEXT_CHAIN_ID || "11155111");
// const activeChain = chainId === 1 ? mainnet : sepolia;


// Create the config
const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [mainnet, sepolia],
    transports: {
      // RPC URL for each chain
      [mainnet.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
      ),
      [sepolia.id]: http(
        process.env.NEXT_RPC_URL || "https://eth-sepolia.public.blastapi.io"
      ),
    },

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,

    // Required App Info
    appName: "NFT Nexus",

    // Optional App Info
    appDescription: "NFT Nexus - Your NFT Dashboard & Marketplace",
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001", 
    appIcon: "/app/favicon.png", // your app's icon
  })
);

// Create a client
const queryClient = new QueryClient();

export function ClientProviders({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <siweClient.Provider
          enabled={true}
          nonceRefetchInterval={60000} // Reduced to 1 minute for testing
          sessionRefetchInterval={60000} // Reduced to 1 minute for testing
          signOutOnDisconnect={true}
          signOutOnAccountChange={true}
          signOutOnNetworkChange={true}
          onSignIn={(session) => {
            console.log("User signed in");
          }}
          onSignOut={() => {
            console.log("User signed out");
          }}
        >
          <ConnectKitProvider
            theme="rounded"
            mode="auto"
            options={{
              embedGoogleFonts: true,
              walletConnectName: 'WalletConnect',
              overlayBlur: 4,
              truncateLongENSAddress: true,
              walletConnectCTA: 'both',
              enableSIWE: true,
            }}
          >
            {children}
          </ConnectKitProvider>
        </siweClient.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}