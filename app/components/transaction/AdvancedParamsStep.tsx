import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/types/form-types";
import { ZERO_ADDRESS } from "@/app/constants";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { AlertTriangle, HelpCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PixelAvatar from "@/components/pixel-avatar";

interface AdvancedParamsStepProps {
  form: UseFormReturn<FormData>;
}

export default function AdvancedParamsStep({ form }: AdvancedParamsStepProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  
  // Watch for changes in these fields
  const gasToken = form.watch("gasToken");
  const refundReceiver = form.watch("refundReceiver");
  const gasPrice = form.watch("gasPrice");

  const handleTooltipToggle = (id: string) => {
    setActiveTooltip(activeTooltip === id ? null : id);
  };

  const hasBothCustom = gasToken && gasToken !== ZERO_ADDRESS && refundReceiver && refundReceiver !== ZERO_ADDRESS;
  const hasCustomGasToken = gasToken && gasToken !== ZERO_ADDRESS;
  const hasCustomRefundReceiver = refundReceiver && refundReceiver !== ZERO_ADDRESS;
  const hasNonZeroGasPrice = gasPrice && gasPrice !== "0";
  const showWarning = hasCustomGasToken || hasCustomRefundReceiver;
  
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
            <p>These are extra parameters for the multisig transaction execution. Most of the time you don&apos;t need to change these, but you can put the actual values if those are custom ones.</p>
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
                <Input placeholder="Enter gasToken address" leftIcon={<PixelAvatar address={field.value} />} {...field} />
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
                <Input placeholder="Enter refundReceiver address" leftIcon={<PixelAvatar address={field.value} />} {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Gas token warning */}
      {showWarning && (
        <Alert variant="warning" className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <AlertDescription className="text-md">
              {hasBothCustom ? (
                <>
                  <span className="font-medium block">
                    This transaction uses a custom gas token AND a custom refund receiver.
                  </span>
                  <span className="block mt-1">
                    This combination can be used to hide a rerouting of funds through gas refunds.
                  </span>
                  {hasNonZeroGasPrice && (
                    <span className="block mt-1">
                      Furthermore, the gas price is non-zero, which increases the potential for hidden value transfers.
                    </span>
                  )}
                </>
              ) : hasCustomGasToken ? (
                <span>
                  This transaction uses a custom gas token. Please verify that this is intended.
                </span>
              ) : (
                <span>
                  This transaction uses a custom refund receiver. Please verify that this is intended.
                </span>
              )}
            </AlertDescription>
          </div>
        </Alert>
      )}
    </div>
    </TooltipProvider>
  );
}