"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

const ALWAYS_SHOW = process.env.NEXT_PUBLIC_ALWAYS_SHOW_DISCLAIMER === "true";

export function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(!ALWAYS_SHOW);

  useEffect(() => {
    if (ALWAYS_SHOW) return;
    const host = window.location.hostname;
    setIsLocalhost(host === "localhost" || host === "127.0.0.1");
  }, []);

  if (dismissed || isLocalhost) {
    return null;
  }

  return (
    <div className="w-full mt-14 bg-yellow-50 dark:bg-yellow-950/40 border-b border-yellow-300 dark:border-yellow-700 px-4 py-2.5 text-sm text-yellow-800 dark:text-yellow-200">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <p>
            This tool has not been audited and is provided as a proof of concept.
            Use at your own risk per our{" "}
            <a
              href="https://www.openzeppelin.com/tos"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium hover:text-yellow-900 dark:hover:text-yellow-100"
            >
              Terms of Service
            </a>
            . Where possible, you should{" "}
            <a
              href="https://github.com/openzeppelin/safe-utils"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium hover:text-yellow-900 dark:hover:text-yellow-100"
            >
              run this tool locally
            </a>
            .
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 p-0.5 rounded hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
          aria-label="Dismiss disclaimer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
