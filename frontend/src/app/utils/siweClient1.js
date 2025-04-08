import { configureClientSIWE } from "connectkit-next-siwe";

export const siweClient = configureClientSIWE({
  apiRoutePrefix: "/api/siwe",
  statement: "Sign In With Ethereum to prove you control this wallet.",
  getNone: async () => {
    try {
      const res = await fetch("api/siwe/nonce1");

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

  verifyMessage: async () => {
    try {
      const res = await fetch("/api/siwe/verify1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, signature }),
      });

      if (!res.ok) throw new Error("Failed to verify message");
      return await res.json();
    } catch (error) {
      console.error("Error while verifying message", error);
      throw error;
    }
  },

  getSession: async () => {
    try {
      const res = await fetch("/api/siwe/session1");
      if (!res.ok) throw new Error("Error while fetching session");
      return await res.json();
    } catch (error) {
      console.error("Error while getting session", error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      let res = await fetch("/api/siwe/signout1");

      // fallback to POST if GET fails

      if (!res.ok) {
        res = await fetch("/api/siwe/signout1", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      if (!res.ok) {
        console.error("Error while signing out", res.status);
        throw new Error("Error while signing out:", res.status);
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error while signing out", error);
      throw error;
    }
  },
});
