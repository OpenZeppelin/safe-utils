"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FileText, Home, Menu, MessageSquare, X } from "lucide-react";
import dynamic from 'next/dynamic';
import { usePathname } from "next/navigation";

// Import the logo with no SSR
const OZLogo = dynamic(() => import('@/components/ui/oz-logo').then(mod => mod.OZLogo), {
  ssr: false
});

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHowItWorksPage = pathname === "/how-it-works";

  return (
    <header className="w-full border-b border-border/40 bg-background sticky top-0 z-50">
      <div className="header__wrapper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link 
                href="https://openzeppelin.com" 
                className="flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                <OZLogo />
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild className="text-sm font-medium">
                {isHowItWorksPage ? (
                  <Link href="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                ) : (
                  <Link href="/how-it-works" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Docs</span>
                  </Link>
                )}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a
                  href="https://github.com/openzeppelin/safe-utils"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                 <Image 
                    src="/github.svg" 
                    alt="GitHub" 
                    width={20} 
                    height={20} 
                    className="dark:invert"
                  />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a
                  href="https://x.com/OpenZeppelin"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                >
                <Image 
                  src="/x-logo.svg" 
                  alt="X" 
                  width={20} 
                  height={20} 
                  className="dark:invert"
                />
                </a>
              </Button>
              <ModeToggle />
            </nav>
            
            {/* Mobile Navigation Button */}
            <div className="flex md:hidden items-center">
              <ModeToggle />
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-foreground"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 py-3 space-y-4">
            {/* Navigation icons in a row */}
            <div className="flex justify-center items-center gap-8 py-2">
              {/* Docs/Home */}
              {isHowItWorksPage ? (
                <Link 
                  href="/"
                  className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Home"
                >
                  <Home className="h-6 w-6" />
                </Link>
              ) : (
                <Link 
                  href="/how-it-works"
                  className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Docs"
                >
                  <FileText className="h-6 w-6" />
                </Link>
              )}
              
              {/* GitHub */}
              <a
                href="https://github.com/openzeppelin/safe-utils"
                className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                aria-label="GitHub"
              >
                <Image 
                  src="/github.svg" 
                  alt="GitHub" 
                  width={24} 
                  height={24} 
                  className="dark:invert" 
                />
              </a>
              
              {/* X */}
              <a
                href="https://x.com/OpenZeppelin"
                className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                aria-label="X"
              >
                <Image 
                  src="/x-logo.svg" 
                  alt="X" 
                  width={24} 
                  height={24} 
                  className="dark:invert" 
                />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}