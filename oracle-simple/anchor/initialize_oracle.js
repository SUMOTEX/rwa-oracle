const anchor = require('@project-serum/anchor');
const { SystemProgram, PublicKey } = anchor.web3;
const idl = require('./target/idl/oracle_anchor.json');

async function main() {
    // Set up the connection and provider
    const connection = new anchor.web3.Connection("https://api.devnet.solana.com", "confirmed");
    const wallet = anchor.Wallet.local(); // Uses the keypair specified in ANCHOR_WALLET
    const provider = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
    });

    // Set the provider for Anchor
    anchor.setProvider(provider);

    // Load the program
    const programId = new PublicKey("29d8K1vPLf6U8gHStELSdVBUSwptmPDHpCm5xxhAbJbs");
    const program = new anchor.Program(idl, programId, provider);

    // Derive the PDA for the Oracle account using the same seeds and program ID
    const [oraclePDA, oracleBump] = await PublicKey.findProgramAddress(
        [Buffer.from("oracle")],
        program.programId
    );

    // Define the initial values for the oracle
    const initialValue = new anchor.BN(100); // Example initial value
    const requiredVerifications = 3; // Number of verifications needed
    const verifierCount = 5; // Number of verifiers

    // Send a transaction to initialize the Oracle account
    try {
        await program.methods
            .initializeOracle(initialValue, requiredVerifications, verifierCount)
            .accounts({
                oracle: oraclePDA,
                payer: wallet.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([wallet.payer])
            .rpc();

        console.log(`Oracle initialized at: ${oraclePDA.toBase58()}`);
    } catch (err) {
        console.error("Error initializing Oracle:", err);
    }
}

// Execute the main function
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
