// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import OracleSimpleIDL from '../target/idl/oracle_simple.json';
import type { OracleSimple } from '../target/types/oracle_simple';

// Re-export the generated IDL and type
export { OracleSimple, OracleSimpleIDL };

// The programId is imported from the program IDL.
export const ORACLE_SIMPLE_PROGRAM_ID = new PublicKey(OracleSimpleIDL.address);

// This is a helper function to get the OracleSimple Anchor program.
export function getOracleSimpleProgram(provider: AnchorProvider) {
  return new Program(OracleSimpleIDL as OracleSimple, provider);
}

// This is a helper function to get the program ID for the OracleSimple program depending on the cluster.
export function getOracleSimpleProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return ORACLE_SIMPLE_PROGRAM_ID;
  }
}
