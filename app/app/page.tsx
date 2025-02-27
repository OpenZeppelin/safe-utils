"use client";

import { useEffect, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { CopyButton } from "@/components/ui/copy-button";
import PixelAvatar from "@/components/pixel-avatar";
import { useSearchParams } from "next/navigation";
import { NETWORKS } from "./constants";
import { Disclaimer } from "@/components/ui/disclaimer";
import { calculateHashes } from "../components/safeHashesComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Blockies from "react-blockies";

interface FormData {
  method: string; // "direct" or "api"
  network: string;
  chainId: number;
  address: string;
  to: string;
  value: string;
  data: string;
  operation: string;
  safeTxGas: string;
  baseGas: string;
  gasPrice: string;
  gasToken: string;
  refundReceiver: string;
  nonce: string;
  version: string;
}

interface CalculationResult {
  network?: {
    name: string;
    chain_id: string;
  };
  transaction?: {
    multisig_address: string;
    to: string;
    value: string;
    data: string;
    encoded_message: string;
    data_decoded?: {
      method: string;
      parameters: any[];
    };
  };
  hashes?: {
    domain_hash: string;
    message_hash: string;
    safe_transaction_hash: string;
  };
  error?: string;
}

async function fetchTransactionDataFromApi(
  network: string,
  address: string,
  nonce: string
): Promise<any> {
  const selectedNetwork = NETWORKS.find((n) => n.value === network);
  if (!selectedNetwork) {
    throw new Error(`Network ${network} not found`);
  }
  
  const apiUrl = `https://safe-transaction-${network === 'ethereum' ? 'mainnet' : network}.safe.global`;
  const endpoint = `${apiUrl}/api/v1/safes/${address}/multisig-transactions/?nonce=${nonce}`;
  
  try {
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    const count = data.count || 0;
    
    if (count === 0) {
      throw new Error("No transaction is available for this nonce!");
    } else if (count > 1) {
      throw new Error("Several transactions with identical nonce values have been detected.");
    }
    
    const idx = 0;
    return {
      to: data.results[idx].to || "0x0000000000000000000000000000000000000000",
      value: data.results[idx].value || "0",
      data: data.results[idx].data || "0x",
      operation: data.results[idx].operation || "0",
      safeTxGas: data.results[idx].safeTxGas || "0",
      baseGas: data.results[idx].baseGas || "0",
      gasPrice: data.results[idx].gasPrice || "0",
      gasToken: data.results[idx].gasToken || "0x0000000000000000000000000000000000000000",
      refundReceiver: data.results[idx].refundReceiver || "0x0000000000000000000000000000000000000000",
      nonce: data.results[idx].nonce || "0",
      dataDecoded: data.results[idx].dataDecoded || null,
      version: data.results[idx].version || "1.3.0"
    };
  } catch (error: any) {
    throw new Error(`API Error: ${error.message}`);
  }
}

function HomeContent() {
  const searchParams = useSearchParams();

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  const [safeAddress] = useState(searchParams.get("safeAddress") || "");
  const [network] = useState(() => {
    const prefix = safeAddress.split(":")[0];
    return NETWORKS.find((n) => n.gnosisPrefix === prefix)?.value || "";
  });
  const [chainId] = useState(() => {
    const prefix = safeAddress.split(":")[0];
    return NETWORKS.find((n) => n.gnosisPrefix === prefix)?.chainId || "";
  });
  const [address] = useState(() => {
    const _address = safeAddress.match(/0x[a-fA-F0-9]{40}/)?.[0];
    if (_address) {
      return _address;
    } else {
      return "";
    }
  });
  const [nonce] = useState(searchParams.get("nonce") || "");

  const form = useForm<FormData>({
    defaultValues: {
      method: "direct", // Default
      network: network,
      chainId: Number(chainId),
      address: address,
      nonce: nonce,
      to: "0x0000000000000000000000000000000000000000",
      value: "0",
      data: "0x",
      operation: "0",
      safeTxGas: "0",
      baseGas: "0",
      gasPrice: "0",
      gasToken: "0x0000000000000000000000000000000000000000",
      refundReceiver: "0x0000000000000000000000000000000000000000",
      version: "1.3.0"
    },
  });

  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    setMounted(true);
    if (safeAddress) {
      form.setValue("network", network);
      form.setValue("chainId", Number(chainId));
      form.setValue("address", address);
      if (nonce) {
        form.setValue("nonce", nonce);
        form.setValue("method", "api");
      }
    }
  }, [safeAddress, nonce, form, network, chainId, address]);

  useEffect(() => {
    const method = form.watch("method");
    if (method === "api") {
      setActiveTab("basic");
    }
  }, [form.watch("method")]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setResult(null);
    
    try {
      let txParams = {
        to: data.to,
        value: data.value,
        data: data.data,
        operation: data.operation,
        safeTxGas: data.safeTxGas,
        baseGas: data.baseGas,
        gasPrice: data.gasPrice,
        gasToken: data.gasToken,
        refundReceiver: data.refundReceiver,
        nonce: data.nonce,
        version: data.version,
        dataDecoded: null
      };
      
      if (data.method === "api") {
        try {
          txParams = await fetchTransactionDataFromApi(
            data.network,
            data.address,
            data.nonce
          );
        } catch (error: any) {
          throw new Error(`API Error: ${error.message}`);
        }
      }
      
      const {
        domainHash,
        messageHash,
        safeTxHash,
        encodedMessage
      } = await calculateHashes(
        data.chainId.toString(),
        data.address,
        txParams.to,
        txParams.value,
        txParams.data,
        txParams.operation.toString(),
        txParams.safeTxGas,
        txParams.baseGas,
        txParams.gasPrice,
        txParams.gasToken,
        txParams.refundReceiver,
        txParams.nonce,
        txParams.version || data.version
      );

      setResult({
        network: {
          name: NETWORKS.find(n => n.value === data.network)?.label || data.network,
          chain_id: data.chainId.toString(),
        },
        transaction: {
          multisig_address: data.address,
          to: txParams.to,
          value: txParams.value,
          data: txParams.data,
          encoded_message: encodedMessage,
          data_decoded: txParams.dataDecoded || {
            method: txParams.data === "0x" ? "0x (ETH Transfer)" : "Unknown",
            parameters: []
          }
        },
        hashes: {
          domain_hash: domainHash,
          message_hash: messageHash,
          safe_transaction_hash: safeTxHash,
        }
      });
    } catch (error: any) {
      console.error("Error:", error);
      setResult({
        error: error.message || "An error occurred while calculating hashes."
      });
      toast({
        title: "Error",
        description: error.message || "An error occurred while calculating hashes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getShareUrl = (network: string, address: string, nonce: string) => {
    const baseLink = process.env.NEXT_PUBLIC_BASE_URL;
    const networkPrefix = NETWORKS.find(
      (n) => n.value === network
    )?.gnosisPrefix;
    const safeAddress = `${networkPrefix}:${encodeURIComponent(address)}`;
    const url = `${baseLink}?safeAddress=${safeAddress}&nonce=${encodeURIComponent(
      nonce
    )}`;
    return url;
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Toaster />
      <div className="flex flex-col w-full justify-center items-center p-5">
        <h1 className="text-[48px] font-semibold text-center mb-8 dark:text-title-dark text-title-light">
          Safe Utils
        </h1>
        <Card className="rounded-[24px] sm:p-16 p-5 dark:bg-card-dark bg-card-light w-full sm:w-[620px] mx-4">
          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="text-[24px] font-semibold dark:text-title-dark text-title-light">
              Transaction Parameters
            </CardTitle>
            <div className="flex items-center gap-2 mb-4">
              <Disclaimer className="text-muted-foreground hover:text-foreground text-[14px] flex items-center font-normal">
                Disclaimer
              </Disclaimer>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div>
                  <FormField
                    control={form.control}
                    name="method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calculation Method</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (value === "api") {
                              setActiveTab("basic");
                            }
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="direct">Manual Input (Direct)</SelectItem>
                            <SelectItem value="api">Safe API (Fetch transaction)</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="text-xs text-muted-foreground mt-1">
                          {field.value === "direct" 
                            ? "Enter all transaction parameters manually"
                            : "Fetch transaction data from Safe API using network, address, and nonce"
                          }
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                {form.watch("method") === "direct" ? (
                  <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-3 w-full mb-2">
                      <TabsTrigger value="basic" className="text-xs sm:text-sm">Basic Info</TabsTrigger>
                      <TabsTrigger value="transaction" className="text-xs sm:text-sm">Transaction</TabsTrigger>
                      <TabsTrigger value="advanced" className="text-xs sm:text-sm">Advanced</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-4 pt-4">
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
                    </TabsContent>
                    
                    <TabsContent value="transaction" className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="to"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>To Address</FormLabel>
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
                            <FormLabel>Value (in wei)</FormLabel>
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
                            <FormLabel>Data</FormLabel>
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
                            <FormLabel>Operation</FormLabel>
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
                    </TabsContent>
                    
                    <TabsContent value="advanced" className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="safeTxGas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Safe Transaction Gas</FormLabel>
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
                            <FormLabel>Base Gas</FormLabel>
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
                            <FormLabel>Gas Price</FormLabel>
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
                            <FormLabel>Gas Token</FormLabel>
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
                            <FormLabel>Refund Receiver</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter refundReceiver address" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="space-y-4 pt-4">
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
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-button hover:bg-button-hover active:bg-button-active text-white rounded-full px-6 h-[48px]"
                >
                  {isLoading ? "Calculating..." : "Calculate Hashes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {(isLoading || result) && (
          <Card className="rounded-[24px] sm:p-16 p-5 dark:bg-card-dark bg-card-light w-full sm:w-[620px] mx-4 mt-8">
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </>
              ) : result ? (
                result.error ? (
                  <div className="space-y-2 text-red-500 font-semibold">
                    {result.error}
                  </div>
                ) : (
                  <div className="space-y-8 w-full">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Transaction Data
                      </h3>
                      {[
                        { key: "multisig_address", label: "Multisig address" },
                        { key: "to", label: "To" },
                        { key: "value", label: "Value" },
                        { key: "data", label: "Data" },
                        { key: "encoded_message", label: "Encoded message" },
                      ].map(({ key, label }) => {
                        const value = result.transaction?.[key as keyof typeof result.transaction];
                        const stringValue = typeof value === 'string' ? value : '';
                        
                        return (
                          <div
                            key={key}
                            className="flex flex-col space-y-2 w-full"
                          >
                            <Label>{label}</Label>
                            <div className="flex items-center space-x-2 w-full">
                              <Input
                                readOnly
                                value={stringValue}
                              />
                              <CopyButton
                                value={stringValue}
                                onCopy={() => {
                                  toast({
                                    title: "Copied to clipboard",
                                    description: `${label} has been copied to your clipboard.`,
                                  });
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
  
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Hashes</h3>
                      {[
                        { key: "safe_transaction_hash", label: "safeTxHash" },
                        { key: "domain_hash", label: "Domain hash" },
                        { key: "message_hash", label: "Message hash" },
                      ].map(({ key, label }) => (
                        <div
                          key={key}
                          className="flex flex-col space-y-2 w-full"
                        >
                          <Label>{label}</Label>
                          <div className="flex items-center space-x-2 w-full">
                            <Input readOnly value={result.hashes?.[key as keyof typeof result.hashes]} />
                            <CopyButton
                              value={result.hashes?.[key as keyof typeof result.hashes] || ""}
                              onCopy={() => {
                                toast({
                                  title: "Copied to clipboard",
                                  description: `${label} has been copied to your clipboard.`,
                                });
                              }}
                            />
                            <Blockies
                                seed={result.hashes?.[key as keyof typeof result.hashes]}
                                size={20}
                                scale={4}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ) : (
                <p>No result available</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex flex-col w-full justify-center items-center p-5">
      <h1 className="text-[48px] font-semibold text-center mb-8 dark:text-title-dark text-title-light">
        Safe Utils
      </h1>
      <Card className="rounded-[24px] sm:p-16 p-5 dark:bg-card-dark bg-card-light w-full sm:w-[555px] mx-4">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-40 mt-6" />
        </CardContent>
      </Card>
    </div>
  );
}

// Main page component with Suspense
export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeContent />
    </Suspense>
  );
}