/* eslint-disable */
/* @ts-nocheck */
'use client'
import React, { useContext, useState, useEffect } from 'react';
import { WalletContext } from '@/config/lib/use-connect';
import { Transition } from '@/components/ui/transition';
import SelectWallet from './select-wallet';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { ethers } from 'ethers';
import "@solana/wallet-adapter-react-ui/styles.css"; // Ensure this is present

export default function WalletConnect() {
  const { address, connectToWallet, disconnectWallet, balance, setBalance, checkWalletConnection } = useContext(WalletContext); // Ethereum wallet context
  const { publicKey, connect, disconnect: disconnectSolana } = useSolanaWallet(); // Solana wallet context
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [isConnected, setIsConnected] = useState(false); // New state to track connection status

  // Solana RPC connection
  //const solanaConnection = new Connection('https://api.mainnet-beta.solana.com');
  const solanaConnection = new Connection('https://api.devnet-beta.solana.com');
  // Handle network change and ensure Ethereum wallet connection is checked
  const handleNetworkChange = async (e) => {
    setSelectedNetwork(e.target.value);
    if (e.target.value === 'solana') {
      disconnectWallet(); // Disconnect Ethereum
      if (!publicKey) {
        await connect(); // Connect to Solana if not connected
        setIsConnected(true); // Trigger a re-render
      }
    } else {
      disconnectSolana(); // Disconnect Solana
      const isEthereumConnected = await checkWalletConnection();
      if (!isEthereumConnected) {
        await connectToWallet(); // Connect Ethereum if not connected
      } else {
        await getEthereumBalance(); // Fetch the balance when switching back to Ethereum
      }
      setIsConnected(isEthereumConnected); // Trigger a re-render
    }
  };

  // Ensure UI re-renders when wallets are connected
  useEffect(() => {
    if (selectedNetwork === 'solana' && publicKey) {
      solanaConnection.getBalance(new PublicKey(publicKey)).then((solBalance) => {
        setBalance(solBalance / 1e9); // Convert lamports to SOL
        setIsConnected(true); // Trigger a re-render
      });
    }
  }, [publicKey, selectedNetwork]);

  // Re-render and fetch Ethereum balance when the Ethereum wallet connects
  useEffect(() => {
    const checkEthereumConnection = async () => {
      const isEthereumConnected = await checkWalletConnection();
      if (isEthereumConnected) {
        await getEthereumBalance(); // Fetch the Ethereum balance
      }
      setIsConnected(isEthereumConnected);
    };
    checkEthereumConnection();
  }, [address, selectedNetwork]);

  // Fetch Ethereum balance when switching back from Solana
  const getEthereumBalance = async () => {
    if (address) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const walletBalance = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(walletBalance);
      setBalance(balanceInEth); // Update Ethereum balance
    }
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(address.length - 6)}`;
  };

  return (
    <>
      <div className="flex items-center space-x-2 mb-4">
        <label
          htmlFor="network"
          className="text-sm font-medium text-gray-600 dark:text-gray-300"
        >
          Network:
        </label>
        <div className="relative inline-block">
          <select
            id="network"
            className="appearance-none w-28 border border-gray-300 text-gray-600 rounded-md py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
            value={selectedNetwork}
            onChange={handleNetworkChange}
          >
            {/* <option value="ethereum">Ethereum</option> */}
            <option value="solana">Solana</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 9l6 6 6-6"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Ethereum and Solana wallet handling */}
      {(selectedNetwork === 'ethereum' && address) || (selectedNetwork === 'solana' && publicKey) ? (
        <div className=" flex mt-2 items-center gap-0 rounded sm:gap-6 lg:gap-8">
          <div className="relative">
            {/* Display Ethereum Address and Balance */}
            {selectedNetwork === 'ethereum' && address ? (
              <div className="flex row">
                <span className="rounded-lg px-2 py-1 text-sm tracking-tighter">
                  {formatAddress(address)}
                  <div className="text-center text-sm tracking-tighter text-gray-900 dark:text-white xl:text-md 3xl:mb-8 3xl:text-[24px]">
                    {Number(balance).toFixed(4)} SOL
                  </div>
                </span>
                <div className="block h-4 w-4 overflow-hidden rounded-full border-3 border-solid border-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-main transition-all hover:-translate-y-0.5 hover:shadow-large dark:border-gray-700 sm:h-10 sm:w-10" />
              </div>
            ) : null}

            {/* Solana Wallet MultiButton */}
            {selectedNetwork === 'solana' && publicKey ? (
              <div>
                <WalletMultiButton />
              </div>
            ) : null}

            <Transition
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
              show={false}
            >
              <div className="absolute -right-20 mt-3 w-72 origin-top-right rounded-lg bg-white shadow-large dark:bg-gray-900 sm:-right-14">
                <div className="border-b border-dashed border-gray-200 p-3 dark:border-gray-700"></div>

                {/* Ethereum Wallet Info */}
                {selectedNetwork === 'ethereum' && address ? (
                  <div>
                    <div className="border-b border-dashed border-gray-200 px-6 py-5 dark:border-gray-700">
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-lg bg-gray-100 px-2 py-1 text-sm tracking-tighter dark:bg-gray-800">
                          {formatAddress(address)}
                        </span>
                      </div>
                      <div className="mt-3 text-sm uppercase tracking-wider text-gray-900 dark:text-white">
                        {balance} ETH
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Solana Wallet Info */}
                {selectedNetwork === 'solana' && publicKey ? (
                  <div>
                    <WalletMultiButton />
                  </div>
                ) : null}

                <div className="p-3">
                  <div
                    className="flex cursor-pointer items-center gap-3 rounded-lg py-2.5 px-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800"
                    onClick={() => {
                      selectedNetwork === 'solana' ? disconnectSolana() : disconnectWallet();
                    }}
                  >
                    <WalletDisconnectButton />
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      ) : (
        <div className="flex space-x-2 my-4">
          {/* Show wallet buttons */}
          {selectedNetwork === 'solana' ? <WalletMultiButton /> : <SelectWallet />}
        </div>
      )}
    </>
  );
}
