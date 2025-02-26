use anchor_lang::prelude::*;

declare_id!("BsUhCxyyyGVc9ajGKKCH4kdHXGNUqqUEZjYKxk9Fo8rN");

#[program]
pub mod oracle_anchor {
    use super::*;

    pub fn initialize_oracle(
        ctx: Context<InitializeOracle>,
        initial_value: u64,
        required_verifications: u8,
        reward_amount: u64, // Reward amount for each verifier
    ) -> Result<()> {
        let oracle = &mut ctx.accounts.oracle;
    
        if ctx.remaining_accounts.len() > MAX_VERIFIERS {
            return Err(ProgramError::InvalidArgument.into());
        }
    
        oracle.asset_value = initial_value;
        oracle.required_verifications = required_verifications;
        oracle.history = vec![OracleHistoryEntry {
            asset_value: initial_value,
            timestamp: Clock::get()?.unix_timestamp as u64,
        }];
        oracle.verifiers = ctx.remaining_accounts.iter().map(|v| v.key()).collect();
        oracle.approvals = vec![false; oracle.verifiers.len()];
        oracle.reward_amount = reward_amount;

        // Initialize stakes for verifiers
        oracle.stakes = vec![0; oracle.verifiers.len()]; // Initially, no verifier has staked anything
    
        msg!(
            "✅ Oracle Initialized: Asset Value: {}, Verifiers: {}, Reward Amount: {}",
            initial_value,
            oracle.verifiers.len(),
            reward_amount
        );
        Ok(())
    }
    
    pub fn approve_update(ctx: Context<ApproveOracleUpdate>) -> Result<()> {
        let oracle = &mut ctx.accounts.oracle;
        let signer = &ctx.accounts.signer;
    
        // Ensure signer is a verifier
        if let Some(index) = oracle.verifiers.iter().position(|&v| v == signer.key()) {
            if oracle.approvals[index] {
                msg!("⛔ You have already approved this update!");
                return Err(ProgramError::InvalidArgument.into());
            }
            oracle.approvals[index] = true;
    
            // Add reward for the approver
            oracle.stakes[index] += oracle.reward_amount;
    
            // Check if approvals meet the required threshold
            let approvals_count = oracle.approvals.iter().filter(|&&a| a).count();
            if approvals_count >= oracle.required_verifications as usize {
                msg!("✅ Oracle Update Approved!");
                // Distribute rewards to all verifiers
                distribute_rewards(oracle);
            } else {
                msg!("🕐 Awaiting More Approvals... {}/{}", approvals_count, oracle.required_verifications);
            }
            Ok(())
        } else {
            msg!("⛔ Unauthorized Approver!");
            Err(ProgramError::InvalidArgument.into())
        }
    }
    
    // Distribute rewards to all verifiers
    fn distribute_rewards(oracle: &mut Oracle) {
        // Reward each verifier who approved the update
        for (index, &approval) in oracle.approvals.iter().enumerate() {
            if approval {
                msg!("✅ Verifier {} rewarded with {} tokens", oracle.verifiers[index], oracle.reward_amount);
                // Here, you would call a transfer function to actually reward the verifiers
                // e.g., transfer_tokens(oracle.verifiers[index], oracle.reward_amount);
            }
        }
    }

    // Update Oracle with a new asset value (only verifiers can approve)
    pub fn update_oracle(ctx: Context<UpdateOracle>, new_asset_value: u64) -> Result<()> {
        let oracle = &mut ctx.accounts.oracle;

        // Reset approvals for a new value
        oracle.asset_value = new_asset_value;
        oracle.approvals.fill(false);

        let timestamp = Clock::get()?.unix_timestamp as u64;
        oracle.history.push(OracleHistoryEntry {
            asset_value: new_asset_value,
            timestamp,
        });

        msg!("🔄 Oracle Updated: New Value: {}", new_asset_value);
        Ok(())
    }

    // Read Oracle data
    pub fn read_oracle(ctx: Context<ReadOracle>) -> Result<()> {
        let oracle = &ctx.accounts.oracle;

        msg!("📊 Oracle Data:");
        msg!("🔹 Asset Value: {}", oracle.asset_value);
        msg!("🔹 Verifiers: {}", oracle.verifiers.len());
        msg!("🔹 Required Approvals: {}", oracle.required_verifications);
        msg!("🔹 Approval Status: {:?}", oracle.approvals);
        msg!("🔹 Stakes: {:?}", oracle.stakes);

        Ok(())
    }
}

// 📌 Define PDA Accounts
#[derive(Accounts)]
pub struct InitializeOracle<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = Oracle::space(),
        seeds = [b"oracle"],
        bump
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
pub struct ApproveOracleUpdate<'info> {
    #[account(mut)]
    pub oracle: Account<'info, Oracle>,
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct ReadOracle<'info> {
    pub oracle: Account<'info, Oracle>,
}

// 🏗 Oracle Data Structure
#[account]
#[derive(Default)]
pub struct Oracle {
    pub asset_value: u64,
    pub verifiers: Vec<Pubkey>,           // List of authorized verifiers
    pub approvals: Vec<bool>,             // Approval statuses
    pub required_verifications: u8,       // Minimum approvals required
    pub history: Vec<OracleHistoryEntry>, // History of asset values
    pub reward_amount: u64,               // Reward per verifier for approving
    pub stakes: Vec<u64>,                 // Staked amounts for each verifier
}

// 🕰 Oracle History Structure
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct OracleHistoryEntry {
    pub asset_value: u64,
    pub timestamp: u64, // Unix timestamp
}

impl Oracle {
    // Dynamically calculate space required for the Oracle storage
    pub fn space() -> usize {
        8  // Discriminator
        + 8  // asset_value (u64)
        + 1  // required_verifications (u8)
        + (32 * MAX_VERIFIERS)  // Verifiers (32 bytes per pubkey)
        + MAX_VERIFIERS  // Approval statuses (1 byte each)
        + (16 * MAX_HISTORY)  // Historical entries (16 bytes each)
        + 8  // reward_amount (u64)
        + (8 * MAX_VERIFIERS) // Stakes (u64 per verifier)
    }
}

const MAX_VERIFIERS: usize = 10;
const MAX_HISTORY: usize = 20; // Limit to avoid excessive on-chain storage
