import InputField from "./input-field";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
    encodedCall: string;
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
    dataDecoded,
    encodedCall
}: TransactionDetailsProps) {
    const [showEncodedCall, setShowEncodedCall] = useState(false);

    return (
        <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Switch
                        id="show-encoded"
                        checked={showEncodedCall}
                        onCheckedChange={setShowEncodedCall}
                    />
                    <Label htmlFor="show-encoded">Show Encoded Call</Label>
                </div>
            </div>

            <div className="space-y-4">
                {showEncodedCall ? (
                    <div className="border rounded-md p-4 space-y-3 dark:border-gray-200 w-full">
                        <div className=" break-all text-justify w-full">
                            {encodedCall}
                        </div>
                    </div>
                ) : (
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
                )}
            </div>
        </div>
    );
}