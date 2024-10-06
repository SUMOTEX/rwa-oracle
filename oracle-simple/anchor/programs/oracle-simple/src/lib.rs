use anchor_lang::prelude::*;

declare_id!("BsUhCxyyyGVc9ajGKKCH4kdHXGNUqqUEZjYKxk9Fo8rN");

#[program]
pub mod oracle_anchor {
    use super::*;

    // Initialize the Oracle with an initial value and setup verifiers
    pub fn initialize_oracle(
        ctx: Context<InitializeOracle>, 
        initial_value: u64, 
        required_verifications: u8, 
        verifier_count: u8
    ) -> Result<()> {
        let oracle = &mut ctx.accounts.oracle;
        oracle.asset_value = initial_value;
        oracle.verifiers = vec![Pubkey::default(); verifier_count as usize]; // Initialize with dummy Pubkeys for now
        oracle.approvals = vec![false; verifier_count as usize];
        oracle.required_verifications = required_verifications;
        oracle.history = vec![]; // Initialize empty history
        oracle.round_id_counter = 0; // Initialize the round ID counter

        msg!("Oracle initialized with value: {} and {} verifiers", initial_value, verifier_count);
        Ok(())
    }

    // Update the Oracle's asset value and store it in the history with roundID
    pub fn update_oracle(ctx: Context<UpdateOracle>, new_asset_value: u64) -> Result<()> {
        let oracle = &mut ctx.accounts.oracle;
        oracle.asset_value = new_asset_value;
        oracle.approvals = vec![false; oracle.verifiers.len()]; // Reset approvals

        let clock = Clock::get()?;
        let timestamp = clock.unix_timestamp as u64;

        // Increment the round ID and store it in the history entry
        let round_id = oracle.round_id_counter;
        oracle.history.push(OracleHistoryEntry {
            round_id,
            asset_value: new_asset_value,
            timestamp,
        });

        // Increment the internal round ID counter for the next update
        oracle.round_id_counter += 1;

        msg!("Oracle updated with new asset value: {} and round ID: {}", oracle.asset_value, round_id);
        Ok(())
    }

    // Read the latest state of the Oracle, returning the most recent value
    pub fn read_latest_oracle(ctx: Context<ReadOracle>) -> Result<()> {
        let oracle = &ctx.accounts.oracle;

        let latest_entry = oracle.history.last().unwrap();

        msg!("Latest Oracle Details:");
        msg!("Latest Round ID: {}", latest_entry.round_id);
        msg!("Latest Asset Value: {}", latest_entry.asset_value);
        msg!("Latest Timestamp: {}", latest_entry.timestamp);

        Ok(())
    }

    // Read a specific historical Oracle entry by round ID
    pub fn read_oracle_by_round_id(ctx: Context<ReadOracle>, round_id: u64) -> Result<()> {
        let oracle = &ctx.accounts.oracle;

        // Check if the round_id is within bounds of the history vector
        let entry = oracle.history.iter().find(|entry| entry.round_id == round_id);
        if let Some(entry) = entry {
            msg!("Oracle Details for Round ID: {}", round_id);
            msg!("Asset Value: {}", entry.asset_value);
            msg!("Timestamp: {}", entry.timestamp);
        } else {
            return Err(ErrorCode::RoundIdOutOfBounds.into());
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeOracle<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = 8 + Oracle::space(5,300), // Space allocation based on verifier count (5 for this example)
        seeds = [b"oracle"],
        bump // PDA bump seed
    )]
    pub oracle: Account<'info, Oracle>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateOracle<'info> {
    #[account(mut)]
    pub oracle: Account<'info, Oracle>,
}

#[derive(Accounts)]
pub struct ReadOracle<'info> {
    pub oracle: Account<'info, Oracle>,
}

#[account]
pub struct Oracle {
    pub asset_value: u64,
    pub verifiers: Vec<Pubkey>,           // List of verifier public keys
    pub approvals: Vec<bool>,             // Approval status for each verifier
    pub required_verifications: u8,       // Number of required verifications
    pub history: Vec<OracleHistoryEntry>, // Store historical oracle values
    pub round_id_counter: u64,            // Internal counter for round IDs
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct OracleHistoryEntry {
    pub round_id: u64,        // Unique round ID for each Oracle update
    pub asset_value: u64,     // The asset value at the time of update
    pub timestamp: u64,       // Unix timestamp of the update
}

impl Oracle {
    // Calculate space based on the number of verifiers and history
    pub fn space(verifier_count: usize,history_entries:usize) -> usize {
        8  // asset_value size
        + 8 // round_id_counter
        + 1 // required_verifications
        + (32 * verifier_count) // Verifier Pubkey size (32 bytes per verifier)
        + verifier_count // Approval bools (1 byte per verifier)
        + 4 // History vector size (dynamic length, so add space for storing length)
        + (8 + 8 + 8) * history_entries // Assuming 100 history entries: 8 bytes for round_id, 8 bytes for asset_value, 8 bytes for timestamp
    }
}

// Error codes
#[error_code]
pub enum ErrorCode {
    #[msg("The provided round ID is out of bounds.")]
    RoundIdOutOfBounds,
}
