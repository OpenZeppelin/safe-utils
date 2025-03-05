import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/ui/copy-button";
import { useToast } from "@/hooks/use-toast";
import { CalculationResult } from "@/types/form-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";

interface ResultCardProps {
  result: CalculationResult | null;
  isLoading: boolean;
}

interface CollapsibleSectionProps {
  title: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  defaultExpanded = true, 
  children 
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const handleExpand = () => {
    setExpanded(!expanded);
    
    if (!expanded) {
      setTimeout(() => {
        if (contentRef.current) {
          const textareas = contentRef.current.querySelectorAll('textarea');
          textareas.forEach((textarea) => {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight + 2) + 'px';
          });
        }
      }, 50);
    }
  };
  
  return (
    <div className="border-b pb-4 last:border-b-0">
      <button 
        onClick={handleExpand}
        className="flex w-full items-center justify-between text-lg font-semibold hover:bg-muted/20 p-2 rounded-md transition-colors"
        aria-expanded={expanded}
      >
        <span>{title}</span>
        {expanded ? (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      
      {expanded && (
        <div ref={contentRef} className="space-y-4 pt-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default function ResultCard({ result, isLoading }: ResultCardProps) {
  const { toast } = useToast();
  const [activeDataTab, setActiveDataTab] = useState<"raw" | "decoded">("raw");
  const [activeExecTab, setActiveExecTab] = useState<"raw" | "decoded">("raw");

  const autoResize = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight + 2) + 'px';
  };

  const textareaRefs = useRef<{[key: string]: HTMLTextAreaElement | null}>({});
  
  // Auto-resize all textareas when content changes
  useEffect(() => {
    if (!result) return;
    
    // Timeout to ensure content has rendered
    setTimeout(() => {
      Object.keys(textareaRefs.current).forEach(key => {
        autoResize(textareaRefs.current[key]);
      });
    }, 50);
  }, [result, activeDataTab, activeExecTab]);

  function renderDecodedData() {
    if (!result?.transaction?.data_decoded) return <div>No decoded data available</div>;
  
    const { method, signature, parameters } = result.transaction.data_decoded;
  
    const handleCopyValue = (value: string) => {
      // Copy to clipboard
      navigator.clipboard.writeText(value);
      toast({
        title: "Copied to clipboard",
        description: `Parameter value has been copied.`,
      });
    };

    return (
      <div className="space-y-4 w-full">
        <div className="space-y-2 w-full">
          <Label>Method</Label>
          <textarea
            readOnly
            value={method || ""}
            className="text-sm bg-background px-3 py-2 rounded-md border border-input w-full resize-none overflow-hidden dark:bg-white dark:text-gray-900"
            style={{ whiteSpace: "pre-wrap" }}
          />
        </div>
  
        {signature && (
          <div className="space-y-2 w-full">
            <Label>Signature</Label>
            <textarea
              readOnly
              value={signature}
              className="text-sm bg-background px-3 py-2 rounded-md border border-input w-full resize-none overflow-hidden dark:bg-white dark:text-gray-900"
              style={{ whiteSpace: "pre-wrap" }}
            />
          </div>
        )}
  
        <div className="space-y-2 w-full">
          <Label>Parameters</Label>
          {parameters && parameters.length > 0 ? (
            <div className="border rounded-md overflow-hidden dark:border-gray-700 w-full">
              <table className="w-full text-sm table-fixed">
                <thead className="bg-muted">
                  <tr className="border-b dark:border-gray-700">
                    <th className="px-3 py-2 text-left font-medium w-1/4">Name</th>
                    <th className="px-3 py-2 text-left font-medium w-1/4">Type</th>
                    <th className="px-3 py-2 text-left font-medium w-2/4">Value</th>
                    <th className="hidden sm:table-cell px-3 py-2 w-[40px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {parameters.map((param, index) => (
                    <tr
                      key={index}
                      className={cn(
                        "border-b dark:border-gray-700",
                        index === parameters.length - 1 ? "border-b-0" : ""
                      )}
                    >
                      <td className="px-3 py-2">{param.name}</td>
                      <td className="px-3 py-2">{param.type}</td>
                      <td
                        className="px-3 py-2 break-all"
                        title={param.value}
                        onClick={() => {
                          // Only mobile (<sm) copy at click
                          const isMobile = window.innerWidth < 640;
                          if (isMobile) handleCopyValue(param.value);
                        }}
                      >
                        {typeof param.value === 'string' && param.value.startsWith('0x') && param.value.length > 10 
                          ? `${param.value.substring(0, 6)}...${param.value.substring(param.value.length - 4)}`
                          : param.value}
                      </td>
                      <td className="hidden sm:table-cell px-3 py-2">
                        <CopyButton
                          value={param.value}
                          onCopy={() => {
                            toast({
                              title: "Copied to clipboard",
                              description: `Parameter value has been copied.`,
                            });
                          }}
                          className="h-6 w-6"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No parameters</div>
          )}
        </div>
      </div>
    );
  }
  
  const renderDecodedExecTransaction = () => {
    if (!result?.transaction?.exec_transaction?.decoded?.parameters) {
      return <div className="text-sm text-muted-foreground">No parameters</div>;
    }
    
    const { method, parameters } = result.transaction.exec_transaction.decoded;
    
    const handleCopyValue = (value: string) => {
      navigator.clipboard.writeText(value);
      toast({
        title: "Copied to clipboard",
        description: `Parameter value has been copied.`,
      });
    };

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Method</Label>
          <div className="text-sm bg-background px-3 py-2 rounded-md border border-input dark:bg-white dark:text-gray-900 w-full">
            {method || "execTransaction"}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Parameters</Label>
          {parameters.length > 0 ? (
            <div className="border rounded-md overflow-hidden dark:border-gray-700 w-full">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr className="border-b dark:border-gray-700">
                    <th className="px-3 py-2 text-left font-medium">Name</th>
                    <th className="px-3 py-2 text-left font-medium">Type</th>
                    <th className="px-3 py-2 text-left font-medium">Value</th>
                    <th className="hidden sm:table-cell px-3 py-2 w-[40px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {parameters.map((param, index) => (
                    <tr 
                      key={index} 
                      className={cn(
                        "border-b dark:border-gray-700",
                        index === parameters.length - 1 ? "border-b-0" : ""
                      )}
                    >
                      <td className="px-3 py-2">{param.name}</td>
                      <td className="px-3 py-2">{param.type}</td>
                      <td 
                        className="px-3 py-2 break-all" 
                        title={param.value}
                        onClick={() => {
                          // Only mobile (<sm) copy at click
                          const isMobile = window.innerWidth < 640;
                          if (isMobile) handleCopyValue(param.value);
                        }}
                      >
                        {typeof param.value === 'string' && param.value.startsWith('0x') && param.value.length > 10 
                          ? `${param.value.substring(0, 6)}...${param.value.substring(param.value.length - 4)}`
                          : param.value}
                      </td>
                      <td className="hidden sm:table-cell px-3 py-2">
                        <CopyButton
                          value={param.value}
                          onCopy={() => {
                            toast({
                              title: "Copied to clipboard",
                              description: `Parameter value has been copied.`,
                            });
                          }}
                          className="h-6 w-6"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground w-full">No parameters</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="rounded-[24px] sm:p-16 p-5 dark:bg-card-dark bg-card-light w-full sm:w-[620px] mx-4 mt-8 mb-8">
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
              <CollapsibleSection title="Transaction Data" defaultExpanded={false}>
                {[
                  { key: "multisig_address", label: "Multisig address" },
                  { key: "to", label: "Recipient" },
                  { key: "value", label: "Value" },
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
                        <div className="relative flex-grow">
                          <textarea
                            ref={(el) => { textareaRefs.current[key] = el; }}
                            readOnly
                            value={stringValue}
                            className="w-full text-sm bg-background px-3 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:bg-white dark:text-gray-900 overflow-hidden resize-none"
                            style={{ 
                              wordBreak: "break-all",
                              whiteSpace: "pre-wrap",
                              minHeight: "40px",
                              width: "100%"
                            }}
                            onChange={() => {}}
                          />
                        </div>
                        <CopyButton
                          value={stringValue}
                          onCopy={() => {
                            toast({
                              title: "Copied to clipboard",
                              description: `${label} has been copied to clipboard.`,
                            });
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
                
                {/* Data with tabs */}
                <div className="flex flex-col space-y-2 w-full">
                  <Label>Data</Label>
                  <Tabs
                    defaultValue="raw"
                    value={activeDataTab}
                    onValueChange={(value) => {
                      setActiveDataTab(value as "raw" | "decoded");
                      // Force re-render to update textarea size
                      setTimeout(() => {
                        autoResize(textareaRefs.current["data"]);
                      }, 50);
                    }}
                    className="w-full"
                  >
                    <div className="flex justify-start mb-2 w-full">
                      <TabsList className="h-9 md:h-10 inline-flex">
                        <TabsTrigger 
                          value="raw" 
                          className="text-xs sm:text-sm px-2 sm:px-3 h-full"
                        >
                          Raw
                        </TabsTrigger>
                        <TabsTrigger 
                          value="decoded"
                          className="text-xs sm:text-sm px-2 sm:px-3 h-full"
                          disabled={!result.transaction?.data_decoded || result.transaction.data === "0x"}
                        >
                          Decoded
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent value="raw" className="mt-0 w-full">
                      <div className="flex items-center space-x-2 w-full">
                        <div className="relative flex-grow w-full">
                          <textarea
                            ref={(el) => { textareaRefs.current["data"] = el; }}
                            readOnly
                            value={result.transaction?.data || ""}
                            className="w-full text-sm bg-background px-3 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:bg-white dark:text-gray-900 overflow-hidden resize-none"
                            style={{ 
                              wordBreak: "break-all",
                              whiteSpace: "pre-wrap",
                              minHeight: "40px",
                              width: "100%"
                            }}
                            onChange={() => {}}
                          />
                        </div>
                        <CopyButton
                          value={result.transaction?.data || ""}
                          onCopy={() => {
                            toast({
                              title: "Copied to clipboard",
                              description: `Data has been copied to clipboard.`,
                            });
                          }}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="decoded" className="mt-0 w-full">
                      {renderDecodedData()}
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Encoded Message */}
                <div className="flex flex-col space-y-2 w-full">
                  <Label>Encoded message</Label>
                  <div className="flex items-center space-x-2 w-full">
                    <div className="relative flex-grow w-full">
                      <textarea
                        ref={(el) => { textareaRefs.current["encoded_message"] = el; }}
                        readOnly
                        value={result.transaction?.encoded_message || ""}
                        className="w-full text-sm bg-background px-3 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:bg-white dark:text-gray-900 overflow-hidden resize-none"
                        style={{ 
                          wordBreak: "break-all",
                          whiteSpace: "pre-wrap",
                          minHeight: "40px",
                          width: "100%"
                        }}
                        onChange={() => {}}
                      />
                    </div>
                    <CopyButton
                      value={result.transaction?.encoded_message || ""}
                      onCopy={() => {
                        toast({
                          title: "Copied to clipboard",
                          description: `Encoded message has been copied to clipboard.`,
                        });
                      }}
                    />
                  </div>
                </div>
                
                {/* Signatures (only if available) */}
                {result?.transaction?.signatures && (
                  <div className="flex flex-col space-y-2 w-full">
                    <Label>Signatures</Label>
                    <div className="flex items-center space-x-2 w-full">
                      <div className="relative flex-grow w-full">
                        <textarea
                          ref={(el) => { textareaRefs.current["signatures"] = el; }}
                          readOnly
                          value={result.transaction.signatures}
                          className="w-full text-sm bg-background px-3 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:bg-white dark:text-gray-900 overflow-hidden resize-none"
                          style={{ 
                            wordBreak: "break-all",
                            whiteSpace: "pre-wrap",
                            minHeight: "40px",
                            width: "100%"
                          }}
                          onChange={() => {}}
                        />
                      </div>
                      <CopyButton
                        value={result.transaction.signatures}
                        onCopy={() => {
                          toast({
                            title: "Copied to clipboard",
                            description: `Signatures has been copied to clipboard.`,
                          });
                        }}
                      />
                    </div>
                  </div>
                )}
              </CollapsibleSection>

              <CollapsibleSection title="Hash" defaultExpanded={true}>
                {[
                  { key: "safe_transaction_hash", label: "safeTxHash" },
                  { key: "domain_hash", label: "Domain hash" },
                  { key: "message_hash", label: "Message hash" },
                ].map(({ key, label }) => {
                  const hashValue = result.hashes?.[key as keyof typeof result.hashes] || "";
                  
                  return (
                    <div
                      key={key}
                      className="flex flex-col space-y-2 w-full"
                    >
                      <Label>{label}</Label>
                      <div className="flex items-center space-x-2 w-full">
                        <div className="relative flex-grow w-full">
                          <textarea
                            ref={(el) => { textareaRefs.current[`hash_${key}`] = el; }}
                            readOnly
                            value={hashValue}
                            className="w-full text-sm bg-background px-3 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:bg-white dark:text-gray-900 overflow-hidden resize-none"
                            style={{ 
                              wordBreak: "break-all",
                              whiteSpace: "pre-wrap",
                              minHeight: "40px",
                              width: "100%"
                            }}
                            onChange={() => {}}
                          />
                        </div>
                        <CopyButton
                          value={hashValue}
                          onCopy={() => {
                            toast({
                              title: "Copied to clipboard",
                              description: `${label} has been copied to clipboard.`,
                            });
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CollapsibleSection>
              
              <CollapsibleSection title="Expected Call" defaultExpanded={false}>
                <div className="flex flex-col space-y-2 w-full">
                  <Tabs
                    defaultValue="raw"
                    value={activeExecTab}
                    onValueChange={(value) => {
                      setActiveExecTab(value as "raw" | "decoded");
                      // Force re-render to update textarea size
                      setTimeout(() => {
                        autoResize(textareaRefs.current["exec_call_raw"]);
                      }, 50);
                    }}
                    className="w-full"
                  >
                    <div className="flex justify-start mb-2 w-full">
                      <TabsList className="h-9 md:h-10 inline-flex">
                        <TabsTrigger 
                          value="raw"
                          className="text-xs sm:text-sm px-2 sm:px-3 h-full"
                        >
                          Raw
                        </TabsTrigger>
                        <TabsTrigger 
                          value="decoded"
                          className="text-xs sm:text-sm px-2 sm:px-3 h-full"
                        >
                          Decoded
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent value="raw" className="mt-0 w-full">
                      <div className="flex items-center space-x-2 w-full">
                        <div className="relative flex-grow w-full">
                          <textarea
                            ref={(el) => { textareaRefs.current["exec_call_raw"] = el; }}
                            readOnly
                            value={result?.transaction?.exec_transaction?.encoded || ""}
                            className="w-full text-sm bg-background px-3 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:bg-white dark:text-gray-900 overflow-hidden resize-none"
                            style={{ 
                              wordBreak: "break-all",
                              whiteSpace: "pre-wrap",
                              minHeight: "40px",
                              width: "100%"
                            }}
                            onChange={() => {}}
                          />
                        </div>
                        <CopyButton
                          value={result?.transaction?.exec_transaction?.encoded || ""}
                          onCopy={() => {
                            toast({
                              title: "Copied to clipboard",
                              description: `execTransaction call has been copied to clipboard.`,
                            });
                          }}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="decoded" className="mt-0 w-full">
                      {renderDecodedExecTransaction()}
                    </TabsContent>
                  </Tabs>
                </div>
              </CollapsibleSection>
            </div>
          )
        ) : (
          <p>No results available</p>
        )}
      </CardContent>
    </Card>
  );
}