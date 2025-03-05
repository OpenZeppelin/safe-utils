import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/types/form-types";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { HelpCircle } from "lucide-react";

interface AdvancedParamsStepProps {
  form: UseFormReturn<FormData>;
}

export default function AdvancedParamsStep({ form }: AdvancedParamsStepProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleTooltipToggle = (id: string) => {
    setActiveTooltip(activeTooltip === id ? null : id);
  };
  
  return (
    <TooltipProvider>
    <div className="space-y-5">
      <h3 className="text-lg font-medium inline-flex items-center gap-1">Advanced parameters
        <Tooltip open={activeTooltip === "advanced-parameters"}>
          <TooltipTrigger asChild>
            <span 
              className="cursor-pointer" 
              onClick={() => handleTooltipToggle("advanced-parameters")}
              onMouseEnter={() => setActiveTooltip("advanced-parameters")}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <HelpCircle className="ml-1 w-4 h-4 text-muted-foreground" />
            </span>
          </TooltipTrigger>
          <TooltipContent className="pointer-events-none max-w-xs break-words p-2 rounded-md bg-black text-white dark:bg-white dark:text-black">
            <p>These are extra parameters for the multisig transaction execution. Most of the time you don't need to change these, but you can put the actual values if those are custom ones.</p>
          </TooltipContent>
        </Tooltip>
      </h3>
      
      <FormField
        control={form.control}
        name="safeTxGas"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Safe transaction gas</FormLabel>
            <FormControl>
              <Input placeholder="Enter safeTxGas" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="baseGas"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Base gas</FormLabel>
            <FormControl>
              <Input placeholder="Enter baseGas" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="gasPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gas price</FormLabel>
            <FormControl>
              <Input placeholder="Enter gasPrice" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="gasToken"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gas token</FormLabel>
            <FormControl>
              <Input placeholder="Enter gasToken address" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="refundReceiver"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Refund receiver</FormLabel>
            <FormControl>
              <Input placeholder="Enter refundReceiver address" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
    </TooltipProvider>
  );
}