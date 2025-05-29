"use client";

import { configureClientSIWE } from "connectkit-next-siwe";

export const siweClient = configureClientSIWE({
  apiRoutePrefix: "/api/siwe",
  statement: "Sign In With Ethereum to prove you control this wallet.",
  // Enable more debug info in dev mode
  // debug: process.env.NODE_ENV !== "production",
  // // Increase timeout for mobile connections which can be slower
  // signMessageTimeout: 90000, // 90 seconds
  // // Add mobile-specific metadata
  // signMessageConfig: {
  //   // Include these values to improve the mobile signing experience
  //   includeAddress: true,
  //   chainId: true,
  //   // Recommended for mobile flows
  //   includeDomainAsDedicatedParameter: true,
  // },
  // // Force session refresh after connecting
  // onSessionUpdate: () => {
  //   console.log("Session updated");
  //   // Optionally trigger a UI refresh here
  //   window.location.reload();
  // }
});