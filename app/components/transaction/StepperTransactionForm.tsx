import React from "react";
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

  // Modifica qui: controlliamo se siamo già nello step 4, in tal caso non avanzare oltre
  const handleCalculationSubmit = async (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    await form.handleSubmit(async (data) => {
      await onSubmit(e);
      // Avanza solo se non siamo già nello step finale (4)
      if (step < 4) {
        nextStep();
      }
    })(e);
  };

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calculation method</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
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