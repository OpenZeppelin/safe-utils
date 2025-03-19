import React, { useEffect, useRef, useCallback, useState } from "react";
import { Form } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/types/form-types";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DirectInputWizard from "./DirectInputWizard";
import ApiInputFields from "./ApiInputFields";
import Result from "./Result";
import { Button } from "../ui/button";

interface StepperTransactionFormProps {
  form: UseFormReturn<FormData>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
  step: number;
  nextStep: () => boolean;
  prevStep: () => void;
  result: any;
}

export default function StepperTransactionForm({
  form,
  onSubmit,
  isLoading,
  step,
  nextStep,
  prevStep,
  result
}: StepperTransactionFormProps) {
  const currentMethod = form.watch("method");
  const previousMethodRef = useRef(currentMethod);
  const stepWhenSwitchingRef = useRef(step);
  const resetRequiredRef = useRef(false);
  const [showApiResult, setShowApiResult] = useState(false);

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

  useEffect(() => {
    if (result && form.getValues("method") === "api" && isLoading === false) {
      setShowApiResult(true);
    }
  }, [result, form, isLoading]);

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
                  if (value !== "api") {
                    setShowApiResult(false);
                  }
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
            result={result}
          />
        ) : showApiResult && result ? (
          <div className="space-y-6">
            <Result result={result} />
            <div className="flex pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowApiResult(false)}
                className="px-6 rounded-full border-button text-button hover:bg-transparent dark:bg-white dark:hover:bg-gray-100 dark:text-button h-[48px]"
              >
                Back
              </Button>

            </div>
          </div>
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