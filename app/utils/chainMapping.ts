/**
 * Chain shortname to network ID mapping according to EIP-3770
 * Source: https://chainid.network/shortNameMapping.json
 * 
 * This file loads chain shortname mappings from a JSON file for easier updates.
 * The JSON file can be updated by copying the latest data from 
 * https://chainid.network/shortNameMapping.json
 */

import chainShortNameMappingJson from './chainShortNameMapping.json';

// Type assertion for the imported JSON
export const chainShortNameMapping: Record<string, string> = 
  chainShortNameMappingJson as Record<string, string>;

/**
 * Helper function to extract chain ID from EIP-3770 format string
 * @param eip3770String String in format "eip155:chainId"
 * @returns Chain ID as number, or undefined if invalid format
 */
export function getChainIdFromEIP3770(eip3770String: string): number | undefined {
  if (!eip3770String.startsWith('eip155:')) return undefined;
  
  const chainIdStr = eip3770String.split(':')[1];
  const chainId = parseInt(chainIdStr, 10);
  
  return isNaN(chainId) ? undefined : chainId;
}

/**
 * Get chain ID from shortname according to EIP-3770
 * @param shortName Chain shortname (e.g., "eth", "arb", "pol")
 * @returns Chain ID as number, or undefined if shortname is not recognized
 */
export function getChainIdFromShortName(shortName: string): number | undefined {
  const lowercaseShortName = shortName.toLowerCase();
  const eip3770String = chainShortNameMapping[lowercaseShortName] || 
                        chainShortNameMapping[shortName]; // Try case-sensitive as fallback
  
  return eip3770String ? getChainIdFromEIP3770(eip3770String) : undefined;
}

/**
 * Get all shortnames for a given chain ID
 * @param chainId The chain ID to look up
 * @returns Array of shortnames associated with this chain ID
 */
export function getShortNamesForChainId(chainId: number): string[] {
  const targetEip3770String = `eip155:${chainId}`;
  
  return Object.entries(chainShortNameMapping)
    .filter(([_, value]) => value === targetEip3770String)
    .map(([key, _]) => key);
} 