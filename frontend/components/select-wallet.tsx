'use client'
import React, { useContext, useEffect } from 'react';
import { WalletContext } from '@/config/lib/use-connect';
import { Button } from '@nextui-org/button';

export default function SelectWallet() {
  const { address, balance, connectToWallet, loading, disconnectWallet, error } = useContext(WalletContext);
  useEffect(() => {
    console.log(address)
  }, [address, loading])
  return (
    <div>
      {/* {loading && <p>Connecting...</p>} */}
      {error && <p>{error}</p>}
      {address ? (
        <>
          <p>Connected Address: {address}</p>
          <p>Balance: {balance} ETH</p>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
        </>
      ) : (
        <button className="bg-white p-2 bordered rounded"
          onClick={connectToWallet}>Connect Wallet</button>
      )}
    </div>
  );
}
