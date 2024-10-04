use anchor_lang::prelude::*;
use std::vec::Vec;

declare_id!("YourProgramID");

#[program]
pub mod rwa_oracle {
    use super::*;

    // Initialize an asset for tracking
    pub fn initialize_asset(ctx: Context<InitializeAsset>, initial_value: u64) -> Result<()> {
        let asset_data = &mut ctx.accounts.asset_data;
        asset_data.asset_owner = *ctx.accounts.admin.key;
        asset_data.current_value = initial_value;
        asset_data.history.push(HistoryEntry {
            value: initial_value,
            timestamp: Clock::get()?.unix_timestamp,
        });
        Ok(())
    }

    // Update the value of the asset
    pub fn update_asset_value(ctx: Context<UpdateAssetValue>, new_value: u64) -> Result<()> {
        let asset_data = &mut ctx.accounts.asset_data;

        // Only the admin (oracle updater) can update the asset's value
        require_keys_eq!(asset_data.asset_owner, *ctx.accounts.admin.key, OracleError::Unauthorized);

        // Update the current value and push it to the history
        asset_data.current_value = new_value;
        asset_data.history.push(HistoryEntry {
            value: new_value,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    // Get the current value of the asset
    pub fn get_current_value(ctx: Context<GetCurrentValue>) -> Result<u64> {
        let asset_data = &ctx.accounts.asset_data;
        Ok(asset_data.current_value)
    }

    // Get the full history of the asset's value updates
    pub fn get_asset_history(ctx: Context<GetAssetHistory>) -> Result<Vec<HistoryEntry>> {
        let asset_data = &ctx.accounts.asset_data;
        Ok(asset_data.history.clone())
    }
}

// Context for initializing an asset
#[derive(Accounts)]
pub struct InitializeAsset<'info> {
    #[account(init, payer = admin, space = 8 + 32 + 8 + (8 + 8) * 100)] // Allocating space for the account
    pub asset_data: Account<'info, AssetData>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Context for updating the asset's value
#[derive(Accounts)]
pub struct UpdateAssetValue<'info> {
    #[account(mut)]
    pub asset_data: Account<'info, AssetData>,
    #[account(mut)]
    pub admin: Signer<'info>,
}

// Context for getting the current value of the asset
#[derive(Accounts)]
pub struct GetCurrentValue<'info> {
    pub asset_data: Account<'info, AssetData>,
}

// Context for getting the asset's historical data
#[derive(Accounts)]
pub struct GetAssetHistory<'info> {
    pub asset_data: Account<'info, AssetData>,
}

// Data structure for each asset
#[account]
pub struct AssetData {
    pub asset_owner: Pubkey,          // The key of the admin or the oracle updater
    pub current_value: u64,           // The current value of the asset
    pub history: Vec<HistoryEntry>,   // History of all value updates
}

// History entry structure to track asset value changes
#[derive(Clone, AnchorSerialize, AnchorDeserialize)]
pub struct HistoryEntry {
    pub value: u64,           // The updated value
    pub timestamp: i64,       // The time of the update
}

#[error_code]
pub enum OracleError {
    #[msg("Unauthorized to perform this action")]
    Unauthorized,
}
