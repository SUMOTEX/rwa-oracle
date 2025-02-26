'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, PublicKey, Keypair } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import { program, oraclePDA } from "../../config/idl/setup"; // Import from setup.ts
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
        // Function to generate random value between 3 million and 4 million


        if (connected) {
            //automateUpdate();
        }

    }, [connected]);
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
    // useEffect(() => {
    //     // const interval = setInterval(() => {
    //     //     autoUpdateOracleValue();
    //     // }, 7200000); // Update every 60 seconds
    //     const interval = setInterval(() => {
    //         autoUpdateOracleValue();
    //     }, 200000); // Update every 60 seconds

    //     return () => clearInterval(interval); // Cleanup on component unmount
    // }, [connected, publicKey]);

    const readOracleAccount = async () => {
        try {
            //@ts-ignore
            const oracleAccount = await program.account.oracle.fetch(oraclePDA); // Fetch oracle account using PDA
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
                alert('Oracle initialized successfully!');
                await readOracleAccount();
            }
        } catch (error) {

            setErrorMessage('Error initializing Oracle: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };
    const updateOracleValue = async (newValue) => {

        if (!connected) await connect();
        if (!publicKey) {
            alert('Please connect your wallet!');
            return;
        }

        try {
            const accountInfo = await connection.getAccountInfo(oraclePDA);
            if (!accountInfo) {
                alert('Oracle account does not exist yet. Please initialize it first.');
                return;
            }

            const updateOracleIx = await program.methods.updateOracle(
                new BN(newValue)
            ).accounts({
                oracle: oraclePDA,
                payer: publicKey,
                systemProgram: web3.SystemProgram.programId,
            }).instruction();

            const transaction = new Transaction().add(updateOracleIx);
            transaction.feePayer = publicKey;

            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;

            const signature = await sendTransaction(transaction, connection);
            const confirmation = await connection.confirmTransaction(signature, 'confirmed');

            if (confirmation?.value?.err) {
                console.error('Transaction failed:', confirmation.value.err);
            } else {
                console.log('Oracle value updated successfully!');
                await readOracleAccount();
                await readTransactionHistory();
            }
        } catch (error) {
            console.error('Error updating Oracle value:', error);
            setErrorMessage('Error updating Oracle value: ' + error.message);
        }
    };

    const autoUpdateOracleValue = async () => {
        if (!connected) await connect();
        if (!publicKey) {
            alert('Please connect your wallet!');
            return;
        }

        setIsLoading(true);

        try {
            const accountInfo = await connection.getAccountInfo(oraclePDA);
            if (!accountInfo) {
                alert('Oracle account does not exist yet. Please initialize it first.');
                return;
            }

            // Generate a random value between 3 million and 4 million
            const randomValue = Math.floor(Math.random() * (4000000 - 3000000 + 1)) + 3000000;

            // Construct the transaction
            const updateOracleIx = await program.methods.updateOracle(new BN(randomValue)).accounts({
                oracle: oraclePDA,
                payer: publicKey,
                systemProgram: web3.SystemProgram.programId,
            }).instruction();

            const transaction = new Transaction().add(updateOracleIx);
            transaction.feePayer = publicKey;

            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;

            // Send the transaction
            const signature = await sendTransaction(transaction, connection);
            console.log("Transaction Signature:", signature);

            // Confirm the transaction
            const confirmation = await connection.confirmTransaction(signature, 'confirmed');
            if (confirmation?.value?.err) {
                alert(`Transaction failed: ${confirmation.value.err}`);
            } else {
                alert('Oracle value updated successfully!');
                await readOracleAccount(); // Refresh Oracle data
            }

        } catch (error) {
            console.error('Error updating Oracle value:', error);
        } finally {
            setIsLoading(false);
        }
    };
    // const updateOracleValue = async () => {
    //     if (!connected) await connect();
    //     if (!publicKey) {
    //         alert('Please connect your wallet!');
    //         return;
    //     }

    //     setIsLoading(true);

    //     try {
    //         // Check if Oracle Account exists
    //         const accountInfo = await connection.getAccountInfo(oraclePDA);
    //         if (!accountInfo) {
    //             alert('Oracle account does not exist yet. Please initialize it first.');
    //             return;
    //         }

    //         // Construct the instruction to update the Oracle's value
    //         const updateOracleIx = await program.methods.updateOracle(
    //             new BN(newOracleValue)
    //         ).accounts({
    //             oracle: oraclePDA,
    //             payer: publicKey,
    //             systemProgram: web3.SystemProgram.programId, // Ensure system program is properly passed
    //         }).instruction();

    //         // Create a new transaction with the update instruction
    //         const transaction = new Transaction().add(updateOracleIx);
    //         transaction.feePayer = publicKey;

    //         // Fetch the latest blockhash
    //         const { blockhash } = await connection.getLatestBlockhash();
    //         transaction.recentBlockhash = blockhash;

    //         // Send the transaction to the network
    //         const signature = await sendTransaction(transaction, connection);

    //         // Confirm the transaction
    //         const confirmation = await connection.confirmTransaction(signature, 'confirmed');

    //         if (confirmation?.value?.err) {
    //             alert(`Transaction failed: ${confirmation.value.err}`);
    //         } else {
    //             // Update the state by fetching the latest Oracle account data
    //             await readOracleAccount();
    //             await readTransactionHistory();
    //         }

    //     } catch (error) {
    //         console.error('Error updating Oracle value:', error);
    //         setErrorMessage('Error updating Oracle value: ' + error.message);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };


    return (
        <div>
            <h3>Oracle ID: {oraclePDA.toBase58()}</h3> {/* Display the Oracle ID */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />

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
                    <h2>Asset Details</h2>
                    <p>Asset Name: No 8, Jalan Setia Murni </p>
                    <p> Asset Latest Value: {new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(oracleData.assetValue)}</p> {/* Display Oracle's asset value */}

                    {/* <input type="number" onChange={(e) => setNewOracleValue(Number(e.target.value))} placeholder="New Oracle Value" />
                    <Button onClick={updateOracleValue}>{isLoading ? 'Updating...' : 'Update Oracle Value'}</Button> */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '20px 0' }}>
                        {/* First Icon */}
                        <div style={{ position: 'relative' }}>
                            <img src="./gov.png" height={60} width={60} />

                        </div>

                        {/* Connecting Green Line */}
                        <div style={{
                            position: 'relative',
                            flexGrow: 1, // Make the line grow to fill space between icons
                            height: '2px', // Thin line
                            backgroundColor: '#B0BEC5', // Base grey color
                            margin: '0 10px', // Space around the line
                            overflow: 'hidden', // Hide the animated part overflow
                        }}>
                            <div style={{
                                height: '100%',
                                width: '100%', // Full width for animation
                                backgroundColor: '#4caf50', // Green color for the moving part
                                animation: 'dataFlow 2s infinite linear',
                            }}></div>
                        </div>

                        {/* Second Icon */}
                        <div style={{ position: 'relative' }}>
                            <img src="./sumotex.png" height={50} width={50} />
                        </div>

                        {/* Connecting Green Line */}
                        <div style={{
                            position: 'relative',
                            flexGrow: 1, // Make the line grow to fill space between icons
                            height: '2px', // Thin line
                            backgroundColor: '#B0BEC5', // Base grey color
                            margin: '0 10px', // Space around the line
                            overflow: 'hidden', // Hide the animated part overflow
                        }}>
                            <div style={{
                                height: '100%',
                                width: '100%', // Full width for animation
                                backgroundColor: '#4caf50', // Green color for the moving part
                                animation: 'dataFlow 2s infinite linear',
                            }}></div>
                        </div>

                        {/* Third Icon */}
                        <div style={{ position: 'relative' }}>
                            <img src="./solana.png" height={60} width={60} />
                        </div>
                    </div>
                </div>
            )}
            <br />
            {transactionHistory.length > 0 && (
                <div>
                    <h2>Oracle Written Values</h2>
                    {transactionHistory.map((entry, idx) => (
                        <div key={idx} style={{ position: 'relative', marginBottom: '40px' }}>
                            {/* Base grey line */}
                            {idx < transactionHistory.length - 1 && (
                                <div style={{
                                    position: 'absolute',
                                    left: '2%',
                                    top: '30px', // Start below the dot
                                    transform: 'translateX(-50%)', // Center the line horizontally
                                    height: '90px', // Adjust height to fit between dots
                                    width: '2px',
                                    backgroundColor: 'darkgrey', // Grey base color
                                    zIndex: '-2'
                                }}></div>
                            )}

                            {/* Moving green line */}
                            {idx === 0 && transactionHistory.length > 1 && (
                                <div style={{
                                    position: 'absolute',
                                    left: '2%',
                                    top: '30px', // Start below the dot
                                    transform: 'translateX(-50%)', // Center the line horizontally
                                    height: '90px', // Make the height the same as the base grey line
                                    width: '2px',
                                    backgroundColor: 'darkgrey', // Green color for moving part
                                    zIndex: '-1',
                                    //animation: 'greenMove 1s infinite linear',
                                }}></div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: idx === 0 ? '#4caf50' : '#FFEB3B', // Green for the latest, yellow for the rest
                                    border: '2px solid #000',
                                    marginRight: '10px',
                                    animation: 'fadeIn 0.5s ease-in-out',
                                    position: 'relative', // Make dot positioning relative
                                    zIndex: '1'
                                }}></div>
                                <div>
                                    <h1 style={{ marginBottom: '4px' }}>Asset Value: {new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(entry.value)}</h1>
                                    <h2 style={{ color: '#888' }}>Date: {entry.timestamp}</h2>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            )}
            <style jsx>{`
    @keyframes greenMoveHorizontal {
        0% {
            transform: translateX(0);
            width: 0;
        }
        100% {
            transform: translateX(0);
            width: 50px; /* Expand the width to create the effect of moving left to right */
        }
    }
    @keyframes dataFlow {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
`}</style>
        </div>

    );
}