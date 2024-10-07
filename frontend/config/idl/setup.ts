import { clusterApiUrl, Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Program, AnchorProvider, IdlAccounts, BN, web3 } from "@coral-xyz/anchor";
import idl from "./oracle.json"; // IDL JSON File
import type { Oracle } from "./idlType"; // Import Oracle type for specific parts if needed


// Initialize Solana connection
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Setup the Anchor provider (assuming a wallet is available)
export const provider = new AnchorProvider(
  connection,
  window.solana, // Assuming you're using Phantom or Solana wallet extension
  { preflightCommitment: "processed" }
);

// Define your program ID
//NEW PROGRAM ID: 29d8K1vPLf6U8gHStELSdVBUSwptmPDHpCm5xxhAbJbs
//Working no round ID: BsUhCxyyyGVc9ajGKKCH4kdHXGNUqqUEZjYKxk9Fo8rN
export const programId = new PublicKey('BsUhCxyyyGVc9ajGKKCH4kdHXGNUqqUEZjYKxk9Fo8rN'); // Replace with your programId
export const program = new Program(idl, provider);

// Create PDA for the oracle
export const [oraclePDA, oracleBump] = PublicKey.findProgramAddressSync(
  [Buffer.from("oracle")],
  programId
);



// Example type for Oracle account data
export type OracleData = IdlAccounts<Oracle>["oracle"];

// // Function to calculate the size of the Oracle account
// const calculateOracleSize = (verifierCount: number) => {
//   const baseSize = 8 + 8 + 1 + 4; // asset_value, round_id_counter, required_verifications, history length
//   const verifierSize = 32 * verifierCount; // 32 bytes for each Pubkey
//   const approvalSize = verifierCount; // 1 byte for each approval bool
//   return baseSize + verifierSize + approvalSize;
// };

// Function to calculate the size of the Oracle account
const calculateOracleSize = (verifierCount: number): number => {
  // Adjust this calculation based on the structure defined in your Oracle account
  const baseSize = 8 + 1 + 32 * verifierCount + verifierCount + (8 + 8 + 8) * 50; // Example calculation
  return baseSize;
};

import { SystemProgram } from '@solana/web3.js';

// Function to initialize the Oracle account
export const initializeOracle = async (
  initialValue: number,
  requiredVerifications: number,
  verifiers: PublicKey[]
): Promise<void> => {
  try {
    // Ensure the wallet is connected
    if (!provider.wallet || !provider.wallet.publicKey) {
      alert("Please connect your wallet!");
      return;
    }

    // Calculate the minimum balance needed for rent exemption
    const lamports = await connection.getMinimumBalanceForRentExemption(
      calculateOracleSize(verifiers.length)
    );

    // Create the instruction to create the account with the necessary lamports
    const createAccountIx = SystemProgram.createAccount({
      fromPubkey: provider.wallet.publicKey,
      newAccountPubkey: oraclePDA,
      lamports,
      space: calculateOracleSize(verifiers.length),
      programId: program.programId,
    });

    // Create the transaction instruction for initializing the Oracle
    const initializeOracleIx = await program.methods
      .initializeOracle(
        new BN(initialValue), // initial_value (u64)
        requiredVerifications, // required_verifications (u8)
        verifiers.length // verifier_count (u8)
      )
      .accounts({
        oracle: oraclePDA,
        payer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    // Create and set up the transaction
    const transaction = new Transaction()
      .add(createAccountIx) // Add the instruction to fund the new account
      .add(initializeOracleIx); // Add the initialize instruction
    transaction.feePayer = provider.wallet.publicKey;
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    // Send and confirm the transaction
    const signature = await provider.sendAndConfirm(transaction, []);
    console.log(`Oracle initialized with signature: ${signature}`);
  } catch (error) {
    console.error("Error initializing Oracle:", error);
    if (error instanceof Error) {
      alert("Error initializing Oracle: " + error.message);
    }
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
