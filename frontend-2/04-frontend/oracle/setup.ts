import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { Program, IdlAccounts } from "@coral-xyz/anchor";
import type { Oracle } from "./idlType"; // Import Oracle IDL Type
import idl from "./idl.json"; // Import the IDL from the file

// Initialize connection to Solana devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Initialize Anchor program
export const program = new Program(idl as Oracle, {
  connection,
});

// Find PDA for Oracle Account
export const [oraclePDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("oracle_account")], // Replace with correct seeds if needed
  program.programId
);

// Data type for Oracle Account
export type OracleAccountData = IdlAccounts<Oracle>["oracleAccount"];
