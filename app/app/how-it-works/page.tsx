import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  AlertTriangle, ExternalLink, Laptop, LockIcon, Terminal, Info, BookOpen, 
  CheckCircle2, Network, Shield, History 
} from "lucide-react";

export default function HowItWorks() {
  return (
    <main className="container mx-auto py-12 px-4 sm:px-6">
      <h1 className="text-4xl font-bold mb-6 text-center dark:text-title-dark text-title-light">
        How It Works
      </h1>
      <Card className="mb-8 dark:bg-card-dark bg-card-light">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Purpose and Origin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Safe Hash Preview was created as a quick response to the{" "}
            <a
              href="https://rekt.news/wazirx-rekt/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center"
            >
              WazirX
              <ExternalLink className="h-3 w-3 ml-0.5" />
            </a>,{" "}
            <a
              href="https://medium.com/@RadiantCapital/radiant-post-mortem-fecd6cd38081"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center"
            >
              Radiant
              <ExternalLink className="h-3 w-3 ml-0.5" />
            </a>{" "}
            and{" "}
            <a
              href="https://rekt.news/bybit-rekt/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center"
            > 
              Bybit
              <ExternalLink className="h-3 w-3 ml-0.5" />
            </a>{" "}
            exploits. The core{" "}
            <a
              href="https://github.com/pcaversaccio/safe-tx-hashes-util"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center"
            >
              script
              <ExternalLink className="h-3 w-3 ml-0.5" />
            </a>{" "}
            was developed by{" "}
            <a
              href="https://github.com/pcaversaccio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center"
            >
              pcaversaccio
              <ExternalLink className="h-3 w-3 ml-0.5" />
            </a>
            , and we added a user-friendly interface to make it more accessible.
          </p>
          <p className="mt-4">
            This tool helps users verify Safe transaction hashes before signing
            them. It calculates the domain, message, and
            Safe transaction hashes by retrieving transaction details from either manual input or the
            Safe transaction service API and computing the hashes using the
            EIP-712 standard.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8 dark:bg-card-dark bg-card-light">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            How to Use
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-3 ml-1">
            <li className="pl-2">Choose the calculation method, defaults to Manual Input. Alternative you can use Safe&apos;s API which requires less input.</li>
            <li className="pl-2">Select a network from the dropdown menu.</li>
            <li className="pl-2">Enter the Safe address.</li>
            <li className="pl-2">Fill the rest of the data according to your selected method.</li>
            <li className="pl-2">Click &quot;Calculate Hashes&quot; to view the results.</li>
            <li className="pl-2">
              Compare the displayed hashes with those shown on your signing device.
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card className="mb-8 dark:bg-card-dark bg-card-light">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            How Hashes are Calculated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            The hashes are calculated using these steps:
          </p>
          <ol className="list-decimal list-inside space-y-3 mt-4 ml-1">
            <li className="pl-2">
              Collect transaction details either from input or Safe&apos;s API.
            </li>
            <li className="pl-2">
              Calculate the domain hash using the chain ID and Safe address.
            </li>
            <li className="pl-2">Calculate the message hash using the transaction details.</li>
            <li className="pl-2">
              Compute the Safe transaction hash using the domain and message
              hashes.
            </li>
          </ol>
          <p className="mt-4">
            The script uses the EIP-712 standard and the same type hashes as the
            Safe contracts to ensure accuracy.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8 dark:bg-card-dark bg-card-light">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            What to Look For
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-3 ml-1">
            <li className="pl-2">
              Ensure that hashes match the ones displayed on your signing device.
            </li>
            <li className="pl-2">
              If you see more than one transaction with the same nonce, ensure it is exclusively because you&apos;re trying to replace a transaction. If this is not the case, something unintended is happening.
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card className="mb-8 dark:bg-card-dark bg-card-light border-amber-400/30">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Tips for Enhanced Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="border rounded-lg p-4 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Run Locally</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  For maximum security, clone the repository and{" "}
                  <a 
                    href="https://github.com/openzeppelin/safe-utils?tab=readme-ov-file#run-locally"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    run this tool locally 
                    <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a>{" "}
                  disconnected from the internet.
                </p>
              </div>
              
              <div className="border rounded-lg p-4 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Laptop className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Multi-Device Verification</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cross-check results using different devices and browsers to ensure consistency and reduce risk of compromised environments.
                </p>
              </div>
              
              <div className="border rounded-lg p-4 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <LockIcon className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Self-Host</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  For frequent use, consider self-hosting this tool on your own infrastructure to minimize dependencies on third-party services.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-card-dark bg-card-light">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Supported Networks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            The app supports multiple networks, including Ethereum, Polygon,
            Arbitrum, and more. For a full list of supported networks, please
            refer to the network selection dropdown on the main page.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}