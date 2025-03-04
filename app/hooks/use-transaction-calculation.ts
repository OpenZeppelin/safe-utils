import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ReadonlyURLSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { NETWORKS } from "@/app/constants";
import { calculateHashes } from "@/components/safeHashesComponent";
import { fetchTransactionDataFromApi } from "@/utils/api";
import { FormData, CalculationResult, TransactionParams } from "@/types/form-types";
import { decodeTransactionData } from "@/utils/decoding/transactionData";
import { encodeExecTransaction } from "@/utils/encoding/execTransaction";

export function useTransactionCalculation(searchParams: ReadonlyURLSearchParams) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [calculationRequested, setCalculationRequested] = useState(false);

  const { toast } = useToast();

  // Extract parameters from URL
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

  // Initialize form
  const form = useForm<FormData>({
    defaultValues: {
      method: "direct",
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

  // Set initial values from search parameter
  useEffect(() => {
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

  // Verify form validity to proceed to next step
  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      // Verify Basic Info data
      const { network, chainId, address, nonce, version } = form.getValues();
      return !!network && !!chainId && !!address && !!nonce && !!version;
    }
    if (currentStep === 2) {
      // Verify Transaction data
      const { to, operation } = form.getValues();
      return !!to && !!operation;
    }
    return true;
  };

  // Function to go to next step
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      return true;
    } else {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields to continue.",
        variant: "destructive",
      });
      return false;
    }
  };

  const prevStep = () => {
    setStep(Math.max(1, step - 1));
  };

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    setResult(null);
    setCalculationRequested(true);
  
    try {
      let txParams: TransactionParams = {
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
          setCalculationRequested(false);
          throw new Error(`API Error: ${error.message}`);
        }
      }

      if (!txParams.dataDecoded && txParams.data !== "0x") {
        txParams.dataDecoded = await decodeTransactionData(
          txParams.to, 
          txParams.data, 
          data.chainId.toString()
        );
      }

      const execTransactionCall = encodeExecTransaction(
        txParams.to,
        txParams.value,
        txParams.data,
        txParams.operation.toString(),
        txParams.safeTxGas,
        txParams.baseGas,
        txParams.gasPrice,
        txParams.gasToken,
        txParams.refundReceiver,
        txParams.signatures || "0x"
      );
      
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
          },
          exec_transaction: {
            encoded: execTransactionCall.encoded,
            decoded: execTransactionCall.decoded
          },
          signatures: txParams.signatures !== "0x" ? txParams.signatures : undefined
        },
        hashes: {
          domain_hash: domainHash,
          message_hash: messageHash,
          safe_transaction_hash: safeTxHash,
        }
      });
    } catch (error: any) {
      console.error("Error:", error);
      
      if (data.method === "api" && error.message.includes("API Error")) {
        setCalculationRequested(false);
      } else {
        setResult({
          error: error.message || "An error occurred during hash calculation."
        });
      }
      
      toast({
        title: "Error",
        description: error.message || "An error occurred during hash calculation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    result,
    isLoading,
    calculationRequested,
    handleSubmit: form.handleSubmit(handleSubmit),
    safeAddress,
    network,
    chainId,
    address,
    nonce,
    step,
    nextStep,
    prevStep,
    validateStep
  };
}