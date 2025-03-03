import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "@/types/form-types";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface TransactionDetailsStepProps {
  form: UseFormReturn<FormData>;
}

export default function TransactionDetailsStep({ form }: TransactionDetailsStepProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-medium">Transaction parameters</h3>
      
      <FormField
        control={form.control}
        name="to"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recipient address (To)</FormLabel>
            <FormControl>
              <Input placeholder="Enter recipient address" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="value"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Value (in wei)</FormLabel>
            <FormControl>
              <Input placeholder="Enter value in wei" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="data"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Transaction data</FormLabel>
            <FormControl>
              <Input placeholder="Enter transaction data" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="operation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Operation</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="0">Call (0)</SelectItem>
                <SelectItem value="1">DelegateCall (1)</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
}