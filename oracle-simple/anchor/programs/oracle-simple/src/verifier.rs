use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[program]
pub mod oracle_anchor {
    use super::*;

    pub fn approve_update_with_reward(ctx: Context<ApproveOracleUpdate>, amount: u64) -> Result<()> {
        let oracle = &mut ctx.accounts.oracle;
        let signer = &ctx.accounts.signer;

        // Ensure signer is a verifier
        if let Some(index) = oracle.verifiers.iter().position(|&v| v == signer.key()) {
            if oracle.approvals[index] {
                msg!("⛔ You have already approved this update!");
                return Err(ProgramError::InvalidArgument.into());
            }
            oracle.approvals[index] = true;

            // Reward the verifier with tokens
            let cpi_accounts = Transfer {
                from: ctx.accounts.verifier_token_account.to_account_info(),
                to: ctx.accounts.signer_token_account.to_account_info(),
                authority: ctx.accounts.payer.to_account_info(),
            };
            let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
            token::transfer(cpi_ctx, amount)?;

            // Check if approvals meet the required threshold
            let approvals_count = oracle.approvals.iter().filter(|&&a| a).count();
            if approvals_count >= oracle.required_verifications as usize {
                msg!("✅ Oracle Update Approved and Verifier Rewarded!");
            } else {
                msg!("🕐 Awaiting More Approvals... {}/{}", approvals_count, oracle.required_verifications);
            }
            Ok(())
        } else {
            msg!("⛔ Unauthorized Approver!");
            Err(ProgramError::InvalidArgument.into())
        }
    }
}

// 🏗 Define CPI Accounts for Token Transfer
#[derive(Accounts)]
pub struct ApproveOracleUpdate<'info> {
    #[account(mut)]
    pub oracle: Account<'info, Oracle>,
    pub signer: Signer<'info>,
    #[account(mut)]
    pub verifier_token_account: Account<'info, TokenAccount>, // Verifier's token account
    #[account(mut)]
    pub signer_token_account: Account<'info, TokenAccount>, // Verifier's account receiving the reward
    pub payer: Signer<'info>,
    pub token_program: Program<'info, Token>,
}
