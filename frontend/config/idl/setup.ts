import { clusterApiUrl, Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { Program, AnchorProvider, IdlAccounts, BN, web3 } from "@coral-xyz/anchor";
import idl from "./oracle.json"; // IDL JSON File
import type { Oracle } from "./idlType"; // Import Oracle type for specific parts if needed
import { WalletAdapter } from "@solana/wallet-adapter-react"; // Import wallet adapter

// Initialize Solana connection
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Setup the Anchor provider (assuming a wallet is available)
export const provider = new AnchorProvider(
  connection,
  window.solana, // Assuming you're using Phantom or Solana wallet extension
  { preflightCommitment: "processed" }
);

// Define your program ID
export const programId = new PublicKey('BsUhCxyyyGVc9ajGKKCH4kdHXGNUqqUEZjYKxk9Fo8rN'); // Replace with your programId
export const program = new Program(idl as Idl, provider);

// Create PDA for the oracle
export const [oraclePDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("oracle")],
  programId // Use the programId correctly here
);


// Example type for Oracle account data
export type OracleData = IdlAccounts<Oracle>["oracle"];

// Function to initialize the Oracle account
export const initializeOracle = async (initialValue: number, requiredVerifications: number, verifiers: PublicKey[]) => {
  try {
    const lamports = await connection.getMinimumBalanceForRentExemption(OracleData.size); // Get rent exemption for Oracle account size

    // Create transaction to initialize Oracle account
    const tx = new Transaction().add(
      await program.methods.initializeOracle(new BN(initialValue), requiredVerifications)
        .accounts({
          oracle: oraclePDA,
          payer: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId, // Fixed system program assignment
        })
        .instruction()
    );

    const signature = await provider.sendAndConfirm(tx, []);
    console.log(`Oracle initialized with signature: ${signature}`);
  } catch (error) {
    console.error('Error initializing oracle:', error);
  }
};

// Function to update the Oracle account
export const updateOracleValue = async (newAssetValue: number) => {
  try {
    const tx = new Transaction().add(
      await program.methods.updateOracle(new BN(newAssetValue))
        .accounts({
          oracle: oraclePDA,
          payer: provider.wallet.publicKey,
        })
        .instruction()
    );

    const signature = await provider.sendAndConfirm(tx, []);
    console.log(`Oracle value updated with signature: ${signature}`);
  } catch (error) {
    console.error('Error updating oracle:', error);
  }
};

// Function to read Oracle account data
export const readOracleAccount = async () => {
  try {
    const oracleAccount = await program.account.oracle.fetch(oraclePDA);
    console.log('Oracle Account Data:', oracleAccount);
    return oracleAccount;
  } catch (error) {
    console.error('Error reading Oracle account:', error);
  }
};

// Function to fetch transaction history for Oracle
export const getTransactionHistory = async () => {
  try {
    const signatures = await connection.getSignaturesForAddress(oraclePDA);
    const transactions = await Promise.all(
      signatures.map(async (signatureInfo) => {
        return await connection.getTransaction(signatureInfo.signature, { commitment: 'confirmed' });
      })
    );
    console.log('Transaction history:', transactions);
    return transactions;
  } catch (error) {
    console.error('Error fetching transaction history:', error);
  }
};
