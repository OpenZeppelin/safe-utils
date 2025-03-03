import React from "react";
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

interface ApiInputFieldsProps {
  form: UseFormReturn<FormData>;
}

export default function ApiInputFields({ form }: ApiInputFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="bg-muted/20 rounded-lg p-4 mb-4">
        <p className="text-sm text-muted-foreground">
          Enter the necessary parameters to retrieve transaction details via the Safe API. You need to specify the network, Safe address, and transaction nonce.
        </p>
      </div>

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
            <FormLabel>Safe Address</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Safe address (0x...)"
                leftIcon={<PixelAvatar address={field.value} />}
                {...field}
                onChange={(e) => {
                  const address = e.target.value.match(/0x[a-fA-F0-9]{40}/)?.[0];
                  if (address) {
                    field.onChange(address);
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
            <FormLabel>Nonce</FormLabel>
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
    </div>
  );
}