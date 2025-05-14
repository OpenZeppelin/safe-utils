import { ChevronDown, ChevronUp, AlertTriangle, Search, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PixelAvatar from "@/components/pixel-avatar";
import { Separator } from "@/components/ui/separator";
import HashDetails from "../result/hash-details";
import TransactionDetails from "../result/transaction-details";
import { useState, useEffect, useMemo } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { NETWORKS, ZERO_ADDRESS } from "@/app/constants";
import { trustedAddresses } from "../result/trusted-addresses";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const shortenAddress = (address: string) => {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export default function Result({ result }: any) {
  const [hashesExpanded, setHashesExpanded] = useState(true);
  const [transactionExpanded, setTransactionExpanded] = useState(false);
  const [warningsExpanded, setWarningsExpanded] = useState(false);
  const [infoExpanded, setInfoExpanded] = useState(false);
  const [nestedSafeExpanded, setNestedSafeExpanded] = useState(true);

  // States for warnings and informational notices
  const [warnings, setWarnings] = useState<{title: string, description: string}[]>([]);
  const [infoNotices, setInfoNotices] = useState<{title: string, description: string}[]>([]);

  // Process all hooks before conditionals
  const execParams = result?.transaction?.exec_transaction?.decoded?.parameters;
  
  const params = useMemo(() => {
    if (!execParams) return {};
    return execParams.reduce((acc: any, param: any) => {
      acc[param.name] = param.value;
      return acc;
    }, {});
  }, [execParams]);
  
  const networkDetails = result?.network?.name ?
    NETWORKS.find((n) => n.value === result.network.name || n.label === result.network.name) :
    null;
  
  const networkLogo = networkDetails?.logo || '';
  
  useEffect(() => {
    if (!params) return;
    
    const newWarnings: {title: string, description: string}[] = [];
    const newInfoNotices: {title: string, description: string}[] = [];
    
    if (params) {
      // Check for delegateCall operation
      if (Number(params.operation) === 1) {
        const to = params.to;
        const normalizedTo = to?.toLowerCase();
        const isTrustedAddress = normalizedTo && trustedAddresses.some(
          address => address.toLowerCase() === normalizedTo
        );
        
        if (isTrustedAddress) {
          newInfoNotices.push({
            title: "Trusted Delegate Call",
            description: `This transaction uses a trusted delegate call to ${shortenAddress(to)}.`
          });
        } else if (to) {
          newWarnings.push({
            title: "Untrusted Delegate Call",
            description: `This transaction includes an untrusted delegate call to ${shortenAddress(to)}. This may lead to unexpected behavior or vulnerabilities.`
          });
        }
      }

      // Check for custom gas token and refund receiver
      const gasToken = params.gasToken;
      const refundReceiver = params.refundReceiver;
      const gasPrice = params.gasPrice;

      const hasCustomGasToken = gasToken && gasToken !== ZERO_ADDRESS;
      const hasCustomRefundReceiver = refundReceiver && refundReceiver !== ZERO_ADDRESS;
      const hasNonZeroGasPrice = gasPrice && gasPrice !== "0";

      if (hasCustomGasToken && hasCustomRefundReceiver) {
        newWarnings.push({
          title: "Custom Gas Token and Refund Receiver",
          description: `This transaction uses a custom gas token AND a custom refund receiver.\nThis combination can be used to hide a rerouting of funds through gas refunds.${
            hasNonZeroGasPrice ? '\nFurthermore, the gas price is non-zero, which increases the potential for hidden value transfers.' : ''
          }`
        });
      } else if (hasCustomGasToken) {
        newWarnings.push({
          title: "Custom Gas Token",
          description: "This transaction uses a custom gas token. Please verify that this is intended."
        });
      } else if (hasCustomRefundReceiver) {
        newWarnings.push({
          title: "Custom Refund Receiver",
          description: "This transaction uses a custom refund receiver. Please verify that this is intended."
        });
      }
    }

    // Set the warnings and info notices
    setWarnings(newWarnings);
    setInfoNotices(newInfoNotices);
  }, [params]);

  // Early returns after all hooks
  if (!result) return null;
  if (result.error) {
    return (
      <div className="max-w-3xl mx-auto">
        <h3 className="text-lg font-medium mb-4">Error</h3>
        <p className="text-red-500">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h3 className="text-lg font-medium mb-4">Result</h3>

      {/* Header section */}
      <div className="">
        <div className="flex flex-col sm:flex-row sm:items-end gap-2 ">
          {/* Safe info & badges */}
          <div className="flex flex-wrap gap-2 items-center flex-1">
            <Badge variant="secondary" className="text-sm px-3 py-1">Nonce: {result.transaction?.nonce}</Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">Safe Version: {result.transaction?.version}</Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1 gap-1">
              <Avatar className="h-5 w-5">
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/${networkLogo}`}
                  alt={result.network?.name || "Network"}
                />
              </Avatar>
              <div className="flex items-end space-x-1">
                <div className="font-medium text-sm">
                  {result.network?.name}
                </div>
                <div className="text-sm text-muted-foreground -mt-0.5">(Chain ID: {result.network?.chain_id})</div>
              </div>

            </Badge>
          </div>
        </div>

        {/* Multisig address */}
        <div className="mt-4">
          <Label htmlFor="multisig-address" className="text-black text-md dark:text-white">Multisig Address</Label>
          <div className="relative mt-1">
            <Input
              id="multisig-address"
              value={result.transaction?.multisig_address}
              readOnly
              className="text-md"
              leftIcon={<PixelAvatar address={result.transaction?.multisig_address} />}
            />
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Transaction Alerts Summary */}
      <div className="flex gap-4 mb-4 items-center">
        {warnings.length > 0 && (
          <Button 
            type="button"
            variant="ghost" 
            onClick={() => setWarningsExpanded(!warningsExpanded)}
            className="flex items-center gap-1 text-amber-600 dark:text-amber-500"
          >
            <AlertTriangle className="h-6 w-6" />
            <span className="font-medium">{warnings.length} {warnings.length === 1 ? 'Warning' : 'Warnings'}</span>
          </Button>
        )}
        {infoNotices.length > 0 && (
          <Button
            type="button"
            variant="ghost" 
            onClick={() => setInfoExpanded(!infoExpanded)}
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400"
          >
            <Search className="h-6 w-6" />
            <span className="font-medium">{infoNotices.length} Info</span>
          </Button>
        )}
      </div>

      {/* Expanded Alerts details */}
      {warningsExpanded && warnings.length > 0 && (
        <div className="mb-6 space-y-2">
          {warnings.map((warning, index) => (
            <Alert key={index} variant="warning" className="flex items-start gap-4">
              <div className="flex-shrink-0 pt-1">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <AlertTitle className="text-sm font-semibold">{warning.title}</AlertTitle>
                <AlertDescription className="text-sm whitespace-pre-wrap">
                  {warning.description.split("\n").map((line, idx) => (
                    <span key={idx}>{line}<br/></span>
                  ))}
                </AlertDescription>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {infoExpanded && infoNotices.length > 0 && (
        <div className="mb-6 space-y-2">
          {infoNotices.map((info, index) => (
            <Alert key={index} variant="default" className="bg-blue-50/50 dark:bg-blue-950/50 flex items-start gap-4">
              <div className="flex-shrink-0 pt-1">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <AlertTitle className="text-sm font-semibold text-blue-700 dark:text-blue-400">{info.title}</AlertTitle>
                <AlertDescription className="text-sm text-blue-600 dark:text-blue-300">
                  {info.description}
                </AlertDescription>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* Expandable Hashes section */}
      <Collapsible
        open={hashesExpanded}
        onOpenChange={setHashesExpanded}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium flex items-center gap-2">
            Hashes
          </h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="default" className="gap-1">
              {hashesExpanded ? (
                <>Hide<ChevronUp className="h-4 w-4" /></>
              ) : (
                <>View details<ChevronDown className="h-4 w-4" /></>
              )}
            </Button>
          </CollapsibleTrigger>
        </div>

        {!hashesExpanded && (
          <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2 cursor-pointer" onClick={() => setHashesExpanded(true)}>
            <span className="text-primary cursor-pointer">
              Click to see Domain Hash, Message Hash, and SafeTxHash
            </span>
          </div>
        )}

        <CollapsibleContent className="mt-4">
          <HashDetails
            domainHash={result.hashes?.domain_hash}
            messageHash={result.hashes?.message_hash}
            safeTxHash={result.hashes?.safe_transaction_hash}
          />
        </CollapsibleContent>
      </Collapsible>

      <Separator className="my-6" />

      {/* Expandable Transaction Details section */}
      <Collapsible
        open={transactionExpanded}
        onOpenChange={setTransactionExpanded}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium flex items-center gap-2">
            Transaction Details
          </h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="default" className="gap-1">
              {transactionExpanded ? (
                <>Hide<ChevronUp className="h-4 w-4" /></>
              ) : (
                <>View details<ChevronDown className="h-4 w-4" /></>
              )}
            </Button>
          </CollapsibleTrigger>
        </div>

        {!transactionExpanded && (
          <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2" onClick={() => setTransactionExpanded(true)}>
            <Alert variant="warning" className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <AlertDescription className="text-md">
                  Before signing, make sure all transaction details match. Click to see the full transaction details below.
                </AlertDescription>
              </div>
            </Alert>
          </div>
        )}

        <CollapsibleContent>
          <TransactionDetails
            to={params.to}
            value={params.value}
            data={params.data}
            dataDecoded={result.transaction?.data_decoded}
            operation={params.operation}
            safeTxGas={params.safeTxGas}
            baseGas={params.baseGas}
            gasPrice={params.gasPrice}
            gasToken={params.gasToken}
            refundReceiver={params.refundReceiver}
            nonce={result.transaction?.nonce}
            encodedCall={result.transaction?.exec_transaction?.encoded}
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Expandable Nested Safe Values */}
      {result.nestedSafe && (
        <>
          <Separator className="my-6" />
          <Collapsible
            open={nestedSafeExpanded}
            onOpenChange={setNestedSafeExpanded}
            className="mb-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium flex items-center gap-2">
                Nested Safe Hashes
              </h2>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="default" className="gap-1">
                  {nestedSafeExpanded ? (
                    <>Hide<ChevronUp className="h-4 w-4" /></>
                  ) : (
                    <>View details<ChevronDown className="h-4 w-4" /></>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>

            {!nestedSafeExpanded && (
              <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2 cursor-pointer"
                onClick={() => setNestedSafeExpanded(true)}
              >
                <span className="text-primary cursor-pointer">
                  Click to see Nested Safe Transaction Hash, Domain Hash, and Message Hash
                </span>
              </div>
            )}

            <CollapsibleContent className="mt-4">
              <HashDetails
                safeTxHash={result.nestedSafe.safeTxHash}
                domainHash={result.nestedSafe.domainHash}
                messageHash={result.nestedSafe.messageHash}
              />
            </CollapsibleContent>
          </Collapsible>
        </>
      )}
    </div>
  );
}