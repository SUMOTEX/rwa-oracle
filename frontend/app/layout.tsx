'use client'
import "@/styles/globals.css";
import clsx from "clsx";
import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import Sidebar from "../components/SideBar" // Import Sidebar Component
import { WalletProvider as EthereumWalletProvider } from "@/config/lib/use-connect";
import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css"; // Ensure this is present
import AppWalletProvider from "../components/AppWalletProvider";

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
        <ConnectionProvider endpoint={endpoint}>
          <AppWalletProvider>
            <WalletModalProvider>
              <Providers
                themeProps={{ attribute: "class", defaultTheme: "dark" }}
              >
                <div className="flex h-screen">
                  {/* Sidebar Component */}
                  <Sidebar />

                  {/* Main Content */}
                  <div className="flex-1 flex flex-col">
                    {/* Navbar */}
                    <Navbar />

                    {/* Main Page Content */}
                    <main className="flex-1 w-full px-6">{children}</main>

                    {/* Footer */}
                    <footer className="w-full flex items-center justify-center py-4">
                      {/* Add footer content if needed */}
                    </footer>
                  </div>
                </div>
              </Providers>
            </WalletModalProvider>
          </AppWalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  );
}
