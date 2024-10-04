'use client';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, TransactionInstruction, SystemProgram, Keypair } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import { Buffer } from 'buffer'; // Needed to handle buffer in the browser

export default function UpdateOracleValue() {
    const { connection } = useConnection();
    const { publicKey, sendTransaction, connected, connect } = useWallet();
    const [newOracleValue, setNewOracleValue] = useState<number>(0);
    const [verifier, setVerifier] = useState<string>('');
    const [verifiers, setVerifiers] = useState<string[]>([]);
    const [requiredVerifications, setRequiredVerifications] = useState<number>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>(''); // Error message state

    // Replace with your program and oracle account public keys
    //HUM54NUqyqwnnRRdX73ArAWdioJckYhmxUuwTpx6uTS3
    const programId = new PublicKey('7CUpZy9uZfm4EFYxafWCthA9qCaaLVZscW4feJuZ46Q2');
    const oracleGeneratedPair = new PublicKey("HUM54NUqyqwnnRRdX73ArAWdioJckYhmxUuwTpx6uTS3");
    const oracleAccountKeypair = Keypair.generate(); // Generate new keypair for Oracle account
    const oracleAccountPublicKey = oracleAccountKeypair.publicKey;

    const oracleAccountSpace = 1000; // Adjust size as needed for Oracle data

    useEffect(()=>{
        readOracleAccount();
    },[])

    const readOracleAccount = async () => {
        try {
            const accountInfo = await connection.getAccountInfo(oracleGeneratedPair);
            if (accountInfo) {
                const oracleData = accountInfo.data; // Replace this with your deserialization logic
                console.log('Oracle Account Data:', oracleData);
            } else {
                console.log('No Oracle account data found.');
            }
        } catch (error) {
            console.error('Error reading Oracle account:', error);
        }
    };
    
    // Function to add verifier public keys
    const addVerifier = () => {
        try {
            const verifierPubKey = new PublicKey(verifier); // Try to create a PublicKey
            setVerifiers([...verifiers, verifierPubKey.toBase58()]); // Add to verifiers list
            setVerifier(''); // Clear the input field
            setErrorMessage(''); // Clear error message if successful
        } catch (error) {
            setErrorMessage('Invalid Public Key input'); // Show error if invalid
        }
    };

    const initializeOracle = async () => {
        if (!connected) {
            await connect(); // Ensure wallet is connected
        }

        if (!publicKey) {
            alert('Please connect your wallet!');
            return;
        }

        setIsLoading(true);

        try {
            // Ensure Oracle account exists or create it
            const accountInfo = await connection.getAccountInfo(oracleAccountPublicKey);
            if (!accountInfo) {
                console.log('Creating Oracle account...');

                // Get rent-exempt balance for the account
                const lamports = await connection.getMinimumBalanceForRentExemption(oracleAccountSpace);

                // Create Oracle account
                const createOracleAccountIx = SystemProgram.createAccount({
                    fromPubkey: publicKey, // User's public key
                    newAccountPubkey: oracleAccountPublicKey, // Oracle account public key
                    lamports, // Rent-exempt balance
                    space: oracleAccountSpace, // Size of the account data
                    programId, // Your program's ID
                });

                const createAccountTransaction = new Transaction().add(createOracleAccountIx);
                const signature = await sendTransaction(createAccountTransaction, connection, {
                    signers: [oracleAccountKeypair], // Add Oracle account keypair as a signer
                });
                await connection.confirmTransaction(signature, 'confirmed');
                console.log('Oracle account created:', signature);
            } else if (accountInfo.owner.toBase58() !== programId.toBase58()) {
                console.error('Oracle account is not owned by the correct program');
                return;
            }

            // Convert verifier public keys from strings to PublicKey objects
            const verifierPubKeys = verifiers.map((verifier) => new PublicKey(verifier));

            // Build the data buffer manually without Borsh
            const initialOracleValueBuffer = Buffer.alloc(8); // u64 is 8 bytes
            initialOracleValueBuffer.writeBigUInt64LE(BigInt(newOracleValue));

            // Encode required verifications as a single byte
            const requiredVerificationsBuffer = Buffer.from([requiredVerifications]);

            // Serialize verifiers as a buffer of concatenated public key bytes
            const verifierBuffer = Buffer.concat(verifierPubKeys.map((key) => key.toBuffer()));

            // Concatenate all data into a single buffer
            const dataBuffer = Buffer.concat([initialOracleValueBuffer, verifierBuffer, requiredVerificationsBuffer]);

            // Create transaction instruction for Oracle initialization
            const instruction = new TransactionInstruction({
                keys: [
                    { pubkey: oracleAccountPublicKey, isSigner: false, isWritable: true }, // Oracle account
                    { pubkey: publicKey, isSigner: true, isWritable: false }, // User's public key
                ],
                programId,
                data: dataBuffer, // Manually constructed data buffer for Oracle initialization
            });

            // Create a transaction and add the instruction
            const transaction = new Transaction().add(instruction);

            // Send and sign the transaction with the wallet
            const signature = await sendTransaction(transaction, connection);
            console.log('Transaction signature:', signature);

            // Confirm the transaction
            const confirmation = await connection.confirmTransaction(signature, 'confirmed');
            console.log('Transaction confirmation:', confirmation);

            // Fetch transaction details
            const transactionDetails = await connection.getTransaction(signature, { commitment: 'confirmed' });
            console.log('Transaction details:', transactionDetails);

            // Log program logs if they exist
            if (transactionDetails && transactionDetails.meta && transactionDetails.meta.logMessages) {
                console.log('Program logs:', transactionDetails.meta.logMessages);
            } else {
                console.log('No logs available.');
            }
        } catch (error) {
            console.error('Error initializing Oracle:', error);
            setErrorMessage('Error initializing Oracle: ' + error.message); // Set error message
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Solana Oracle Client</h1>

            <div>
                <h3>Initialize Oracle</h3>
                <input
                    type="number"
                    value={newOracleValue}
                    onChange={(e) => setNewOracleValue(Number(e.target.value))}
                    placeholder="Initial Oracle Value"
                />
                <div>
                    <input
                        type="text"
                        value={verifier}
                        onChange={(e) => setVerifier(e.target.value)}
                        placeholder="Verifier Public Key"
                    />
                    <Button onClick={addVerifier}>Add Verifier</Button>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                </div>
                <div>
                    <h4>Verifiers</h4>
                    <ul>
                        {verifiers.map((v, idx) => (
                            <li key={idx}>{v}</li>
                        ))}
                    </ul>
                </div>
                <input
                    type="number"
                    value={requiredVerifications}
                    onChange={(e) => setRequiredVerifications(Number(e.target.value))}
                    placeholder="Required Verifications"
                />
                <Button onClick={initializeOracle} disabled={isLoading}>
                    {isLoading ? 'Initializing...' : 'Initialize Oracle'}
                </Button>
            </div>
        </div>
    );
}
