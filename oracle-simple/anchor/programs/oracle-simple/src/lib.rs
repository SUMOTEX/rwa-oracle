use anchor_lang::prelude::*;

declare_id!("BsUhCxyyyGVc9ajGKKCH4kdHXGNUqqUEZjYKxk9Fo8rN");

#[program]
pub mod oracle_anchor {
    use super::*;

    pub fn initialize_oracle(ctx: Context<InitializeOracle>, initial_value: u64, required_verifications: u8) -> Result<()> {
        let oracle = &mut ctx.accounts.oracle;
        oracle.asset_value = initial_value;
        oracle.verifiers = ctx.remaining_accounts.iter().map(|v| v.key()).collect();
        oracle.approvals = vec![false; ctx.remaining_accounts.len()];
        oracle.required_verifications = required_verifications;
        oracle.history = vec![];

        msg!("Oracle initialized with value: {} and {} verifiers", initial_value, ctx.remaining_accounts.len());
        Ok(())
    }

    pub fn update_oracle(ctx: Context<UpdateOracle>, new_asset_value: u64) -> Result<()> {
        let oracle = &mut ctx.accounts.oracle;
        oracle.asset_value = new_asset_value;
        oracle.approvals = vec![false; oracle.verifiers.len()];

        let clock = Clock::get()?;
        let timestamp = clock.unix_timestamp as u64;

        oracle.history.push(OracleHistoryEntry {
            asset_value: new_asset_value,
            timestamp,
        });

        msg!("Oracle updated with new asset value: {}", oracle.asset_value);
        Ok(())
    }

    pub fn read_oracle(ctx: Context<ReadOracle>) -> Result<()> {
        let oracle = &ctx.accounts.oracle;

        msg!("Oracle Details:");
        msg!("Asset Value: {}", oracle.asset_value);
        msg!("Number of Verifiers: {}", oracle.verifiers.len());
        msg!("Required Verifications: {}", oracle.required_verifications);
        msg!("Approvals: {:?}", oracle.approvals);

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
        space = 8 + Oracle::space(MAX_VERIFIERS), // Dynamic space allocation
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
#[derive(Default)] // Only use Default if needed; Anchor handles serialization/deserialization automatically
pub struct Oracle {
    pub asset_value: u64,
    pub verifiers: Vec<Pubkey>,           // Verifiers list
    pub approvals: Vec<bool>,             // Approval status
    pub required_verifications: u8,       // Number of required verifications
    pub history: Vec<OracleHistoryEntry>, // Store historical oracle values
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct OracleHistoryEntry {
    pub asset_value: u64,
    pub timestamp: u64, // Unix timestamp of the update
}

impl Oracle {
    pub fn space(max_verifiers: usize) -> usize {
        8 // asset_value size
        + 1 // required_verifications
        + (32 * max_verifiers) // Verifier Pubkey size (32 bytes per verifier)
        + max_verifiers // Approval bools (1 byte each)
    }
}

// Define a constant for maximum verifiers allowed
const MAX_VERIFIERS: usize = 10; // You can adjust this based on your expected maximum
