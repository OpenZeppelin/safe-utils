import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/types/form-types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { parseSafeTransactionText, updateFormWithParsedData } from "@/utils/parsing/safeTransactionText";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Clipboard, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { NETWORKS } from "@/app/constants";
import { Badge } from "@/components/ui/badge";

interface PasteTransactionDetailsProps {
  form: UseFormReturn<FormData>;
  onParsed?: () => void;
}

// Type for debug info
interface DebugInfo {
  hasTruncatedFields: boolean;
  truncatedFields?: string[];
  containsEllipsis: boolean;
  textSnippet: string;
  parsedDataSnapshot?: Record<string, any>;
}

// Define the essential fields that should be checked
const ESSENTIAL_FIELDS = [
  { key: "address", label: "Safe Address" },
  { key: "to", label: "Recipient address" },
  { key: "value", label: "Transaction value" },
  { key: "data", label: "Transaction data" },
  { key: "network", label: "Network" },
  { key: "operation", label: "Operation type" },
  { key: "nonce", label: "Transaction nonce" }
];

// Optional fields that are nice to have but not critical
const OPTIONAL_FIELDS = [
  { key: "safeTxGas", label: "Safe TX gas" },
  { key: "baseGas", label: "Base gas" },
  { key: "gasPrice", label: "Gas price" },
  { key: "gasToken", label: "Gas token" },
  { key: "refundReceiver", label: "Refund receiver" }
];

export default function PasteTransactionDetails({ form, onParsed }: PasteTransactionDetailsProps) {
  const [pasteText, setPasteText] = useState("");
  const [processingStatus, setProcessingStatus] = useState<"idle" | "success" | "error" | "warning">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [truncatedFields, setTruncatedFields] = useState<string[]>([]);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [detectedNetwork, setDetectedNetwork] = useState<string | null>(null);
  const [detectedShortName, setDetectedShortName] = useState<string | null>(null);
  const [allNetworkShortNames, setAllNetworkShortNames] = useState<string[] | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const { toast } = useToast();

  const handlePaste = async () => {
    try {
      // Try to get text from clipboard
      const clipboardText = await navigator.clipboard.readText();
      setPasteText(clipboardText);
    } catch (error) {
      toast({
        title: "Clipboard access denied",
        description: "Please paste the transaction details manually into the text area.",
        variant: "destructive",
      });
    }
  };

  /**
   * Check which essential fields are missing from the parsed data
   * @param parsedData The data parsed from the transaction text
   * @returns Array of labels for missing essential fields
   */
  const checkMissingFields = (parsedData: Record<string, any>): string[] => {
    return ESSENTIAL_FIELDS
      .filter(field => {
        const value = parsedData[field.key];
        // Check if the field is missing or empty ("0" is a valid value for value and operation)
        return value === undefined || 
               (value !== "0" && !value) || 
               (typeof value === "string" && value.trim() === "");
      })
      .map(field => field.label);
  };

  const handleProcess = () => {
    if (!pasteText.trim()) {
      setProcessingStatus("error");
      setErrorMessage("Please paste transaction details first.");
      return;
    }

    try {
      const parsedData = parseSafeTransactionText(pasteText);
      
      // Store debug info for troubleshooting
      if (process.env.NODE_ENV === 'development') {
        setDebugInfo({
          hasTruncatedFields: parsedData.truncatedFields !== undefined && parsedData.truncatedFields.length > 0,
          truncatedFields: parsedData.truncatedFields,
          containsEllipsis: pasteText.includes('...'),
          textSnippet: pasteText.substring(0, 100) + (pasteText.length > 100 ? '...' : ''),
          parsedDataSnapshot: { ...parsedData }
        });
      }
      
      // Check if we got at least some data
      const hasData = Object.entries(parsedData).some(([key, value]) => 
        value !== undefined && 
        !Array.isArray(value) && 
        !['truncatedFields', 'detectedShortName', 'allNetworkShortNames'].includes(key)
      );
      
      if (!hasData) {
        setProcessingStatus("error");
        setErrorMessage("Could not find any transaction details in the pasted text. Please make sure you're pasting the right content.");
        return;
      }
      
      // Check for truncated fields
      const hasTruncatedFields = parsedData.truncatedFields && parsedData.truncatedFields.length > 0;
      
      if (hasTruncatedFields) {
        setTruncatedFields(parsedData.truncatedFields || []);
        setProcessingStatus("warning");
        setWarningMessage(
          `Some fields appear to be truncated: ${parsedData.truncatedFields?.join(', ')}. ` +
          `Please expand these fields in Safe UI by clicking "show more" before copying.`
        );
        // Don't update the form with incomplete data
        return;
      }
      
      // Fallback checks for truncation patterns that might have been missed
      if (parsedData.data && parsedData.data.includes('...')) {
        setTruncatedFields(['data']);
        setProcessingStatus("warning");
        setWarningMessage(
          "The data field appears to be truncated. " +
          "Please expand this field in Safe UI by clicking \"show more\" before copying."
        );
        return;
      }
      
      // Check for missing fields
      const missing = checkMissingFields(parsedData);
      setMissingFields(missing);
      
      // Network related processing
      setDetectedNetwork(parsedData.network || null);
      setDetectedShortName(parsedData.detectedShortName || null);
      setAllNetworkShortNames(parsedData.allNetworkShortNames || null);
      
      // Reset the form before populating it with new data
      // This ensures old values don't persist if they're not in the current parsed data
      form.reset({
        method: form.getValues("method"), // Preserve the current method
        network: "",
        chainId: 0,
        address: "",
        to: "",
        value: "",
        data: "",
        operation: "",
        safeTxGas: "",
        baseGas: "",
        gasPrice: "",
        gasToken: "",
        refundReceiver: "",
        nonce: "",
        version: form.getValues("version") || "" // Preserve the current version
      });
      
      // Update the form with the parsed data
      updateFormWithParsedData(form, parsedData);
      
      setProcessingStatus("success");
      
      // Customize toast message based on whether fields are missing
      const toastDescription = missing.length > 0
        ? "Form partially filled. Some fields couldn't be detected and may need manual input."
        : "The form has been filled with the parsed transaction details.";
      
      toast({
        title: "Transaction details parsed",
        description: toastDescription,
        variant: "default",
      });
      
      // Call callback if provided
      if (onParsed) {
        onParsed();
      }
    } catch (error) {
      console.error("Error parsing transaction:", error);
      setProcessingStatus("error");
      setErrorMessage(
        error instanceof Error 
          ? `Error: ${error.message}` 
          : "Failed to parse transaction details. Please check the format and try again."
      );
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPasteText(e.target.value);
    if (processingStatus !== "idle") {
      setProcessingStatus("idle");
      setTruncatedFields([]);
      setMissingFields([]);
      setDebugInfo(null);
    }
  };

  // Get network details for display
  const getNetworkDetails = () => {
    if (!detectedNetwork) return null;
    
    const network = NETWORKS.find(n => n.value === detectedNetwork);
    if (!network) return null;
    
    return (
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2">
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/${network.logo}`}
            alt={`${network.label} logo`}
            className="w-5 h-5"
          />
          <span className="text-sm">
            Detected network: <strong>{network.label}</strong> (Chain ID: {network.chainId})
          </span>
        </div>
        
        {detectedShortName && (
          <div className="flex items-center gap-2 text-sm">
            <Info className="w-4 h-4 text-muted-foreground" />
            <span>
              Detected shortname: <Badge variant="outline">{detectedShortName}</Badge>
            </span>
          </div>
        )}
        
        {allNetworkShortNames && allNetworkShortNames.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Alternative shortnames:</span>
            <div className="flex flex-wrap gap-1">
              {allNetworkShortNames
                .filter(name => name !== detectedShortName)
                .map(name => (
                  <Badge key={name} variant="secondary">{name}</Badge>
                ))
              }
            </div>
          </div>
        )}
      </div>
    );
  };

  // Display information about missing fields
  const getMissingFieldsInfo = () => {
    if (missingFields.length === 0) return null;
    
    return (
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          <span className="text-sm font-medium">
            Please complete these fields manually:
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {missingFields.map(field => (
            <Badge key={field} variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
              {field}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="rounded-[12px] dark:bg-card-dark bg-card-light w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Paste Transaction Details</CardTitle>
        <CardDescription>
          Paste the transaction details copied from Safe to automatically fill the form fields.
          The parser will detect network information from chain shortnames like "eth:" or "gnosis:".
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="relative">
              <Textarea
                placeholder="Paste transaction details here..."
                value={pasteText}
                onChange={handleTextChange}
                className="min-h-[200px] resize-none"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2"
                onClick={handlePaste}
                type="button"
              >
                <Clipboard className="h-4 w-4 mr-1" />
                Paste
              </Button>
            </div>
          </div>

          {processingStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {processingStatus === "warning" && (
            <Alert variant="default" className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900">
              <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <AlertTitle>Truncated Content Detected</AlertTitle>
              <AlertDescription className="space-y-2">
                <p className="font-medium">{warningMessage}</p>
                <div className="flex flex-col gap-1 mt-2">
                  <p className="font-semibold text-xs">How to expand truncated fields:</p>
                  <ol className="text-xs list-decimal pl-4 space-y-1">
                    <li>In Safe UI, look for fields marked with "..." or "show more"</li>
                    <li>Click on "show more" to expand the complete content</li>
                    <li>Copy the transaction details again with fully expanded fields</li>
                    <li>Paste the complete content here</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {processingStatus === "success" && (
            <Alert variant="default" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                <p>Transaction details successfully parsed and form updated.</p>
                {getNetworkDetails()}
                {getMissingFieldsInfo()}
              </AlertDescription>
            </Alert>
          )}
          
          {debugInfo && process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900/50">
              <div className="text-xs font-mono overflow-x-auto">
                <p className="font-semibold">Debug Info:</p>
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleProcess} 
          type="button" 
          disabled={!pasteText.trim()}
          className="bg-button hover:bg-button-hover active:bg-button-active text-white w-full"
        >
          Parse and Fill Form
        </Button>
      </CardFooter>
    </Card>
  );
} 