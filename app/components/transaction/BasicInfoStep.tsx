import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/types/form-types";
import { NETWORKS, SAFE_VERSIONS } from "@/app/constants";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { HelpCircle } from "lucide-react";

interface BasicInfoStepProps {
  form: UseFormReturn<FormData>;
}

export default function BasicInfoStep({ form }: BasicInfoStepProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const nestedSafeEnabled = form.watch("nestedSafeEnabled");
  const mainSafeVersion = form.watch("version");
  
  // Set nested safe version to match main safe version when enabled or when main version changes
  useEffect(() => {
    if (nestedSafeEnabled && mainSafeVersion) {
      form.setValue("nestedSafeVersion", mainSafeVersion);
    }
  }, [nestedSafeEnabled, mainSafeVersion, form]);

  const handleTooltipToggle = (id: string) => {
    setActiveTooltip(activeTooltip === id ? null : id);
  };
  
  return (
    <TooltipProvider>
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
                placeholder="Enter Safe address"
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
            <FormLabel className="flex items-center gap-1">Safe Version
              <Tooltip open={activeTooltip === "safe-version"}>
                <TooltipTrigger asChild>
                  <span 
                    className="cursor-pointer" 
                    onClick={() => handleTooltipToggle("safe-version")}
                    onMouseEnter={() => setActiveTooltip("safe-version")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <HelpCircle className="ml-1 w-4 h-4 text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent 
                  className="pointer-events-none max-w-xs break-words p-2 rounded-md bg-black text-white dark:bg-white dark:text-black"
                  sideOffset={5}
                > 
                  <p>You can find your Safe version in the Safe web interface under Settings, or inspecting directly your Safe address on a block explorer. Select the version that matches your Safe deployment.</p>
                </TooltipContent>
              </Tooltip>
            </FormLabel>
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
                {SAFE_VERSIONS.map((version) => (
                  <SelectItem key={version} value={version}>
                    {version}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <FormLabel className="flex items-center gap-1">Nested Safe Address
                  <Tooltip open={activeTooltip === "nested-safe-address"}>
                    <TooltipTrigger asChild>
                      <span 
                        className="cursor-pointer" 
                        onClick={() => handleTooltipToggle("nested-safe-address")}
                        onMouseEnter={() => setActiveTooltip("nested-safe-address")}
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        <HelpCircle className="ml-1 w-4 h-4 text-muted-foreground" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent 
                      className="pointer-events-none max-w-xs break-words p-2 rounded-md bg-black text-white dark:bg-white dark:text-black"
                      sideOffset={5}
                    > 
                      <p>The address of the nested Safe contract.</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter nested safe address (0x...)"
                    leftIcon={<PixelAvatar address={field.value || ''} />}
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
                <FormLabel className="flex items-center gap-1">Nested Safe Nonce
                  <Tooltip open={activeTooltip === "nested-safe-nonce"}>
                    <TooltipTrigger asChild>
                      <span 
                        className="cursor-pointer" 
                        onClick={() => handleTooltipToggle("nested-safe-nonce")}
                        onMouseEnter={() => setActiveTooltip("nested-safe-nonce")}
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        <HelpCircle className="ml-1 w-4 h-4 text-muted-foreground" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent 
                      className="pointer-events-none max-w-xs break-words p-2 rounded-md bg-black text-white dark:bg-white dark:text-black"
                      sideOffset={5}
                    > 
                      <p>The nonce of the nested Safe transaction you want to validate.</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
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

          <FormField
            control={form.control}
            name="nestedSafeVersion"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">Nested Safe Version
                  <Tooltip open={activeTooltip === "nested-safe-version"}>
                    <TooltipTrigger asChild>
                      <span 
                        className="cursor-pointer" 
                        onClick={() => handleTooltipToggle("nested-safe-version")}
                        onMouseEnter={() => setActiveTooltip("nested-safe-version")}
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        <HelpCircle className="ml-1 w-4 h-4 text-muted-foreground" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent 
                      className="pointer-events-none max-w-xs break-words p-2 rounded-md bg-black text-white dark:bg-white dark:text-black"
                      sideOffset={5}
                    > 
                      <p>Defaults to same version as main Safe but can be changed if needed.</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || mainSafeVersion || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select nested Safe version">
                        {field.value || mainSafeVersion}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SAFE_VERSIONS.map((version) => (
                      <SelectItem key={version} value={version}>
                        {version}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </>
      )}
    </div>
    </TooltipProvider>
  );
}