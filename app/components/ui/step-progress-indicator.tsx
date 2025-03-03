import React from 'react';
import { cn } from '@/lib/utils';

interface StepProgressIndicatorProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function StepProgressIndicator({ steps, currentStep, className }: StepProgressIndicatorProps) {
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2",
                  idx + 1 < currentStep 
                    ? "bg-green-500 border-green-500 text-white"
                    : idx + 1 === currentStep
                    ? "bg-button border-button text-white" 
                    : "bg-white border-gray-300 text-gray-400 dark:bg-card-dark dark:border-gray-600"
                )}
              >
                {idx + 1 < currentStep ? (
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-xs sm:text-sm">{idx + 1}</span>
                )}
              </div>
              <span 
                className={cn(
                  "mt-1 sm:mt-2 text-[10px] sm:text-xs text-center",
                  idx + 1 < currentStep 
                    ? "text-green-500 font-semibold"  // Completed step (green)
                    : idx + 1 === currentStep 
                      ? "text-button font-semibold"   // Current step (violet)
                      : "text-gray-400"               // Future step (grey)
                )}
              >
                <span className="hidden xs:inline">{step}</span>
                <span className="inline xs:hidden">{idx + 1}</span>
              </span>
            </div>
            
            {idx < steps.length - 1 && (
              <div 
                className={cn(
                  "flex-1 h-0.5 mx-1 sm:mx-2",
                  idx + 1 < currentStep ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}