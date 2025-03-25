"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [mainnet],
    transports: {
      // RPC URL for each chain
      [mainnet.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
      ),
    },

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,

    // Required App Info
    appName: "Wagmi App",

    // Optional App Info
    appDescription: "Wagmi Dapp- Built with Wagmi",
    appUrl: "http://localhost:3000", // your app's url
    appIcon: "/next.svg", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="rounded"
          mode='auto'
          
          options={{
            embedGoogleFonts: true,
            walletConnectName:'WalletConnect',
            overlayBlur: 4,
            truncateLongENSAddress: true,
            walletConnectCTA: 'both',
            
            disclaimer: (
              <>
                By connecting your wallet you agree to the{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href=""
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href=""
                >
                  Privacy Policy
                </a>
              </>
            ),
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};