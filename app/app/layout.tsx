import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Footer } from '@/components/footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Header } from '@/components/header'
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Safe Utils | OpenZeppelin',
  description: 'Preview and calculate Safe transaction hashes for Ethereum and other EVM chains. Verify transaction signatures and domain hashes.',
  keywords: 'Safe, Gnosis Safe, transaction hash, Ethereum, multisig, blockchain, smart contract, EVM',
  authors: [{ name: 'OpenZeppelin' }],
  openGraph: {
    title: 'Safe Utils | OpenZeppelin',
    description: 'Preview and calculate Safe transaction hashes for Ethereum and other EVM chains',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Safe Utils | OpenZeppelin',
    description: 'Preview and calculate Safe transaction hashes for Ethereum and other EVM chains',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <div className="min-h-screen bg-gradient-main dark:bg-gradient-main-dark">
              <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            </div>
          </TooltipProvider>
          <GoogleAnalytics gaId="G-SY66CZ3XZT" />
        </ThemeProvider>
      </body>
    </html>
  )
}

