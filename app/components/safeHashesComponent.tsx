import { ethers } from 'ethers';
import { AbiCoder } from 'ethers';

// Set the type hash constants
const DOMAIN_SEPARATOR_TYPEHASH = "0x47e79534a245952e8b16893a336b85a3d9ea9fa8c573f3d803afb92a79469218";
const DOMAIN_SEPARATOR_TYPEHASH_OLD = "0x035aff83d86937d35b32e04f0ddc6ff469290eef2f1b692d8a815c89404d4749";
const SAFE_TX_TYPEHASH = "0xbb8310d486368db6bd6f849402fdd73ad53d316b5a4b2644ad6efe0f941286d8";
const SAFE_TX_TYPEHASH_OLD = "0x14d461bc7412367e924637b363c7bf29b8f47e2f84869f4426e5633d8af47b20";

function compareVersions(a: string, b: string): number {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);
  
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aVal = aParts[i] || 0;
    const bVal = bParts[i] || 0;
    if (aVal !== bVal) {
      return aVal - bVal;
    }
  }
  
  return 0;
}

function keccak256Int(hexData: string): string {
  const formattedHex = hexData.startsWith('0x') ? hexData : `0x${hexData}`;
  return ethers.keccak256(formattedHex);
}

function encodeAbi(types: string[], values: any[]): string {
  const abiCoder = new AbiCoder();
  return abiCoder.encode(types, values);
}

function calculateDomainHash(version: string, safeAddress: string, chainId: string): string {
  const cleanVersion = version.trim();
  let encodedData: string;
  
  // Safe multisig versions `<= 1.2.0` use a legacy format
  if (compareVersions(cleanVersion, "1.2.0") <= 0) {
    encodedData = encodeAbi(
      ['bytes32', 'address'],
      [DOMAIN_SEPARATOR_TYPEHASH_OLD, safeAddress]
    );
  } else {
    encodedData = encodeAbi(
      ['bytes32', 'uint256', 'address'],
      [DOMAIN_SEPARATOR_TYPEHASH, chainId, safeAddress]
    );
  }
  
  return keccak256Int(encodedData);
}

function calculateSafeTxHash(
  domainHash: string, 
  messageHash: string
): string {
  const encoded = ethers.concat([
    new Uint8Array([0x19]),
    new Uint8Array([0x01]),
    ethers.getBytes(domainHash),
    ethers.getBytes(messageHash)
  ]);
  return keccak256Int(ethers.hexlify(encoded));
}

export async function calculateHashes(
  chainId: string,
  address: string,
  to: string,
  value: string,
  data: string,
  operation: string,
  safeTxGas: string,
  baseGas: string,
  gasPrice: string,
  gasToken: string,
  refundReceiver: string,
  nonce: string,
  version: string = "1.3.0"
): Promise<{
  domainHash: string,
  messageHash: string,
  safeTxHash: string,
  encodedMessage: string
}> {
  const cleanVersion = version.trim();
  let safeTxTypehash = SAFE_TX_TYPEHASH;

  const domainHash = calculateDomainHash(version, address, chainId);

  const dataHashed = keccak256Int(data);

  // Safe multisig versions `< 1.0.0` use a legacy format
  if (compareVersions(cleanVersion, "1.0.0") < 0) {
    safeTxTypehash = SAFE_TX_TYPEHASH_OLD;
  }

  // Encode the message
  const message = encodeAbi(
    ['bytes32', 'address', 'uint256', 'bytes32', 'uint8', 'uint256', 'uint256', 'uint256', 'address', 'address', 'uint256'],
    [safeTxTypehash, to, value, dataHashed, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, nonce]
  );

  const messageHash = keccak256Int(message);
  const safeTxHash = calculateSafeTxHash(domainHash, messageHash);

  return {
    domainHash,
    messageHash,
    safeTxHash,
    encodedMessage: message
  };
}