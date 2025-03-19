"use client";

import { Suspense, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/toaster";
import { useSearchParams } from "next/navigation";
import { useTransactionCalculation } from "@/hooks/use-transaction-calculation";
import StepperTransactionForm from "@/components/transaction/StepperTransactionForm";
import Link from "next/link";

function HomeContent() {
  const searchParams = useSearchParams();
  
  const {
    form,
    result,
    isLoading,
    calculationRequested,
    handleSubmit,
    step,
    nextStep,
    prevStep,
  } = useTransactionCalculation(searchParams);

  const [lastMethod, setLastMethod] = useState(form.watch("method"));
  
  useEffect(() => {
    const currentMethod = form.watch("method");
    if (currentMethod !== lastMethod) {
      setLastMethod(currentMethod);
    }
  }, [calculationRequested, step, form, lastMethod]);

  return (
    <>
      <Toaster />
      <div className="flex flex-col w-full justify-center items-center p-5">
        <h1 className="text-[48px] font-semibold text-center mb-4 dark:text-title-dark text-title-light">
          Safe Utils
        </h1>
        <div className="text-center max-w-2xl mb-8">
          <p className="text-muted-foreground">
            Verify Safe transaction hashes before signing and executing. Calculate domain, message, and 
            transaction hashes based on EIP-712 standard.{" "}
            <Link 
            href="/how-it-works" 
            className="text-primary hover:underline"
            >
              Learn more.
            </Link>
          </p>
        </div>
        <Card className="rounded-[24px] sm:p-12 p-5 dark:bg-card-dark bg-card-light w-full sm:w-[650px] mx-4">
          <CardContent>
            <StepperTransactionForm 
              form={form}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              step={step}
              nextStep={nextStep}
              prevStep={prevStep}
              result={result}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex flex-col w-full justify-center items-center p-5">
      <h1 className="text-[48px] font-semibold text-center mb-8 dark:text-title-dark text-title-light">
        Safe Utils
      </h1>
      <Card className="rounded-[24px] sm:p-16 p-5 dark:bg-card-dark bg-card-light w-full sm:w-[555px] mx-4">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-40 mt-6" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeContent />
    </Suspense>
  );
}