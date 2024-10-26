# RWA Oracle

This repository contains the code for a zk-SNARK-based oracle on the Solana blockchain using the Anchor framework. The contract verifies oracle-reported values through zk-SNARK proofs, ensuring data privacy and integrity.

## Setup

Before running the project, ensure you have the required dependencies and environment set up:

1. Install dependencies:
    ```bash
    npm install
    ```

2. Build the Anchor program:
    ```bash
    npm run anchor build
    ```

3. Deploy the Anchor program:
    ```bash
    npm run anchor deploy -- --verbose
    ```

## Verifying Deployment

After deployment, you can check the deployed program's public key:

