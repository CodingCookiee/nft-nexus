import { createConfig, http } from "wagmi";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";
import { getDefaultConfig } from "connectkit";
import {
  coinbaseWallet,
  walletConnect,
} from "wagmi/connectors";

const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "11155111");
const activeChain = chainId === 1 ? mainnet : sepolia;

export const config = createConfig(
  getDefaultConfig({
    chains: [arbitrum, base, mainnet, optimism, polygon, sepolia],
    connectors: [
      coinbaseWallet({
        appName: "NFT Nexus",
        appLogoUrl: "/app/favicon.png",
      }),
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
         showQrModal: false,
        metadata: {
          name: "NFT Nexus",
          description: "NFT Nexus - Your NFT Dashboard & Marketplace",
          url: process.env.NEXT_PUBLIC_APP_URL || "http://192.168.30.44:3000",
          icons: ["/app/favicon.png"],
        },
      }),
    ],
    transports: {
      [mainnet.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
      ),
      [sepolia.id]: http(
        process.env.NEXT_PUBLIC_RPC_URL || "https://eth-sepolia.public.blastapi.io"
      ),
      [arbitrum.id]: http(),
      [base.id]: http(),
      [optimism.id]: http(),
      [polygon.id]: http(),
    },
    appName: "NFT Nexus",
    appDescription: "NFT Nexus - Your NFT Dashboard & Marketplace",
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://192.168.30.44:3000",
    appIcon: "/app/favicon.png",
  })
);
