'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, PublicKey, Keypair } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import { program, oraclePDA } from "../config/idl/setup"; // Import from setup.ts
import { web3, BN } from '@project-serum/anchor';

//normal ID: DssdfXkDof9u9fnt8L57EedCJC3jjysHjz6Ps6JYksqv
//with round ID: 29d8K1vPLf6U8gHStELSdVBUSwptmPDHpCm5xxhAbJbs
export default function UpdateOracleValue() {
    const { connection } = useConnection();
    const { wallet, publicKey, sendTransaction, connected, connect } = useWallet();
    const [newOracleValue, setNewOracleValue] = useState(0);
    const [verifier, setVerifier] = useState('');
    const [verifiers, setVerifiers] = useState([]);
    const [requiredVerifications, setRequiredVerifications] = useState(1);
    const [oracleData, setOracleData] = useState(null);
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Step 1: Use imported program and PDA from setup.ts
    const [oracleGeneratedPair, setOracleGeneratedPair] = useState<Keypair | null>(null);

    useEffect(() => {
        // Generate keypair only once when the component loads
        setOracleGeneratedPair(Keypair.generate());
    }, []);

    useEffect(() => {
        if (program && oraclePDA) {
            readOracleAccount();
            readTransactionHistory();
        }
    }, [program, oraclePDA]);

    const readOracleAccount = async () => {
        try {
            const oracleAccount = await program.account.oracle.fetch(oraclePDA); // Fetch oracle account using PDA
            console.log('Oracle Account Data:', oracleAccount);
            setOracleData(oracleAccount); // Store fetched oracle data in state
        } catch (error) {
            if (error.message.includes('Account does not exist')) {
                console.error('Oracle account does not exist yet. Please initialize it first.');
                setErrorMessage('Oracle account does not exist yet. Please initialize it first.');
            } else {
                console.error('Error reading Oracle account:', error);
                setErrorMessage('Error reading Oracle account: ' + error.message);
            }
        }
    };


    const readTransactionHistory = async () => {
        try {
            // Fetch transaction signatures associated with the oracle PDA
            const signatures = await connection.getSignaturesForAddress(oraclePDA);

            // Fetch full transactions based on these signatures
            const transactions = await Promise.all(
                signatures.map(async (signatureInfo) => {
                    return await connection.getTransaction(signatureInfo.signature, { commitment: 'confirmed' });
                })
            );

            // Parse transactions to extract the values written
            const writtenValues = transactions.flatMap((tx) => {
                if (tx && tx.meta && tx.meta.logMessages) {
                    // Filter log messages to find entries where asset values are written
                    return tx.meta.logMessages
                        .filter((log) => log.includes("Oracle updated with new asset value:"))
                        .map((log) => {
                            // Extract the value from the log message
                            const valueMatch = log.match(/Oracle updated with new asset value: (\d+)/);
                            if (valueMatch) {
                                return {
                                    value: parseInt(valueMatch[1], 10),
                                    timestamp: new Date(tx.blockTime * 1000).toLocaleString(),
                                    signature: tx.transaction.signatures[0],
                                    status: tx.meta.err ? 'Failed' : 'Confirmed',
                                };
                            }
                            return null;
                        })
                        .filter((entry) => entry !== null); // Filter out any null entries
                }
                return [];
            });

            setTransactionHistory(writtenValues);
        } catch (error) {
            console.error('Error reading transaction history:', error);
        }
    };


    const addVerifier = () => {
        try {
            const verifierPubKey = new PublicKey(verifier);
            setVerifiers((prevVerifiers) => [...prevVerifiers, verifierPubKey.toBase58()]);
            setVerifier('');
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Invalid Public Key input');
        }
    };
    const initializeOracle = async () => {
        if (!connected) await connect();
        if (!publicKey) {
            alert('Please connect your wallet!');
            return;
        }

        setIsLoading(true);

        try {
            const accountInfo = await connection.getAccountInfo(oraclePDA);
            const payerBalance = await connection.getBalance(publicKey);

            if (accountInfo) {
                alert('Oracle account already initialized.');
                return;
            }

            const numVerifiers = verifiers.length;
            const lamports = await connection.getMinimumBalanceForRentExemption(8 + (32 * numVerifiers) + 1 + numVerifiers);

            if (payerBalance < lamports) {
                alert('Insufficient balance to create the Oracle account.');
                return;
            }
            console.log('PDA:', oraclePDA)
            const initializeOracleIx = await program.methods.initializeOracle(
                new BN(newOracleValue),
                requiredVerifications,
                numVerifiers
            ).accounts({
                oracle: oraclePDA,
                payer: publicKey,
                systemProgram: web3.SystemProgram.programId,
            }).instruction();

            const transaction = new Transaction().add(initializeOracleIx);
            transaction.feePayer = publicKey;

            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;

            const signature = await sendTransaction(transaction, connection);
            const confirmation = await connection.confirmTransaction(signature, 'confirmed');

            if (confirmation?.value?.err) {
                alert(`Transaction failed: ${confirmation.value.err}`);
            } else {
                console.log('Oracle initialized successfully!');
                alert('Oracle initialized successfully!');
                await readOracleAccount();
            }
        } catch (error) {
            console.error('Error initializing Oracle:', error);
            setErrorMessage('Error initializing Oracle: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };


    const updateOracleValue = async () => {
        if (!connected) await connect();
        if (!publicKey) {
            alert('Please connect your wallet!');
            return;
        }

        setIsLoading(true);

        try {
            // Check if Oracle Account exists
            const accountInfo = await connection.getAccountInfo(oraclePDA);
            if (!accountInfo) {
                alert('Oracle account does not exist yet. Please initialize it first.');
                return;
            }

            // Construct the instruction to update the Oracle's value
            const updateOracleIx = await program.methods.updateOracle(
                new BN(newOracleValue)
            ).accounts({
                oracle: oraclePDA,
                payer: publicKey,
                systemProgram: web3.SystemProgram.programId, // Ensure system program is properly passed
            }).instruction();

            // Create a new transaction with the update instruction
            const transaction = new Transaction().add(updateOracleIx);
            transaction.feePayer = publicKey;

            // Fetch the latest blockhash
            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;

            // Send the transaction to the network
            const signature = await sendTransaction(transaction, connection);

            // Confirm the transaction
            const confirmation = await connection.confirmTransaction(signature, 'confirmed');

            if (confirmation?.value?.err) {
                alert(`Transaction failed: ${confirmation.value.err}`);
            } else {
                alert('Oracle value updated successfully!');
                console.log('Oracle value updated successfully!');
                // Update the state by fetching the latest Oracle account data
                await readOracleAccount();
                await readTransactionHistory();
            }

        } catch (error) {
            console.error('Error updating Oracle value:', error);
            setErrorMessage('Error updating Oracle value: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
            <h1>Solana Oracle Client</h1>
            <h3>Oracle ID (PDA): {oraclePDA.toBase58()}</h3> {/* Display the Oracle ID */}

            {!oracleData ? (
                <div>
                    <h2>Initialize Oracle</h2>
                    <input type="number" onChange={(e) => setNewOracleValue(Number(e.target.value))} placeholder="Initial Oracle Value" />
                    <input type="text" onChange={(e) => setVerifier(e.target.value)} placeholder="Verifier Public Key" />
                    <Button onClick={addVerifier}>Add Verifier</Button>
                    {errorMessage && <p>{errorMessage}</p>}
                    <h3>Verifiers</h3>
                    <ul>
                        {verifiers.map((v, idx) => (
                            <li key={idx}>{v}</li>
                        ))}
                    </ul>
                    <input type="number" onChange={(e) => setRequiredVerifications(Number(e.target.value))} placeholder="Required Verifications" />
                    <Button onClick={initializeOracle}>{isLoading ? 'Initializing...' : 'Initialize Oracle'}</Button>
                </div>
            ) : (
                <div>
                    <h2>Oracle Details</h2>
                    <p>Asset Value: {oracleData.assetValue.toString()}</p> {/* Display Oracle's asset value */}
                    <p>Required Verifications: {oracleData.requiredVerifications}</p> {/* Display required verifications */}
                    <h2>Update Oracle Value</h2>
                    <input type="number" onChange={(e) => setNewOracleValue(Number(e.target.value))} placeholder="New Oracle Value" />
                    <Button onClick={updateOracleValue}>{isLoading ? 'Updating...' : 'Update Oracle Value'}</Button>
                </div>
            )}
            {transactionHistory.length > 0 && (
                <div>
                    <h2>Oracle Written Values</h2>
                    {transactionHistory.length > 0 ? (
                        <ul>
                            {transactionHistory.map((entry, idx) => (
                                <li key={idx}>
                                    Value: {entry.value} | Timestamp: {entry.timestamp} |
                                 
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No values found.</p>
                    )}
                </div>
            )}
        </div>
    );
}