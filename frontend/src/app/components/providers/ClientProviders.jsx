"use client";

import { ConnectKitProvider } from "connectkit";
import { siweClient } from "../../utils/siweClient";
import { WagmiProvider, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig } from "connectkit";

// Create the config
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
    appName: "NFT Nexus",

    // Optional App Info
    appDescription: "NFT Nexus - Your NFT Dashboard & Marketplace",
    appUrl: "https://nft-nexus.vercel.app", // your app's url
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
          nonceRefetchInterval={300000}
          sessionRefetchInterval={300000}
          signOutOnDisconnect={true}
          signOutOnAccountChange={true}
          signOutOnNetworkChange={true}
          onSignIn={(session) => {
            console.log("User signed in:", session);
          }}
          onSignOut={() => {
            console.log("User signed out");
          }}
          // adding endpoints to sign and verify the message
          getNonce = { async () => {
            const res = await fetch('/api/nonce');
            return await res.text();
          }
        }

          verifyMessage ={ async (message, signature) => {
            const res = await fetch('/api/verify', {
              method: 'POST',
              headers:{
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ message, signature }),
            });
            return await res.json();
          }

          }

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
              disclaimer: (
                <>
                  By connecting your wallet you agree to the{" "}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    // href=""
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    // href=""
                  >
                    Privacy Policy
                  </a>
                </>
              ),
            }}
          >
            {children}
          </ConnectKitProvider>
        </siweClient.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

