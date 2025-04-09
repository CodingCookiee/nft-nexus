import { ethers } from "ethers";

// Constants for Coinbase WebAuthn detection - use a hardcoded value instead of env var
export const COINBASE_WEBAUTHN_HEADER =  process.env.NEXT_COINBASE_WEBAUTHN_HEADER;

/**
 * Detects if a signature is from Coinbase Wallet's WebAuthn format
 * @param {string} signature - Hex string signature
 * @returns {boolean} True if the signature appears to be from Coinbase WebAuthn
 */
export function isCoinbaseWebAuthnSignature(signature) {
  return signature && signature.startsWith(COINBASE_WEBAUTHN_HEADER);
}

// /**
//  * Extracts a standard Ethereum signature from Coinbase's WebAuthn format
//  * @param {string} signature - Coinbase WebAuthn signature (hex string)
//  * @returns {string} Standard Ethereum signature (hex string)
//  * @throws {Error} If extraction fails
//  */
// export function extractEthereumSignatureFromCoinbase(signature) {
//   try {
//     // Parse the binary data from the hex string
//     const data = ethers.getBytes(signature);
    
//     // Look for signature patterns at specific offsets
//     // Based on analysis of Coinbase WebAuthn signatures
    
//     // First, try to extract address from the message to use as validation
//     const addressHex = signature.slice(90, 132); // Common location of the address in Coinbase signatures
    
//     // Find potential signature - these offsets often contain valid signatures in Coinbase WebAuthn data
//     const potentialOffsets = [
//       // These offsets are based on observed patterns in Coinbase signatures
//       { start: 600, length: 65 },
//       { start: 700, length: 65 },
//       { start: data.length - 300, length: 65 },
//       { start: data.length - 200, length: 65 }
//     ];
    
//     // Try each potential offset
//     for (const { start, length } of potentialOffsets) {
//       if (start + length <= data.length) {
//         // Extract a 65-byte chunk
//         const sigBytes = data.slice(start, start + length);
        
//         // Check if this looks like an Ethereum signature
//         // V value should be 0, 1, 27, or 28
//         const v = sigBytes[64];
//         if ((v === 0 || v === 1 || v === 27 || v === 28) && 
//             // Make sure r and s aren't all zeros
//             !sigBytes.slice(0, 32).every(b => b === 0) && 
//             !sigBytes.slice(32, 64).every(b => b === 0)) {
          
//           // Normalize v value if needed (0,1 -> 27,28)
//           const normalizedV = v < 27 ? v + 27 : v;
          
//           // Create a new array with the normalized v
//           let finalSig = new Uint8Array(65);
//           finalSig.set(sigBytes.slice(0, 64), 0);
//           finalSig[64] = normalizedV;
          
//           return ethers.hexlify(finalSig);
//         }
//       }
//     }
    
//     // If we couldn't find a signature at fixed offsets, scan the entire data
//     // This is more computationally expensive but more thorough
//     for (let i = 0; i < data.length - 65; i++) {
//       const v = data[i + 64];
//       if ((v === 0 || v === 1 || v === 27 || v === 28) && 
//           !data.slice(i, i + 32).every(b => b === 0) && 
//           !data.slice(i + 32, i + 64).every(b => b === 0)) {
        
//         // Normalize v value
//         const normalizedV = v < 27 ? v + 27 : v;
        
//         // Create normalized signature
//         let finalSig = new Uint8Array(65);
//         finalSig.set(data.slice(i, i + 64), 0);
//         finalSig[64] = normalizedV;
        
//         return ethers.hexlify(finalSig);
//       }
//     }
    
//     throw new Error("Could not find valid Ethereum signature in Coinbase WebAuthn data");
//   } catch (error) {
//     console.error("Failed to extract Ethereum signature from Coinbase data:", error);
//     throw new Error(`Signature extraction failed: ${error.message}`);
//   }
// }