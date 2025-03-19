import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Copy } from "lucide-react";
import PixelAvatar from "../pixel-avatar";

interface InputFieldProps {
    label: string;
    value: string;
    isLong?: boolean;
    isAddress?: boolean;
    border?: boolean;
    dataDecoded?: {
        method: string;
        parameters: Array<{
            name: string;
            type: string;
            value: string;
        }>;
    };
}

export default function InputField({
    label,
    value,
    isLong = false,
    border = true,
    isAddress = false,
    dataDecoded
}: InputFieldProps) {
    // Special handling for Data field with decoded data
    if (label === "Data" && dataDecoded) {
        return (
            <div className={`py-2 ${border ? 'border-b border-gray-200' : ''}`}>
                <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                        <div className="text-gray-500 dark:text-gray-300 text-lg">{label}</div>
                        
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm">
                                    Decode Data
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-96">
                                <div className="space-y-3">
                                    <div className={`flex justify-between items-center ${dataDecoded.parameters.length > 0 ? 'border-b pb-2' : ''}`}>
                                        <h4 className="font-medium">Function</h4>
                                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                                            {dataDecoded.method}
                                        </span>
                                    </div>
                                    
                                    {dataDecoded.parameters && dataDecoded.parameters.map((param, index) => (
                                        <div key={index} className="border-b pb-3 last:border-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500">{param.type}</span>
                                                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-xs">
                                                    {param.name}
                                                </span>
                                                <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="h-6 w-6"
                                                        onClick={() => navigator.clipboard.writeText(param.value)}
                                                >
                                                        <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            
                                            <div className="mt-2">
                                                {param.value && param.value.length > 60 ? (
                                                    <div className="flex flex-col">
                                                        <div className="font-mono text-sm">
                                                            {param.value.slice(0, 10)}...{param.value.slice(-8)}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="font-mono text-sm">
                                                        {param.value}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    
                    <div className="text-md break-all mt-1 sm:mt-0">
                    {value}
                </div>
                </div>
            </div>
        );
    }

    // Regular fields
    return (
        <div className={`py-2 ${border ? 'border-b border-gray-200' : ''}`}>
            <div className={`flex flex-col ${isLong ? 'space-y-1' : 'sm:flex-row sm:items-center sm:justify-between'}`}>
                <div className="text-gray-500 dark:text-gray-300 text-lg">{label}</div>
                {isAddress ? (
                    <div className="flex  items-center gap-2">
                        <div className="flex h-5 w-5">
                        <PixelAvatar address={value} />
                        </div>
                        <div className="text-md break-all mt-1">
                            {value}
                        </div>
                    </div>
                ) : (
                    <div className="text-md break-all mt-1 sm:mt-0">
                        {value}
                    </div>
                )}
            </div>
        </div>
    );
}