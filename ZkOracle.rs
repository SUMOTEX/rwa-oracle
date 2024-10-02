use anchor_lang::prelude::*;

declare_id!("YourProgramID");

#[program]
pub mod rwa_oracle {
    use super::*;

    // Initialize the RWA Oracle Account
    pub fn initialize(ctx: Context<Initialize>, max_rwa_count: u64) -> Result<()> {
        let rwa_oracle = &mut ctx.accounts.rwa_oracle;
        rwa_oracle.admin = *ctx.accounts.admin.key;
        rwa_oracle.total_rwa = 0;
        rwa_oracle.max_rwa_count = max_rwa_count; // Max RWAs that can be stored
        Ok(())
    }

    // Add a new Real World Asset
    pub fn add_rwa(ctx: Context<AddRWA>, rwa_details: RwaDetails) -> Result<()> {
        let rwa_oracle = &mut ctx.accounts.rwa_oracle;

        // Ensure we don't exceed the maximum RWAs
        if rwa_oracle.total_rwa >= rwa_oracle.max_rwa_count {
            return Err(RWAError::MaxRWAReached.into());
        }

        rwa_oracle.rwa_list.push(rwa_details);
        rwa_oracle.total_rwa += 1;
        Ok(())
    }

    // Update an existing RWA by index
    pub fn update_rwa(ctx: Context<UpdateRWA>, index: u64, updated_details: RwaDetails) -> Result<()> {
        let rwa_oracle = &mut ctx.accounts.rwa_oracle;

        // Ensure the index is valid
        if (index as usize) >= rwa_oracle.rwa_list.len() {
            return Err(RWAError::InvalidIndex.into());
        }

        // Update the RWA details at the given index
        rwa_oracle.rwa_list[index as usize] = updated_details;
        Ok(())
    }

    // Fetch the details of an RWA by index
    pub fn get_rwa(ctx: Context<GetRWA>, index: u64) -> Result<RwaDetails> {
        let rwa_oracle = &ctx.accounts.rwa_oracle;

        // Ensure the index is valid
        if (index as usize) >= rwa_oracle.rwa_list.len() {
            return Err(RWAError::InvalidIndex.into());
        }

        Ok(rwa_oracle.rwa_list[index as usize].clone())
    }
}

// Account for RWA Oracle
#[account]
pub struct RWAOracle {
    pub admin: Pubkey,           // Admin of the oracle
    pub total_rwa: u64,          // Total number of RWAs stored
    pub max_rwa_count: u64,      // Max number of RWAs that can be stored
    pub rwa_list: Vec<RwaDetails>, // List of Real World Assets
}

// Struct to store RWA details
#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct RwaDetails {
    pub rwa_id: String,        // Unique ID for the RWA (could be a hash or unique code)
    pub value: u64,            // Value of the RWA
    pub description: String,   // Description of the asset (could include location, asset type, etc.)
    pub owner: Pubkey,         // Owner of the RWA
    pub status: RwaStatus,     // Status of the RWA (Active, Liquidated, etc.)
}

// Enum for RWA status
#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub enum RwaStatus {
    Active,
    Liquidated,
    Archived,
}

// Context structs for each instruction
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = admin, space = 8 + RWAOracle::LEN)]
    pub rwa_oracle: Account<'info, RWAOracle>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddRWA<'info> {
    #[account(mut)]
    pub rwa_oracle: Account<'info, RWAOracle>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateRWA<'info> {
    #[account(mut)]
    pub rwa_oracle: Account<'info, RWAOracle>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetRWA<'info> {
    pub rwa_oracle: Account<'info, RWAOracle>,
}

// Error handling for Oracle
#[error_code]
pub enum RWAError {
    #[msg("Maximum number of RWAs reached")]
    MaxRWAReached,
    #[msg("Invalid RWA index")]
    InvalidIndex,
}
