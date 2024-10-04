'use client'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { useState,useContext } from 'react';
import { Button } from '@nextui-org/react';
import { WalletContext } from '@/config/lib/use-connect';

export default function UpdateOracleValue() {
    const { connection } = useConnection(); // Solana connection
    const { address, connectToWallet, disconnectWallet, balance, setBalance, checkWalletConnection } = useContext(WalletContext); // Ethereum wallet context
    const { publicKey, sendTransaction, connected, connect } = useWallet(); // Solana wallet hooks
    const [newOracleValue, setNewOracleValue] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    // Replace with actual program ID and Oracle account
    const programId = new PublicKey('BN7fbdk94p9orPFMUiwTGN2k8szfE67hJbnbUhXWXNi1');
    const oracleAccountPublicKey = new PublicKey('BN7fbdk94p9orPFMUiwTGN2k8szfE67hJbnbUhXWXNi1');

    const updateOracle = async () => {
        if (!connected) {
            await connect(); // Ensure wallet is connected
        }

        if (!publicKey) {
            alert('Please connect your wallet!');
            return;
        }

        setIsLoading(true);

        try {
            // Create data buffer (adjust according to your Oracle program requirements)
            const dataBuffer = Buffer.from(new Uint8Array([0, ...new BigUint64Array([BigInt(newOracleValue)]).buffer]));

            // Create transaction instruction for Oracle update
            const instruction = new TransactionInstruction({
                keys: [
                    { pubkey: oracleAccountPublicKey, isSigner: false, isWritable: true }, // Oracle account
                    { pubkey: publicKey, isSigner: true, isWritable: false }, // User's public key
                ],
                programId,
                data: dataBuffer, // Custom data for Oracle update
            });

            // Create a transaction and add the instruction
            const transaction = new Transaction().add(instruction);

            // Send and sign the transaction with the wallet
            const signature = await sendTransaction(transaction, connection);
            console.log('Transaction signature:', signature);

            // Confirm the transaction
            await connection.confirmTransaction(signature, 'confirmed');
            console.log('Transaction confirmed');

        } catch (error) {
            console.error('Error updating Oracle value:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <input
                type="number"
                value={newOracleValue}
                onChange={(e) => setNewOracleValue(Number(e.target.value))}
                placeholder="New Oracle Value"
            />
            <Button onClick={updateOracle} disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Oracle Value'}
            </Button>
        </div>
    );
}