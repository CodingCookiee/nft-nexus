import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains'; 
import { getDefaultConfig } from 'connectkit'



const chainId = parseInt(process.env.NEXT_CHAIN_ID || '11155111');
const activeChain = chainId === 1 ? mainnet : sepolia;

export const config = createConfig(getDefaultConfig({
    chains: [activeChain],
    transports: {
        [mainnet.id]: http(
        `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
        ),
        [sepolia.id]: http(
        process.env.NEXT_RPC_URL || "https://eth-sepolia.public.blastapi.io"
        ),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID, 
    appName: 'NFT Nexus',
    appDescription: "NFT Nexus - Your NFT Dashboard & Marketplace",
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001", 
    appIcon: "/app/favicon.png",
}));
