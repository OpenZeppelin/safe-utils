"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Disclaimer({ 
  className, 
  children 
}: { 
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className={className}>
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            Disclaimer
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-sm text-foreground text-justify">
          This is a fork of a script by{" "}
          <a
            href="https://github.com/pcaversaccio/safe-tx-hashes-util"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            @pcaversaccio
          </a>{" "}
          that adds a user interface. It has not been subject to any security assessment. Any use of the tool is at your own risk in accordance with our{" "}
          <a
            href="https://www.openzeppelin.com/tos"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Terms of Service
          </a>
          .
          <br /><br />
          This tool is intended to be used as a proof of concept and feedback and contributions are welcome. While there are few dependencies, you should always do your own investigation and{" "}
          <a 
            href="https://github.com/openzeppelin/safe-utils"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            run the tool locally
          </a>{" "}
          or from different devices where possible.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}