'use client'
import "@/styles/globals.css";
import clsx from "clsx";
import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { WalletProvider as EthereumWalletProvider } from "@/config/lib/use-connect"; // Ethereum wallet context
import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css"; // Ensure this is present

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Solana network setup
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const solanaWallets = useMemo(() => [new PhantomWalletAdapter()], [network]);


  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen font-sans antialiased",
          fontSans.variable
        )}
      >
        {/* Ethereum Wallet Context */}
        <EthereumWalletProvider>
          {/* Solana Wallet Context */}
          <ConnectionProvider endpoint={endpoint}>
            <SolanaWalletProvider wallets={solanaWallets} autoConnect>
              <WalletModalProvider>
                {/* Theme and UI Providers */}
                <Providers
                  themeProps={{ attribute: "class", defaultTheme: "dark" }}
                >
                  <div className="max-w-screen-xl mx-auto px-6">
                    {/* Navbar */}
                    <Navbar />
                    {/* Main Content */}
                    <main className="pt-4">{children}</main>
                    {/* Footer */}
                    <footer className="w-full flex items-center justify-center py-4"></footer>
                  </div>
                </Providers>
              </WalletModalProvider>
            </SolanaWalletProvider>
          </ConnectionProvider>
        </EthereumWalletProvider>
      </body>
    </html>
  );
}
