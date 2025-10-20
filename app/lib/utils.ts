import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}


export function isValidNonce(nonce: string): boolean {
  // Ensure nonce is a positive integer within reasonable bounds
  const nonceNum = parseInt(nonce);
  return /^\d+$/.test(nonce) && nonceNum >= 0 && nonceNum <= 100000000000;
}
