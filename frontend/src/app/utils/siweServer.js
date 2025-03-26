import { configureServerSideSIWE } from "connectkit-next-siwe";
import { ckConfig } from "@/components/Web3Provider";

export const siweServer = configureServerSideSIWE({
  config: {
    chains: ckConfig.chains,
    transports: ckConfig.transports,
  },
  session: {
    cookieName: "connectkit-next-siwe",
    password: process.env.NEXT_SESSION_SECRET,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});