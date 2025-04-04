import { configureServerSideSIWE } from "connectkit-next-siwe";
import { mainnet } from "wagmi/chains";
import { http } from "wagmi";

export const siweServer = configureServerSideSIWE({
  config: {
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
      ),
    },
  },
  session: {
    cookieName: "siwe",
    password: process.env.IRON_SESSION_PASSWORD,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});
