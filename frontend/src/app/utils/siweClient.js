"use client";

import { configureClientSIWE } from "connectkit-next-siwe";

export const siweClient = configureClientSIWE({
  apiRoutePrefix: "/siwe", // This should match your route folder structure 
  statement: "Sign In With Ethereum to prove you control this wallet.",
});