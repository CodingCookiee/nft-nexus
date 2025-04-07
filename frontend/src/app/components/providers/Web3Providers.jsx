'use client'

import { ConnectKitProvider } from "connectkit";
import { WagmiProvider, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getDefaultConfig } from 'connectkit'
import { siweClient } from '../../utils/siweClient1.js';


// Create the config
const config = createConfig(
    getDefaultConfig({
        // Your dApps chains
        chains: [mainnet],
        transports :{
            [mainnet.id]: http(
                `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
            )
        },
        
        // API keys for WalletConnect
        walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,

        // App info
        appName = "NFT Nexus",
        // optional app info
        apdDescription =  "NFT Nexus - Your NFT Dashboard & Marketplace",
        appUrl = 'http://localhost:3000',
        appIcon = '/app/favicon.png',
    

    })
);

// Create a client
const queryClient = new QueryClient();

export function Web3Providers({children}) {
    <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            <siweClient.Provider
            enabled={true}
            nonceRefetchInterval={60000}
            sessionRefetchInterval={60000}
            signOutOnDisconnect={true}
            signOutOnAccountChange={true}
            signOutOnNetworkChange={true}
            onSignIn={(session) =>{
                console.log("User signed in:", session);
            }

            }
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


                    { children }
                </ConnectKitProvider>


            </siweClient.Provider>

        </QueryClientProvider>

    </WagmiProvider>
}