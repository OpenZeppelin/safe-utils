import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const API_URLS: { [key: string]: string } = {
  arbitrum: "https://safe-transaction-arbitrum.safe.global",
  aurora: "https://safe-transaction-aurora.safe.global",
  avalanche: "https://safe-transaction-avalanche.safe.global",
  base: "https://safe-transaction-base.safe.global",
  "base-sepolia": "https://safe-transaction-base-sepolia.safe.global",
  blast: "https://safe-transaction-blast.safe.global",
  bsc: "https://safe-transaction-bsc.safe.global",
  celo: "https://safe-transaction-celo.safe.global",
  ethereum: "https://safe-transaction-mainnet.safe.global",
  gnosis: "https://safe-transaction-gnosis-chain.safe.global",
  "gnosis-chiado": "https://safe-transaction-chiado.safe.global",
  linea: "https://safe-transaction-linea.safe.global",
  mantle: "https://safe-transaction-mantle.safe.global",
  optimism: "https://safe-transaction-optimism.safe.global",
  polygon: "https://safe-transaction-polygon.safe.global",
  "polygon-zkevm": "https://safe-transaction-zkevm.safe.global",
  scroll: "https://safe-transaction-scroll.safe.global",
  sepolia: "https://safe-transaction-sepolia.safe.global",
  worldchain: "https://safe-transaction-worldchain.safe.global",
  xlayer: "https://safe-transaction-xlayer.safe.global",
  zksync: "https://safe-transaction-zksync.safe.global"
}

export function isValidNetwork(network: string): boolean {
  return Object.keys(API_URLS).includes(network);
}


export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}


export function isValidNonce(nonce: string): boolean {
  // Ensure nonce is a positive integer within reasonable bounds
  const nonceNum = parseInt(nonce);
  return /^\d+$/.test(nonce) && nonceNum >= 0 && nonceNum <= 100000000000;
}
