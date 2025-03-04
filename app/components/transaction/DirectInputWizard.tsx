import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { StepProgressIndicator } from "@/components/ui/step-progress-indicator";
import { FormData } from "@/types/form-types";
import BasicInfoStep from "@/components/transaction/BasicInfoStep";
import TransactionDetailsStep from "@/components/transaction/TransactionDetailsStep";
import AdvancedParamsStep from "@/components/transaction/AdvancedParamsStep";

interface DirectInputWizardProps {
  form: UseFormReturn<FormData>;
  step: number;
  nextStep: () => boolean;
  prevStep: () => void
  isSubmitting: boolean;
  calculationSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export default function DirectInputWizard({ 
  form, 
  step, 
  nextStep, 
  prevStep, 
  isSubmitting,
  calculationSubmit
}: DirectInputWizardProps) {
  const [submitting, setSubmitting] = useState(false);
  const steps = ["Basic Information", "Transaction Details", "Advanced Parameters"];

  useEffect(() => {
    if (!isSubmitting) {
      setSubmitting(false);
    }
  }, [isSubmitting]);

  const visualStep = submitting ? 4 : step;

  const handleBack = () => {
    if (step >= 3) {
      if (step === 4) {
        prevStep(); 
        prevStep();
      } else {
        prevStep();
      }
    } else {
      prevStep();
    }
  };

  return (
    <div className="space-y-6">
      <StepProgressIndicator 
        steps={steps}
        currentStep={visualStep}
      />

      <div className="min-h-[320px]">
        {step === 1 && <BasicInfoStep form={form} />}
        {step === 2 && <TransactionDetailsStep form={form} />}
        {(step === 3 || step === 4) && <AdvancedParamsStep form={form} />}
      </div>

      <div className="flex justify-between pt-4">
        {step > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="px-6 rounded-full border-button text-button hover:bg-transparent dark:bg-white dark:hover:bg-gray-100 h-[48px]"
          >
            Back
          </Button>
        ) : (
          <div />
        )}
        
        {step < 3 && (
          <Button
            type="button"
            onClick={() => {
              nextStep();
            }}
            className="bg-button hover:bg-button-hover active:bg-button-active text-white rounded-full px-6 h-[48px]"
          >
            Continue
          </Button>
        )}
        
        {step >= 3 && (
          <Button
            type="button" 
            disabled={isSubmitting}
            onClick={async (e) => {
              setSubmitting(true);
              await calculationSubmit(e);
            }} 
            className="bg-button hover:bg-button-hover active:bg-button-active text-white rounded-full px-6 h-[48px]"
          >
            {isSubmitting ? "Calculating..." : "Calculate Hash"}
          </Button>
        )}
      </div>
    </div>
  );
}