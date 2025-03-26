import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Footer } from '@/components/footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import { GoogleAnalytics } from '@next/third-parties/google'
import Navbar from '@/components/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://safeutils.openzeppelin.com'),
  title: 'Safe Utils | OpenZeppelin',
  description: 'Preview and calculate Safe transaction hashes for Ethereum and other EVM chains. Verify transaction signatures and domain hashes.',
  keywords: 'Safe, Gnosis Safe, transaction hash, Ethereum, multisig, blockchain, smart contract, EVM',
  authors: [{ name: 'OpenZeppelin' }],
  openGraph: {
    title: 'Safe Utils | OpenZeppelin',
    description: 'Preview and calculate Safe transaction hashes for Ethereum and other EVM chains',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'OpenZeppelin Safe Utils',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Safe Utils | OpenZeppelin',
    description: 'Preview and calculate Safe transaction hashes for Ethereum and other EVM chains',
    images: ['/thumbnail.png'],
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
            <div className="min-h-screen flex flex-col bg-gradient-main dark:bg-gradient-main-dark">
              <div className="flex flex-col flex-grow">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-start pt-5 mt-5">
                  {children}
                </main>
              </div>
              <Footer />
            </div>
          </TooltipProvider>
          <GoogleAnalytics gaId="G-SY66CZ3XZT" />
        </ThemeProvider>
      </body>
    </html>
  )
}

