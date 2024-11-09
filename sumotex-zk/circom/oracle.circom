pragma circom 2.0.0;

include "poseidon.circom";  // Including Poseidon hash function

// Timestamped, Single-Asset Oracle Proof with Enhanced Security and Validation
template SingleAssetOracleProof() {
    // Instantiate core OracleProof component for single-asset verification
    component oracle_proof = OracleProof(1);

    // Single asset input signals
    signal input asset_value;          // The single asset value reported by the oracle
    signal input expected_hash;        // Expected hash stored on-chain
    signal input timestamp;            // Timestamp associated with the asset value
    signal input nonce;                // Unique nonce to prevent replay attacks
    signal input identity_key;         // Identity key for the oracle or data provider

    // Threshold value (optional for scenarios needing minimum acceptable asset values)
    signal input threshold;            // Minimum asset value to consider proof as valid

    // Outputs
    signal output is_valid;            // Main validation output for the proof
    signal output is_above_threshold;  // Output to check if asset value is above the threshold
    signal output identity_verified;   // Output to verify oracle’s identity

    // Components
    component timestamp_verifier = TimestampVerifier();  // For validating timestamp freshness
    component nonce_checker = NonceChecker();            // For ensuring nonce uniqueness
    component identity_verifier = IdentityVerifier();    // For verifying identity key of oracle

    // Pass asset value to OracleProof hasher
    oracle_proof.asset_values[0] <== asset_value;
    oracle_proof.expected_hash <== expected_hash;

    // Perform hash comparison to validate data integrity
    is_valid <== oracle_proof.is_valid;

    // Check if asset value is above a specified threshold
    signal is_above_threshold_internal;
    is_above_threshold_internal <== (asset_value >= threshold);
    is_above_threshold <== is_above_threshold_internal;

    // Verify the identity of the oracle using identity_key
    identity_verifier.identity_key <== identity_key;
    identity_verified <== identity_verifier.is_valid;

    // Verify timestamp to ensure freshness of the data
    timestamp_verifier.timestamp <== timestamp;
    signal timestamp_valid;
    timestamp_valid <== timestamp_verifier.is_fresh;

    // Check nonce uniqueness to avoid replay attacks
    nonce_checker.nonce <== nonce;
    signal nonce_valid;
    nonce_valid <== nonce_checker.is_unique;

    // Ensure all validation conditions hold for final is_valid output
    is_valid <== (oracle_proof.is_valid * is_above_threshold_internal * identity_verified * timestamp_valid * nonce_valid);
}

// Template for checking timestamp freshness (modular)
template TimestampVerifier() {
    signal input timestamp;              // Input timestamp of the data
    signal input current_time;           // Current time, ideally passed from off-chain source

    // Output to indicate if the timestamp is fresh
    signal output is_fresh;

    // Check that the timestamp is within an acceptable range of the current time (e.g., ± 5 minutes)
    signal time_diff;
    time_diff <== (current_time - timestamp);
    is_fresh <== (time_diff <= 300 && time_diff >= -300); // Allow a 5-minute window
}

// Template for checking nonce uniqueness to prevent replay attacks
template NonceChecker() {
    signal input nonce;              // Input nonce to verify uniqueness
    signal output is_unique;         // Output signal to confirm nonce uniqueness

    // Pseudo logic: in practice, on-chain implementation would manage nonce storage and validation
    is_unique <== 1;  // Placeholder: assume nonce uniqueness for simplicity
}

// Template for verifying the identity of the oracle (based on identity_key)
template IdentityVerifier() {
    signal input identity_key;       // Unique identity key of the oracle or data provider
    signal output is_valid;          // Output signal for identity verification result

    // Placeholder logic: actual verification could involve cryptographic checks or on-chain validation
    is_valid <== 1;  // Assume identity_key is valid for demonstration purposes
}

// Main entry component
component main = SingleAssetOracleProof();
