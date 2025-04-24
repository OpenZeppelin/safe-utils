import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PixelAvatar from "@/components/pixel-avatar";
import { Separator } from "@/components/ui/separator";
import HashDetails from "../result/hash-details";
import TransactionDetails from "../result/transaction-details";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { NETWORKS } from "@/app/constants";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function Result({ result }: any) {
  const [hashesExpanded, setHashesExpanded] = useState(true);
  const [transactionExpanded, setTransactionExpanded] = useState(false);

  if (!result) return null;
  else if (result.error) {
    return <div className="max-w-3xl mx-auto">
      <h3 className="text-lg font-medium mb-4">Error</h3>
      <p className="text-red-500">{result.error}</p>
    </div>
  }

  const execParams = result.transaction?.exec_transaction?.decoded?.parameters;

  // Mapping the parameters by name for easy access
  const params = execParams ? execParams.reduce((acc: any, param: any) => {
    acc[param.name] = param.value;
    return acc;
  }, {}) : {};

  const networkDetails = result.network?.name ?
    NETWORKS.find((n) => n.value === result.network.name || n.label === result.network.name) :
    null;

  const networkLogo = networkDetails?.logo || '';

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
          <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2 cursor-pointer" onClick={() => setTransactionExpanded(true)}>
            <Alert variant="warning" className="mb-4">
              <AlertTriangle className="h-6 w-6" />
              <AlertTitle className="text-lg">Verify Transaction Details</AlertTitle>
              <AlertDescription className="text-md">
                Before signing, make sure all transaction details match. Click to see the full transaction details below.
              </AlertDescription>
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
    </div>
  );
}