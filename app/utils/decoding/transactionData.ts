import { fetch4ByteSignature } from './4byte';

export async function decodeTransactionData(to: string, data: string, chainId: string): Promise<any> {
  if (data === "0x" || !data) {
    return {
      method: "0x (ETH Transfer)",
      parameters: []
    };
  }
  
  try {
    const methodId = data.slice(0, 10);
    const rawData = data.slice(10);
    
    const signature = await fetch4ByteSignature(methodId);
    
    if (!signature) {
      return {
        method: "Unknown",
        methodId: methodId,
        parameters: [{
          name: "data",
          type: "bytes",
          value: data
        }]
      };
    }
    
    const methodName = signature.split('(')[0];
    const paramTypesString = signature.split('(')[1]?.replace(')', '') || '';
    const paramTypes = paramTypesString ? paramTypesString.split(',') : [];
    
    let params: { name: string; type: string; value: string }[] = [];
    
    if (rawData && paramTypes.length > 0) {
      try {
        let dataPosition = 0;
        
        for (let i = 0; i < paramTypes.length; i++) {
          const type = paramTypes[i].trim();
          let value = "";
          
          if (type === "address") {
            const hex = rawData.slice(dataPosition, dataPosition + 64);
            value = "0x" + hex.slice(24); 
            dataPosition += 64;
          } 
          else if (type.startsWith("uint") || type.startsWith("int")) {
            const hex = rawData.slice(dataPosition, dataPosition + 64);
            value = BigInt("0x" + hex).toString();
            dataPosition += 64;
          } 
          else if (type === "bool") {
            const hex = rawData.slice(dataPosition, dataPosition + 64);
            value = BigInt("0x" + hex).toString() === "0" ? "false" : "true";
            dataPosition += 64;
          } 
          else if (type === "bytes" || type.startsWith("bytes")) {
            value = "0x" + rawData.slice(dataPosition);
            break;
          } 
          else {
            value = "0x" + rawData.slice(dataPosition);
            break;
          }
          
          params.push({
            name: `param${i}`,
            type,
            value
          });
        }
      } catch (error) {
        console.error("Error parsing parameters:", error);
        params = [{
          name: "encodedData",
          type: "bytes",
          value: "0x" + rawData
        }];
      }
    }
    
    if (params.length === 0 && rawData) {
      params = [{
        name: "encodedData",
        type: "bytes",
        value: "0x" + rawData
      }];
    }
    
    return {
      method: methodName,
      signature: signature,
      parameters: params
    };
  } catch (error) {
    console.error("Error decoding transaction data:", error);
    return {
      method: "Error decoding",
      error: (error as Error).message,
      parameters: []
    };
  }
}