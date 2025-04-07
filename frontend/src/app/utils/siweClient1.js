import { configureClientSIWE } from "connectkit-next-siwe";

export const siweClient = configureClientSIWE({
  apiRoutePrefix: "/api/siwe",
  statement: "Sign In With Ethereum to prove you control this wallet.",
  getNone: async () => {
    try {
      const res = await fetch("api/siwe/nonce");

      if (!res.ok) throw new Error("Failed to fetch nonce");

      // Get the nonce as plain text
      const nonce = await res.text();

      // Check if the nonce is valid
      if (!nonce || nonce.includes("{") || nonce.includes("}")) {
        // console.error("Invalid nonce format:", nonce);
        throw new Error("Invalid nonce format received from server");
      }

      return nonce;
    } catch (error) {
      console.error("Error Fetching Nonce:", error);
      throw error;
    }
  },
});
