import { NETWORKS } from "@/app/constants";
import { TransactionParams } from "@/types/form-types";

// Function to get Safe version
export async function fetchSafeVersion(network: string, address: string): Promise<string> {
  const apiUrl = network === 'rootstock' 
    ? 'https://gateway.safe.rootstock.io'
    : `https://safe-transaction-${network === 'ethereum' ? 'mainnet' : network}.safe.global`;
  
  const endpoint = network === 'rootstock' 
    ? `${apiUrl}/v1/chains/30/safes/${address}`
    : `${apiUrl}/api/v1/safes/${address}/`;

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
  
  const apiUrl = network === 'rootstock' 
    ? 'https://gateway.safe.rootstock.io'
    : `https://safe-transaction-${network === 'ethereum' ? 'mainnet' : network}.safe.global`;
  const endpoint = network === 'rootstock' 
    ? `${apiUrl}/v1/chains/30/safes/${address}/multisig-transactions/?nonce=${nonce}`
    : `${apiUrl}/api/v1/safes/${address}/multisig-transactions/?nonce=${nonce}`;
  
  try {
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const data = await response.json();

    const count = network === 'rootstock' ? data.results.length : data.count || 0;
    
    if (count === 0) {
      throw new Error("No transaction available for this nonce!");
    } else if (count > 1) {
      throw new Error("Multiple transactions with the same nonce value were detected.");
    }

    // Get version first
    const version = await fetchSafeVersion(network, address);
    
    const idx = 0;
    
    // Handle Rootstock separately as it requires an additional call to retrieve detailed execution info
    if (network === 'rootstock') {
      // Rootstock response nests the transaction id inside the first call, we need it for the detailed endpoint
      const txId = data.results[idx]?.transaction?.id;
      if (!txId) {
        throw new Error("Transaction id not found in Rootstock response");
      }

      // Fetch the detailed transaction information
      const detailEndpoint = `${apiUrl}/v1/chains/${selectedNetwork.chainId}/transactions/${txId}`;
      const detailResponse = await fetch(detailEndpoint);
      if (!detailResponse.ok) {
        throw new Error(`Detail API request failed: ${detailResponse.statusText}`);
      }
      const detail = await detailResponse.json();

      // Extract fields from Rootstock detailed response
      const txData = detail.txData || {};
      const execInfo = detail.detailedExecutionInfo || {};

      // Build concatenated signatures string (matching Gnosis behaviour: first sig keeps 0x prefix, subsequent ones drop it)
      const signaturesArr: string[] = (execInfo.confirmations || []).map((c: any) => c.signature).filter(Boolean);
      const signatures = signaturesArr.reduce((acc: string, sig: string, idx: number) => {
        if (!sig) return acc;
        return acc + (idx === 0 ? sig : sig.replace(/^0x/, ""));
      }, "");

      return {
        to: txData.to?.value || "0x0000000000000000000000000000000000000000",
        value: txData.value || "0",
        data: txData.hexData || "0x",
        operation: (txData.operation ?? "0").toString(),
        safeTxGas: execInfo.safeTxGas?.toString() || "0",
        baseGas: execInfo.baseGas?.toString() || "0",
        gasPrice: execInfo.gasPrice?.toString() || "0",
        gasToken: execInfo.gasToken || "0x0000000000000000000000000000000000000000",
        refundReceiver: execInfo.refundReceiver?.value || "0x0000000000000000000000000000000000000000",
        nonce: execInfo.nonce?.toString() || "0",
        dataDecoded: txData.dataDecoded || null,
        version: version,
        signatures: signatures ? signatures : undefined
      } as TransactionParams;
    }

    // Default behaviour for all other networks
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