"use client";

import { ConnectKitProvider } from "connectkit";
import { siweClient } from "../../utils/siweClient";

export function ClientProviders({ children }) {
  return (
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
    >
      <ConnectKitProvider>
        {children}
      </ConnectKitProvider>
    </siweClient.Provider>
  );
}
