'use client';

import { ConnectKitProvider } from "connectkit";
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { siweClient } from '../../utils/siweClient.js';
import { config } from '../../utils/config.js'

const queryClient = new QueryClient();

export function Web3Providers({children}) {
  return ( // Added return statement
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <siweClient.Provider
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
            }}
          >
            {children}
          </ConnectKitProvider>
        </siweClient.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}