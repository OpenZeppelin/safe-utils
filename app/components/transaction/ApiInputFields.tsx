import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/types/form-types";
import { NETWORKS } from "@/app/constants";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import PixelAvatar from "@/components/pixel-avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { HelpCircle } from "lucide-react";

interface ApiInputFieldsProps {
  form: UseFormReturn<FormData>;
}

export default function ApiInputFields({ form }: ApiInputFieldsProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const nestedSafeEnabled = form.watch("nestedSafeEnabled");

  const handleTooltipToggle = (id: string) => {
    setActiveTooltip(activeTooltip === id ? null : id);
  };
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="network"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Network</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                const selectedNetwork = NETWORKS.find(
                  (network) => network.value === value
                );
                if (selectedNetwork) {
                  form.setValue("chainId", selectedNetwork.chainId);
                }
              }}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a network">
                    {field.value && (
                      <div className="flex items-center">
                        <img
                          src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/${
                            NETWORKS.find((network) => network.value === field.value)?.logo
                          }`}
                          alt={`${field.value} logo`}
                          className="w-5 h-5 mr-2"
                        />
                        {NETWORKS.find((network) => network.value === field.value)?.label}
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {NETWORKS.map((network) => (
                  <SelectItem key={network.value} value={network.value}>
                    <div className="flex items-center">
                      <img
                        src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/${network.logo}`}
                        alt={`${network.label} logo`}
                        className="w-5 h-5 mr-2"
                      />
                      {network.label} (Chain ID: {network.chainId})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              The network on which the Safe is deployed
            </p>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="chainId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chain ID</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter Chain ID"
                readOnly
                {...field}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  field.onChange(value);
                  const selectedNetwork = NETWORKS.find(
                    (network) => network.chainId === value
                  );
                  if (selectedNetwork) {
                    form.setValue("network", selectedNetwork.value);
                  }
                }}
              />
            </FormControl>
            <p className="text-xs text-muted-foreground mt-1">
              The blockchain ID (automatically updated when selecting a network)
            </p>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">Safe Address
              <Tooltip open={activeTooltip === "safe-address"}>
                <TooltipTrigger asChild>
                  <span 
                    className="cursor-pointer" 
                    onClick={() => handleTooltipToggle("safe-address")}
                    onMouseEnter={() => setActiveTooltip("safe-address")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                  <HelpCircle className="ml-1 w-4 h-4 text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent 
                  className="pointer-events-none max-w-xs break-words p-2 rounded-md bg-black text-white dark:bg-white dark:text-black"
                  sideOffset={5}
                > 
                  <p>Your multisig address.</p>
                </TooltipContent>
              </Tooltip>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Safe address (0x...)"
                leftIcon={<PixelAvatar address={field.value} />}
                {...field}
                onChange={(e) => {
                  if (e.target.value === '') {
                    field.onChange('');
                  } else {
                    const address = e.target.value.match(/0x[a-fA-F0-9]{40}/)?.[0];
                    if (address) {
                      field.onChange(address);
                    } else {
                      field.onChange(e.target.value);
                    }
                  }
                }}
              />
            </FormControl>
            <p className="text-xs text-muted-foreground mt-1">
              The address of the Safe from which to retrieve the transaction
            </p>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nonce"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">Nonce
              <Tooltip open={activeTooltip === "safe-nonce"}>
                <TooltipTrigger asChild>
                <span 
                    className="cursor-pointer" 
                    onClick={() => handleTooltipToggle("safe-nonce")}
                    onMouseEnter={() => setActiveTooltip("safe-nonce")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <HelpCircle className="ml-1 w-4 h-4 text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent 
                  className="pointer-events-none max-w-xs break-words p-2 rounded-md bg-black text-white dark:bg-white dark:text-black"
                  sideOffset={5}
                > 
                  <p>The nonce of the transaction you want to validate.</p>
                </TooltipContent>
              </Tooltip>
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter the transaction nonce"
                {...field} 
              />
            </FormControl>
            <p className="text-xs text-muted-foreground mt-1">
              The nonce (sequence number) of the transaction to retrieve
            </p>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nestedSafeEnabled"
        render={({ field }) => {
          const { value, ...inputProps } = field;
          return (
            <FormItem className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...inputProps}
                checked={!!value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="h-4 w-4"
              />
              <FormLabel className="!mt-0">Use Nested Safe</FormLabel>
            </FormItem>
          );
        }}
      />

      {nestedSafeEnabled && (
        <>
          <FormField
            control={form.control}
            name="nestedSafeAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nested Safe Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter nested safe address (0x...)"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => {
                      if (e.target.value === '') {
                        field.onChange('');
                      } else {
                        const address = e.target.value.match(/0x[a-fA-F0-9]{40}/)?.[0];
                        if (address) {
                          field.onChange(address);
                        } else {
                          field.onChange(e.target.value);
                        }
                      }
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="nestedSafeNonce"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nested Safe Nonce</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter nested safe nonce"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}