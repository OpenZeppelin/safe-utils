import React from "react";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-4 w-full flex items-center justify-center">
      <div className="container flex items-center justify-center">
        <p className="text-center text-sm text-white flex items-center gap-2 flex-wrap justify-center">
          Developed with <Heart className="h-4 w-4" /> by{" "}
          <a
            href="https://www.openzeppelin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-white underline underline-offset-4 hover:text-white/80"
          >
            OpenZeppelin
          </a>
          / Subject to our{" "}
          <a
            href="https://www.openzeppelin.com/tos"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-white underline underline-offset-4 hover:text-white/80"
          >
            Terms of Service
          </a>
          / Script by{" "}
          <a
            href="https://github.com/pcaversaccio"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-white underline underline-offset-4 hover:text-white/80"
          >
            @pcaversaccio
          </a>
        </p>
      </div>
    </footer>
  );
}