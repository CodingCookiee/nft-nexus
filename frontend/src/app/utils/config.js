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
  injected,
  metaMask,
  walletConnect,
} from "wagmi/connectors";

const chainId = parseInt(process.env.NEXT_CHAIN_ID || "11155111");
const activeChain = chainId === 1 ? mainnet : sepolia;

export const config = createConfig(
  getDefaultConfig({
    chains: [arbitrum, base, mainnet, optimism, polygon, sepolia],
    connectors: [
      coinbaseWallet({
        qrcode: true,
        appName: "NFT Nexus",
        appLogoUrl: "/app/favicon.png",
        darkMode: true,
      }),
      //   injected(
      //     {
      //     target() {
      //       return {
      //         id: "windowProvider",
      //         name: "Window Provider",
      //         provider: window.ethereum,
      //       };
      //     },
      //   }
      // ),
      //   metaMask({
      //     headless: true,
      //     logging: { developerMode: true, sdk: true },
      //     showQrModal: true,
      //     dappMetadata: {
      //       name: "NFT Nexus",
      //       description: "NFT Nexus - Your NFT Dashboard & Marketplace",
      //       url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
      //       iconUrl: "app/favicon.png",
      //     },
      //   }),
      walletConnect({
        customStoragePrefix: "wagmi",
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        showQrModal: false,
        metaData: {
          name: "NFT Nexus",
          description: "NFT Nexus - Your NFT Dashboard & Marketplace",
          url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
        },
        qrModalOptions: {
          themeMode: "dark",
        },
      }),
    ],
    transports: {
      [mainnet.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
      ),
      [sepolia.id]: http(
        process.env.NEXT_RPC_URL || "https://eth-sepolia.public.blastapi.io"
      ),
    },
    appName: "NFT Nexus",
    appDescription: "NFT Nexus - Your NFT Dashboard & Marketplace",
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
    appIcon: "/app/favicon.png",
  })
);
