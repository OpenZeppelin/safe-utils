import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/types/form-types";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { HelpCircle } from "lucide-react";

interface TransactionDetailsStepProps {
  form: UseFormReturn<FormData>;
}

export default function TransactionDetailsStep({ form }: TransactionDetailsStepProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleTooltipToggle = (id: string) => {
    setActiveTooltip(activeTooltip === id ? null : id);
  };
  
  return (
    <TooltipProvider>
    <div className="space-y-5">
      <h3 className="text-lg font-medium">Transaction parameters</h3>
      
      <FormField
        control={form.control}
        name="to"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Recipient address (To)
              <Tooltip open={activeTooltip === "transaction-recipient"}>
                <TooltipTrigger asChild>
                  <span 
                    className="cursor-pointer" 
                    onClick={() => handleTooltipToggle("transaction-recipient")}
                    onMouseEnter={() => setActiveTooltip("transaction-recipient")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                  <HelpCircle className="ml-1 w-4 h-4 text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="pointer-events-none max-w-xs break-words p-2 rounded-md bg-black text-white dark:bg-white dark:text-black">
                  <p>This is the address you&apos;re interacting with (Safe, token contract etc...).</p>
                </TooltipContent>
              </Tooltip>
            </FormLabel>
            <FormControl>
              <Input placeholder="Enter recipient address" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="value"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Value (in wei)
              <Tooltip open={activeTooltip === "transaction-value"}>
                <TooltipTrigger asChild>
                  <span 
                    className="cursor-pointer" 
                    onClick={() => handleTooltipToggle("transaction-value")}
                    onMouseEnter={() => setActiveTooltip("transaction-value")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <HelpCircle className="ml-1 w-4 h-4 text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="pointer-events-none max-w-xs break-words p-2 rounded-md bg-black text-white dark:bg-white dark:text-black">
                  <p>This is the native currency value you&apos;re attaching to the call (ETH, BNB etc...).</p>
                </TooltipContent>
              </Tooltip>
            </FormLabel>
            <FormControl>
              <Input placeholder="Enter value in wei" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="data"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Transaction data
              <Tooltip open={activeTooltip === "transaction-data"}>
                <TooltipTrigger asChild>
                  <span 
                    className="cursor-pointer" 
                    onClick={() => handleTooltipToggle("transaction-data")}
                    onMouseEnter={() => setActiveTooltip("transaction-data")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <HelpCircle className="ml-1 w-4 h-4 text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="pointer-events-none max-w-xs break-words p-2 rounded-md bg-black text-white dark:bg-white dark:text-black">
                  <p>This is the raw data of the call. In Safe&apos;s UI it is the Raw data field.</p>
                </TooltipContent>
              </Tooltip>
            </FormLabel>
            <FormControl>
              <Input placeholder="Enter transaction data" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="operation"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              Operation
              <Tooltip open={activeTooltip === "transaction-operation"}>
                <TooltipTrigger asChild>
                  <span 
                      className="cursor-pointer" 
                      onClick={() => handleTooltipToggle("transaction-operation")}
                      onMouseEnter={() => setActiveTooltip("transaction-operation")}
                      onMouseLeave={() => setActiveTooltip(null)}
                    >
                    <HelpCircle className="ml-1 w-4 h-4 text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="pointer-events-none max-w-xs break-words p-2 rounded-md bg-black text-white dark:bg-white dark:text-black">
                  <p>WARNING: rarely this field is a delegatecall. If so, make sure you understand what the transaction is doing.</p>
                </TooltipContent>
              </Tooltip>
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="0">Call (0)</SelectItem>
                <SelectItem value="1">DelegateCall (1)</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
    </TooltipProvider>
  );
}