import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from   "@/components/ui/badge";
import InputField from "./input-field";

interface TransactionDetailsProps {
    to: string;
    value: string;
    data: string;
    dataDecoded: any;
    operation: string;
    safeTxGas: string;
    baseGas: string;
    gasPrice: string;
    gasToken: string;
    refundReceiver: string;
    nonce: string;
}

export default function TransactionDetails({
    to,
    value,
    data,
    operation,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    nonce,
    dataDecoded
}: TransactionDetailsProps) {
    return (
        <div className="mt-2">
            <div className="border rounded-md p-4 space-y-3 dark:border-gray-200">
                <InputField label="To" value={to} isLong isAddress />
                <InputField label="Value" value={value} />
                <InputField label="Data" value={data} isLong dataDecoded={dataDecoded} />
                <InputField label="Operation" value={operation} />
                <InputField label="SafeTxGas" value={safeTxGas} />
                <InputField label="BaseGas" value={baseGas} />
                <InputField label="GasPrice" value={gasPrice} />
                <InputField label="GasToken" value={gasToken} isLong isAddress />
                <InputField label="RefundReceiver" value={refundReceiver} isLong isAddress />
                <InputField label="Nonce" value={nonce} border={false} />
            </div>
        </div>

    );
}