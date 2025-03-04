import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/types/form-types";
import { NETWORKS } from "@/app/constants";
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
import PixelAvatar from "@/components/pixel-avatar";

interface BasicInfoStepProps {
  form: UseFormReturn<FormData>;
}

export default function BasicInfoStep({ form }: BasicInfoStepProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-medium">Basic Information</h3>
      
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
                            NETWORKS.find(
                              (network) =>
                                network.value === field.value
                            )?.logo
                          }`}
                          alt={`${field.value} logo`}
                          className="w-5 h-5 mr-2"
                        />
                        {
                          NETWORKS.find(
                            (network) => network.value === field.value
                          )?.label
                        }
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {NETWORKS.map((network) => (
                  <SelectItem
                    key={network.value}
                    value={network.value}
                  >
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
                placeholder="Enter Safe address"
                leftIcon={<PixelAvatar address={field.value} />}
                {...field}
                onChange={(e) => {
                  const address =
                    e.target.value.match(/0x[a-fA-F0-9]{40}/)?.[0];
                  if (address) {
                    field.onChange(address);
                  }
                }}
              />
            </FormControl>
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
              <Input placeholder="Enter nonce" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="version"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Safe Version</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Safe version" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {["0.0.1", "0.1.0", "1.0.0", "1.1.0", "1.1.1", "1.2.0", "1.3.0", "1.4.1"].map((version) => (
                  <SelectItem key={version} value={version}>
                    {version}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
}