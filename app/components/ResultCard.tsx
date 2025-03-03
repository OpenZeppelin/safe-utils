import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/ui/copy-button";
import { useToast } from "@/hooks/use-toast";
import { CalculationResult } from "@/types/form-types";

interface ResultCardProps {
  result: CalculationResult | null;
  isLoading: boolean;
}

export default function ResultCard({ result, isLoading }: ResultCardProps) {
  const { toast } = useToast();

  const autoResize = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight + 2) + 'px';
  };

  const textareaRefs = useRef<{[key: string]: HTMLTextAreaElement | null}>({});
  
  // Auto-resize all textareas when content changes
  useEffect(() => {
    if (!result) return;
    
    Object.keys(textareaRefs.current).forEach(key => {
      autoResize(textareaRefs.current[key]);
    });
  }, [result]);

  return (
    <Card className="rounded-[24px] sm:p-16 p-5 dark:bg-card-dark bg-card-light w-full sm:w-[620px] mx-4 mt-8">
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
                  { key: "to", label: "Recipient" },
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
                        <div className="relative flex-grow">
                          <textarea
                            ref={(el) => { textareaRefs.current[key] = el; }}
                            readOnly
                            value={stringValue}
                            className="w-full text-sm bg-background px-3 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:bg-white dark:text-gray-900 overflow-hidden resize-none"
                            style={{ 
                              wordBreak: "break-all",
                              whiteSpace: "pre-wrap",
                              minHeight: "40px"
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
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Hash</h3>
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
                        <div className="relative flex-grow">
                          <textarea
                            ref={(el) => { textareaRefs.current[`hash_${key}`] = el; }}
                            readOnly
                            value={hashValue}
                            className="w-full text-sm bg-background px-3 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:bg-white dark:text-gray-900 overflow-hidden resize-none"
                            style={{ 
                              wordBreak: "break-all",
                              whiteSpace: "pre-wrap",
                              minHeight: "40px"
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
              </div>
            </div>
          )
        ) : (
          <p>No results available</p>
        )}
      </CardContent>
    </Card>
  );
}