import { padLeft, padRight, encodeParameter } from './abi';

export function encodeExecTransaction(
  to: string,
  value: string,
  data: string,
  operation: string,
  safeTxGas: string,
  baseGas: string,
  gasPrice: string,
  gasToken: string,
  refundReceiver: string,
  signatures: string = "0x"
): { 
  encoded: string;
  decoded: {
    method: string;
    parameters: { name: string; type: string; value: string }[];
  }
} {
  try {
    // execTransaction: keccak256("execTransaction(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,bytes)").substr(0, 8)
    const methodId = "0x6a761202";
    
    let encodedParams = '';
    
    encodedParams += encodeParameter('address', to);
    
    encodedParams += encodeParameter('uint256', value);
    
    encodedParams += padLeft('120', 64);
    
    encodedParams += encodeParameter('uint8', operation);
    
    encodedParams += encodeParameter('uint256', safeTxGas);
    
    encodedParams += encodeParameter('uint256', baseGas);
    
    encodedParams += encodeParameter('uint256', gasPrice);
    
    encodedParams += encodeParameter('address', gasToken);
    
    encodedParams += encodeParameter('address', refundReceiver);
    
    const cleanData = data.startsWith('0x') ? data.slice(2) : data;
    const dataLength = Math.ceil(cleanData.length / 2); 
    const dataPadded = padRight(cleanData, Math.ceil(cleanData.length / 64) * 64);
    const dataEncoded = padLeft(dataLength.toString(16), 64) + dataPadded;
    
    const signaturesOffset = 0x120 + (32 + dataLength + (32 - (dataLength % 32 || 32)));
    
    encodedParams += padLeft(signaturesOffset.toString(16), 64);

    encodedParams += dataEncoded;
    
    const cleanSignatures = signatures.startsWith('0x') ? signatures.slice(2) : signatures;
    const signaturesLength = Math.ceil(cleanSignatures.length / 2); 
    const signaturesPadded = padRight(cleanSignatures, Math.ceil(cleanSignatures.length / 64) * 64); 
    encodedParams += padLeft(signaturesLength.toString(16), 64) + signaturesPadded;
    
    const encoded = methodId + encodedParams;
    
    const parameters = [
      { name: "to", type: "address", value: to },
      { name: "value", type: "uint256", value },
      { name: "data", type: "bytes", value: data },
      { name: "operation", type: "uint8", value: operation },
      { name: "safeTxGas", type: "uint256", value: safeTxGas },
      { name: "baseGas", type: "uint256", value: baseGas },
      { name: "gasPrice", type: "uint256", value: gasPrice },
      { name: "gasToken", type: "address", value: gasToken },
      { name: "refundReceiver", type: "address", value: refundReceiver }
    ];

    // Add signatures only if present
    if (signatures && signatures !== "0x") {
      parameters.push({ name: "signatures", type: "bytes", value: signatures });
    }
    
    const decoded = {
      method: "execTransaction",
      parameters
    };

    return { encoded, decoded };
  } catch (error) {
    console.error("Error encoding execTransaction:", error);
    return {
      encoded: "0x",
      decoded: {
        method: "Error encoding execTransaction",
        parameters: []
      }
    };
  }
}