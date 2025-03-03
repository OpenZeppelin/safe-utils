import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/types/form-types";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AdvancedParamsStepProps {
  form: UseFormReturn<FormData>;
}

export default function AdvancedParamsStep({ form }: AdvancedParamsStepProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-medium">Advanced parameters</h3>
      
      <FormField
        control={form.control}
        name="safeTxGas"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Safe transaction gas</FormLabel>
            <FormControl>
              <Input placeholder="Enter safeTxGas" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="baseGas"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Base gas</FormLabel>
            <FormControl>
              <Input placeholder="Enter baseGas" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="gasPrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gas price</FormLabel>
            <FormControl>
              <Input placeholder="Enter gasPrice" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="gasToken"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gas token</FormLabel>
            <FormControl>
              <Input placeholder="Enter gasToken address" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="refundReceiver"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Refund receiver</FormLabel>
            <FormControl>
              <Input placeholder="Enter refundReceiver address" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}