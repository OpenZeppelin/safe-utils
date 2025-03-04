
export function padLeft(str: string, len: number, padChar: string = '0'): string {
    return str.length >= len ? str : new Array(len - str.length + 1).join(padChar) + str;
}
  
export function padRight(str: string, len: number, padChar: string = '0'): string {
    return str.length >= len ? str : str + new Array(len - str.length + 1).join(padChar);
}
  
export function toHex(value: string | number): string {
    if (typeof value === 'number') {
        return '0x' + value.toString(16);
    }

    if (value.startsWith('0x')) {
        return value;
    }

    try {
        return '0x' + BigInt(value).toString(16);
    } catch {
        return value;
    }
}
  
export function encodeParameter(type: string, value: string): string {
    if (type === 'address') {
        const cleanValue = value.startsWith('0x') ? value.slice(2) : value;
        return padLeft(cleanValue, 64);
    }

    if (type === 'uint256' || type === 'uint8') {
        const cleanValue = value.startsWith('0x') ? value.slice(2) : value;
        const hexValue = BigInt(cleanValue).toString(16);
        return padLeft(hexValue, 64);
    }

    if (type === 'bytes') {
        const cleanValue = value.startsWith('0x') ? value.slice(2) : value;
        const length = Math.ceil(cleanValue.length / 2);
        const lengthEncoded = padLeft(length.toString(16), 64);
        const paddedValue = padRight(cleanValue, Math.ceil(cleanValue.length / 64) * 64);
        return lengthEncoded + paddedValue;
    }

    throw new Error(`Unsupported parameter type: ${type}`);
}