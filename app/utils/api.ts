import { NETWORKS } from "@/app/constants";
import { TransactionParams } from "@/types/form-types";

// Function to get Safe version
export async function fetchSafeVersion(network: string, address: string): Promise<string> {
  const apiUrl = `https://safe-transaction-${network === 'ethereum' ? 'mainnet' : network}.safe.global`;
  const endpoint = `${apiUrl}/api/v1/safes/${address}/`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Safe contract not found at address ${address} on network ${network}`);
    }
    
    const data = await response.json();
    // Get version and remove any suffix after '+'
    const version = (data.version || "0.0.0").split('+')[0];
    return version;
  } catch (error) {
    console.error("Error fetching Safe version:", error);
    throw error;
  }
}

export async function fetchTransactionDataFromApi(
  network: string,
  address: string,
  nonce: string
): Promise<TransactionParams> {
  const selectedNetwork = NETWORKS.find((n) => n.value === network);
  if (!selectedNetwork) {
    throw new Error(`Network ${network} not found`);
  }
  
  const apiUrl = `https://safe-transaction-${network === 'ethereum' ? 'mainnet' : network}.safe.global`;
  const endpoint = `${apiUrl}/api/v1/safes/${address}/multisig-transactions/?nonce=${nonce}`;
  
  try {
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    const count = data.count || 0;
    
    if (count === 0) {
      throw new Error("No transaction available for this nonce!");
    } else if (count > 1) {
      throw new Error("Multiple transactions with the same nonce value were detected.");
    }

    // Get version first
    const version = await fetchSafeVersion(network, address);
    
    const idx = 0;
    return {
      to: data.results[idx].to || "0x0000000000000000000000000000000000000000",
      value: data.results[idx].value || "0",
      data: data.results[idx].data || "0x",
      operation: data.results[idx].operation || "0",
      safeTxGas: data.results[idx].safeTxGas || "0",
      baseGas: data.results[idx].baseGas || "0",
      gasPrice: data.results[idx].gasPrice || "0",
      gasToken: data.results[idx].gasToken || "0x0000000000000000000000000000000000000000",
      refundReceiver: data.results[idx].refundReceiver || "0x0000000000000000000000000000000000000000",
      nonce: data.results[idx].nonce || "0",
      dataDecoded: data.results[idx].dataDecoded || null,
      version: version
    };
  } catch (error: any) {
    throw new Error(`API Error: ${error.message}`);
  }
}

export function getShareUrl(network: string, address: string, nonce: string): string {
  const baseLink = process.env.NEXT_PUBLIC_BASE_URL;
  const networkPrefix = NETWORKS.find((n) => n.value === network)?.gnosisPrefix;
  const safeAddress = `${networkPrefix}:${encodeURIComponent(address)}`;
  const url = `${baseLink}?safeAddress=${safeAddress}&nonce=${encodeURIComponent(nonce)}`;
  return url;
}