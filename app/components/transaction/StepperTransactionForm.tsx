import React, { useEffect, useRef, useCallback } from "react";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/types/form-types";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DirectInputWizard from "./DirectInputWizard";
import ApiInputFields from "./ApiInputFields";

interface StepperTransactionFormProps {
  form: UseFormReturn<FormData>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>; 
  isLoading: boolean;
  step: number;
  nextStep: () => boolean;
  prevStep: () => void;
}

export default function StepperTransactionForm({
  form,
  onSubmit,
  isLoading,
  step,
  nextStep,
  prevStep
}: StepperTransactionFormProps) {
  const currentMethod = form.watch("method");
  const previousMethodRef = useRef(currentMethod);
  const stepWhenSwitchingRef = useRef(step);
  const resetRequiredRef = useRef(false);

  const resetToStep1 = useCallback(() => {

    const stepsToGoBack = stepWhenSwitchingRef.current - 1;
    
    for (let i = 0; i < stepsToGoBack; i++) {
      setTimeout(() => {
        prevStep();
      }, i * 50);
    }
  }, [prevStep]);

  useEffect(() => {
    if (currentMethod !== previousMethodRef.current) {
      stepWhenSwitchingRef.current = step;
      resetRequiredRef.current = true;
      previousMethodRef.current = currentMethod;
    }
  }, [currentMethod, step]);

  useEffect(() => {
    if (resetRequiredRef.current && currentMethod === "direct" && step > 1) {
      resetRequiredRef.current = false;
      resetToStep1();
    }
  }, [currentMethod, step, resetToStep1]);

  const handleCalculationSubmit = async (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    try {
      await form.handleSubmit(async (data) => {
        await onSubmit(e);
        if (data.method === "direct" && step < 4) {
          nextStep();
        }
      })(e);
    } catch (error) {
      console.error("Calculation error:", error);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="method">Calculation method</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger id="method">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="direct">Manual input (Direct)</SelectItem>
                  <SelectItem value="api">Safe API (Transaction retrieval)</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground mt-1">
                {field.value === "direct"
                  ? "Enter all transaction parameters manually"
                  : "Retrieve transaction data from Safe API using network, address and nonce"
                }
              </div>
            </FormItem>
          )}
        />

        {form.watch("method") === "direct" ? (
          <DirectInputWizard
            form={form}
            step={step}
            nextStep={nextStep}
            prevStep={prevStep}
            isSubmitting={isLoading}
            calculationSubmit={handleCalculationSubmit}
          />
        ) : (
          <div className="space-y-6">
            <ApiInputFields form={form} />

            <div className="flex justify-end pt-4">
              <button
                type="button"
                disabled={isLoading}
                onClick={async (e) => {
                  await handleCalculationSubmit(e);
                }}
                className="bg-button hover:bg-button-hover active:bg-button-active text-white rounded-full px-6 py-2"
              >
                {isLoading ? "Calculating..." : "Calculate Hash"}
              </button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}