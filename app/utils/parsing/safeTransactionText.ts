import { FormData } from "@/types/form-types";
import { getChainIdFromShortName, getShortNamesForChainId } from "@/utils/chainMapping";
import { NETWORKS } from "@/app/constants";
import { UseFormReturn } from "react-hook-form";

// Define formatAddress and guessNetworkFromAddress here rather than importing
// them from non-existent paths
function formatAddress(address: string): string {
  // Simple function to ensure the address has 0x prefix
  if (!address.startsWith('0x') && address.length === 40) {
    return `0x${address}`;
  }
  return address;
}

function guessNetworkFromAddress(address: string): string | undefined {
  // Placeholder implementation
  return undefined;
}

// Define a simplified chainsConfig since importing is causing issues
const chainsConfig: Record<string, {
  shortName: string;
  alternativeShortNames?: string[];
}> = {};

interface ParsedSafeText {
  safeAddress?: string;
  to?: string;
  value?: string;
  data?: string;
  operation?: string;
  safeTxGas?: string;
  baseGas?: string;
  gasPrice?: string;
  gasToken?: string;
  refundReceiver?: string;
  nonce?: string;
  safeTxHash?: string;
  domainHash?: string;
  messageHash?: string;
  network?: string;
  chainId?: number;
  detectedShortName?: string;
  allNetworkShortNames?: string[];
  truncatedFields?: string[];
}

// Full zero address (20 bytes)
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/**
 * Parse text copied from Safe transaction details
 * @param text The raw text copied from Safe
 * @returns An object with parsed transaction fields
 */
export function parseSafeTransactionText(text: string): ParsedSafeText {
  const result: ParsedSafeText = {};
  const truncatedFields: string[] = [];
  
  // Check for truncation in original text before any parsing
  const hasDataTruncation = checkForDataTruncation(text);
  if (hasDataTruncation) {
    truncatedFields.push('data');
  }
  
  /**
   * Helper function to extract value after a label
   * @param text Text to extract from
   * @param label Label to search for
   * @param nextLabel Optional next label that marks the end of the value
   * @returns Extracted value or undefined if not found
   */
  const extractValue = (text: string, label: string, nextLabel?: string): string | undefined => {
    const labelIndex = text.indexOf(label);
    if (labelIndex === -1) return undefined;
    
    const startIndex = labelIndex + label.length;
    let endIndex = nextLabel ? text.indexOf(nextLabel, startIndex) : text.length;
    if (endIndex === -1) endIndex = text.length;
    
    let value = text.substring(startIndex, endIndex).trim();
    // Remove any extra text that might be in the line
    value = value.split('\n')[0].trim();
    
    // Store raw value before cleaning for truncation check
    const rawValue = value;
    
    // Remove any leading/trailing non-alphanumeric characters
    value = value.replace(/^[^a-zA-Z0-9]+/, '').replace(/[^a-zA-Z0-9]+$/, '');
    
    // Handle shorthand zero address pattern (0x0000...0000)
    if (value.match(/^0x0+\.{3,}0+$/)) {
      return ZERO_ADDRESS;
    }
    
    return value.length > 0 ? value : undefined;
  };

  /**
   * Check if text contains patterns indicating truncated data
   * @param text Text to check for truncation patterns
   * @returns True if truncation patterns are detected
   */
  function checkForDataTruncation(text: string): boolean {
    // Pattern 1: Data field ending with ellipsis
    // Ex: data: 0x1234abc...
    if (text.match(/data:.*0x[a-fA-F0-9]+\.{3}/)) {
      return true;
    }
    
    // Pattern 2: Hex string followed by ellipsis
    // Ex: 0x1234567890abcdef... 
    if (text.match(/0x[a-fA-F0-9]{30,}\.{3}/)) {
      return true;
    }
    
    // Pattern 3: "show more" text near data field
    if (text.match(/data:.*show\s+more/i)) {
      return true;
    }
    
    // Pattern 4: Data field without proper termination
    // This detects cases where data field abruptly ends with a newline
    if (text.match(/data:.*0x[a-fA-F0-9]{20,}\s*\n/)) {
      const dataLines = text.match(/data:.*?(0x[a-fA-F0-9]+).*/);
      if (dataLines && dataLines[1]) {
        const dataHex = dataLines[1].trim();
        
        // Odd length hex strings suggest truncation (valid hex should be even length)
        if (dataHex.length >= 18 && dataHex.length % 2 === 1) {
          return true;
        }
        
        // Very short data fields (less than typical function selector) may be truncated
        if (dataHex.length < 10) {
          return true;
        }
      }
    }
    
    // Pattern 5: Data field followed immediately by operation field
    // Ex: data: 0x1234abcoperation: 0 
    if (text.match(/data:.*?(0x[a-fA-F0-9]+)\s*operation:/i)) {
      return true;
    }
    
    return false;
  }

  // Extract Safe address - it might appear in different formats
  // Pattern 1: "Safe:" followed by an address
  const safePattern1 = /safe:?\s*([a-fA-F0-9x:]+)/i;
  // Pattern 2: "Safe address:" followed by an address
  const safePattern2 = /safe\s+address:?\s*([a-fA-F0-9x:]+)/i;
  // Pattern 3: Transaction from: followed by an address (common in Safe UI)
  const safePattern3 = /transaction\s+from:?\s*([a-fA-F0-9x:]+)/i;
  // Pattern 4: From: followed by an address
  const safePattern4 = /from:?\s*([a-fA-F0-9x:]+)/i;
  
  // Try each pattern in order
  const safeAddressMatch = 
    text.match(safePattern1) || 
    text.match(safePattern2) || 
    text.match(safePattern3) || 
    text.match(safePattern4);
  
  if (safeAddressMatch && safeAddressMatch[1]) {
    result.safeAddress = formatAddress(safeAddressMatch[1].trim());
  }

  // Handle "to:" address which can appear in different formats in Safe UI
  // It may appear both at the top and in the Transaction data section
  if (text.includes("to:")) {
    // Try to find it in the Transaction data section first
    const txDataSection = text.indexOf("Transaction data");
    if (txDataSection !== -1) {
      const toAfterTxData = text.indexOf("to:", txDataSection);
      if (toAfterTxData !== -1) {
        result.to = extractValue(text.substring(toAfterTxData), "to:", "value:");
      }
    }
    
    // If not found in Transaction data, look anywhere
    if (!result.to) {
      result.to = extractValue(text, "to:", "value:");
    }
  }
  
  // Extract value
  if (text.includes("value:")) {
    result.value = extractValue(text, "value:", "data:");
  }
  
  // Extract data
  if (text.includes("data:")) {
    result.data = extractValue(text, "data:", "operation:");
    
    // Extract the raw data field for direct examination (before cleaning)
    const dataMatch = text.match(/data:\s*([^\n]*)/);
    const rawData = dataMatch ? dataMatch[1].trim() : '';
    
    // Check if raw data appears to be truncated
    if (rawData.endsWith('...') || 
        rawData.includes('...') || 
        rawData.includes('show more') ||
        rawData.match(/0x[a-fA-F0-9]+\.\.\./)) {
      if (!truncatedFields.includes('data')) {
        truncatedFields.push('data');
      }
    }
    
    // Additional check: if we have data field but it's suspiciously short, it might be truncated
    if (result.data && result.data.startsWith('0x') && result.data.length < 10) {
      // Typical data is at least 4 bytes (8 hex chars) for function selector
      if (!truncatedFields.includes('data')) {
        truncatedFields.push('data');
      }
    }
  }
  
  // Extract operation
  if (text.includes("operation:")) {
    const opText = extractValue(text, "operation:", "safeTxGas:");
    if (opText) {
      // Extract the operation number (0 for call, 1 for delegatecall)
      const opMatch = opText.match(/(\d+)/);
      result.operation = opMatch ? opMatch[1] : "0";
    }
  }
  
  // Extract safeTxGas
  if (text.includes("safeTxGas:")) {
    result.safeTxGas = extractValue(text, "safeTxGas:", "baseGas:");
  }
  
  // Extract baseGas
  if (text.includes("baseGas:")) {
    result.baseGas = extractValue(text, "baseGas:", "gasPrice:");
  }
  
  // Extract gasPrice
  if (text.includes("gasPrice:")) {
    result.gasPrice = extractValue(text, "gasPrice:", "gasToken:");
  }
  
  // Extract gasToken
  if (text.includes("gasToken:")) {
    result.gasToken = extractValue(text, "gasToken:", "refundReceiver:");
    // Handle gasToken special case for "0x0000...0000"
    if (text.includes("gasToken:") && text.match(/gasToken:[\s\n]*0x0+\.{3,}0+/)) {
      result.gasToken = ZERO_ADDRESS;
    }
  }
  
  // Extract refundReceiver
  if (text.includes("refundReceiver:")) {
    result.refundReceiver = extractValue(text, "refundReceiver:", "nonce:");
    // Handle refundReceiver special case for "0x0000...0000"
    if (text.includes("refundReceiver:") && text.match(/refundReceiver:[\s\n]*0x0+\.{3,}0+/)) {
      result.refundReceiver = ZERO_ADDRESS;
    }
  }
  
  // Extract nonce
  if (text.includes("nonce:")) {
    result.nonce = extractValue(text, "nonce:", "Transaction hashes");
  }
  
  // Extract transaction hashes
  if (text.includes("safeTxHash:")) {
    result.safeTxHash = extractValue(text, "safeTxHash:", "Domain hash:");
  }
  
  if (text.includes("Domain hash:")) {
    result.domainHash = extractValue(text, "Domain hash:", "Message hash:");
  }
  
  if (text.includes("Message hash:")) {
    result.messageHash = extractValue(text, "Message hash:", "Balance change");
  }

  // Special case for handling token transfers where value is in a different format
  if (!result.value && text.match(/value\s+uint256/i)) {
    const valueMatch = text.match(/value\s+uint256\s+(\d+)/i);
    if (valueMatch && valueMatch[1]) {
      result.value = valueMatch[1];
    }
  }

  // Handle possible "0x0000...0000" post-processing for any address fields
  ['to', 'gasToken', 'refundReceiver'].forEach(field => {
    if (result[field as keyof ParsedSafeText] && 
        typeof result[field as keyof ParsedSafeText] === 'string' &&
        (result[field as keyof ParsedSafeText] as string).match(/^0x0+\.{3,}0+$/)) {
      (result[field as keyof ParsedSafeText] as string) = ZERO_ADDRESS;
    }
  });

  // Extract network information from EIP-3770 chain shortname
  // Look for patterns like "eth:0x..." or "gnosis:0x..." in the text
  const eip3770Match = text.match(/([a-zA-Z0-9]+):0x[a-fA-F0-9]{40}/);
  if (eip3770Match && eip3770Match[1]) {
    const shortName = eip3770Match[1];
    result.detectedShortName = shortName;
    
    const chainId = getChainIdFromShortName(shortName);
    
    if (chainId) {
      result.chainId = chainId;
      
      // Find all shortnames for this chain ID
      result.allNetworkShortNames = getShortNamesForChainId(chainId);
      
      // Find the corresponding network value in NETWORKS constant
      const network = NETWORKS.find(n => n.chainId === chainId);
      if (network) {
        result.network = network.value;
      }
    }
  }
  
  // Last check for generic truncation patterns across the whole text
  // This catches cases where "..." or "show more" appears in ways our specific field checks might miss
  const showMoreMatch = text.match(/show\s+more/i);
  const ellipsisPattern = /\.{3,}/g;
  const ellipsisMatches = text.match(ellipsisPattern);
  
  // If we find "show more" text or multiple ellipsis patterns that aren't part of zero addresses,
  // this is a strong indicator of truncated content
  if (showMoreMatch || (ellipsisMatches && ellipsisMatches.length > 0)) {
    // For ellipsis matches, check they're not just part of zero addresses
    if (ellipsisMatches) {
      const zeroAddrEllipsis = text.match(/0x0+\.{3,}0+/g) || [];
      // If we have more ellipsis matches than zero address patterns, some fields are likely truncated
      if (ellipsisMatches.length > zeroAddrEllipsis.length) {
        // Check which fields might be affected based on surrounding text
        if (text.includes("data") && !truncatedFields.includes('data')) {
          // Look specifically at the data section
          const dataIndex = text.indexOf("data:");
          if (dataIndex !== -1) {
            const dataEndIndex = text.indexOf("operation:", dataIndex);
            const dataSection = text.substring(
              dataIndex, 
              dataEndIndex !== -1 ? dataEndIndex : dataIndex + 200
            );
            
            if (dataSection.includes("...") || showMoreMatch) {
              truncatedFields.push('data');
            }
          }
        }
      }
    }
  }
  
  // A specific check for the exact pattern in the user's example with subtle variations
  if (text.match(/0x[a-fA-F0-9]{10,}\.{2,}/)) {
    if (!truncatedFields.includes('data')) {
      truncatedFields.push('data');
    }
  }
  
  // Add truncated fields to result if any were found
  if (truncatedFields.length > 0) {
    result.truncatedFields = truncatedFields;
  }
  
  // Debug logging to help diagnose issues (only in development environment)
  if (process.env.NODE_ENV === 'development') {
    console.log("Parsed text:", { 
      hasDataField: result.data !== undefined,
      truncatedFields,
      containsEllipsis: text.includes('...'),
      containsShowMore: text.toLowerCase().includes('show more'),
      rawText: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      dataField: result.data ? (result.data.substring(0, 30) + (result.data.length > 30 ? '...' : '')) : undefined
    });
  }
  
  return result;
}

/**
 * Updates a form with values from parsed Safe transaction text
 * @param form The form to update
 * @param parsedData The parsed data from Safe transaction text
 */
export function updateFormWithParsedData(form: UseFormReturn<FormData>, parsedData: ParsedSafeText): void {
  const { setValue } = form;

  // Map the parsed data fields to form fields
  if (parsedData.safeAddress) setValue("address", formatAddress(parsedData.safeAddress));
  if (parsedData.to) setValue("to", formatAddress(parsedData.to));
  if (parsedData.value) setValue("value", parsedData.value);
  if (parsedData.data) setValue("data", parsedData.data);
  if (parsedData.operation) setValue("operation", parsedData.operation);
  if (parsedData.safeTxGas) setValue("safeTxGas", parsedData.safeTxGas);
  if (parsedData.baseGas) setValue("baseGas", parsedData.baseGas);
  if (parsedData.gasPrice) setValue("gasPrice", parsedData.gasPrice);
  if (parsedData.gasToken) setValue("gasToken", parsedData.gasToken);
  if (parsedData.refundReceiver) setValue("refundReceiver", parsedData.refundReceiver);
  if (parsedData.nonce) setValue("nonce", parsedData.nonce);
  
  // Also update network and chainId if available
  if (parsedData.network) setValue("network", parsedData.network);
  if (parsedData.chainId) setValue("chainId", parsedData.chainId);
} 