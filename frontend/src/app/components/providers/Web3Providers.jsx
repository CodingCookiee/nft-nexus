'use client';

import { ConnectKitProvider } from "connectkit";
import { WagmiProvider, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getDefaultConfig } from 'connectkit'
import { siweClient } from '../../utils/siweClient1.js';


const chainId = parseInt(process.env.NEXT_CHAIN_ID || '11155111')
const activeChain = chainId === 1 ? mainnet : sepolia;


const config = createConfig(getDefaultConfig({
    chains:[activeChain],
    transports:{
        [mainnet.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
        ),
        [sepolia.id]: http(
        process.env.NEXT_RPC_URL || "https://eth-sepolia.public.blastapi.io"
        ),
    },
    walletConnectProjectId=process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    appName: 'NFT Nexus',
    appDescription: "NFT Nexus - Your NFT Dashboard & Marketplace",
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001", 
    appIcon: "/app/favicon.png",

}));

const queryClient = new QueryClient();

export function Web3Providers({children}) {
    <WagmiProvider client={queryClient}>
        <QueryClient client={queryClient}>
            <siweClient.Provider
        enabled={true}
        enabled={true}
          nonceRefetchInterval={60000}
          sessionRefetchInterval={60000}
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
                //   enabledSiweRedirect: false, // Added to prevent automatic redirect
                }}

                >

                {children}
                </ConnectKitProvider>
            </siweClient.Provider>
        </QueryClient>

    </WagmiProvider>
}