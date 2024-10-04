'use client'
import React, { useContext, useEffect, useState } from "react";
import { Card, CardBody, Button, Divider } from "@nextui-org/react";
import { WalletContext } from '../config/lib/use-connect';
import { ethers } from 'ethers';

const StakingDetails: React.FC = ({ }) => {
    const {
        address,
        totalStakeSupply,
        balanceOf,
        earned,
        getReward,
        stake,
        withdraw,
        approvedSMTX,
        increaseAllowance
    } = useContext(WalletContext);

    const [stakeAmount, setStakeAmount] = useState<number>(1000);
    const [totalAvailableStake, setTotalStake] = useState<number>(0);
    const [totalStaked, setTotalStaked] = useState<number>(0);
    const [earnedRewards, setEarnedRewards] = useState<number>(0);

    useEffect(() => {
        if (address) {
            fetchStakingDetails();
        }
    }, [address]);

    const fetchStakingDetails = async () => {
        try {
            const staked = await balanceOf(address);
            const rewards = await earned(address);
            const totalStaked = await totalStakeSupply();
            setTotalStake(totalStaked);
            setTotalStaked(parseInt(ethers.formatUnits(staked, 18)));
            setEarnedRewards(parseInt(ethers.formatUnits(rewards, 18)));
        } catch (error) {
            console.error("Error fetching staking details:", error);
        }
    };
    const handleIncreaseAllowance = async () => {
        try {
            const amount = ethers.parseUnits(stakeAmount.toString(), 18);
            await increaseAllowance(amount);
            alert("Allowance increased successfully");
        } catch (error) {
            console.error("Error increasing allowance:", error);
        }
    };
    const handleApprove = async () => {
        try {
          const amount = ethers.parseUnits(stakeAmount.toString(), 18);
          await approvedSMTX("0xe5e1A13a85940Eefd45555D79B196E93c9f6EFce", amount);
        } catch (error) {
          console.error("Error approving:", error);
        }
      };
    const handleStake = async () => {
        try {
            const amount = ethers.parseUnits(stakeAmount.toString(), 18);
            await stake(amount);
            fetchStakingDetails();
        } catch (error) {
            if (error.message.includes("ERC20: insufficient allowance")) {
                alert("Insufficient allowance. Please approve the contract first.");
            } else {
                console.error("Error staking:", error);
            }
        }
    };

    const handleUnstake = async () => {
        try {
            const amount = ethers.parseUnits(stakeAmount.toString(), 18);
            await withdraw(amount);
            fetchStakingDetails();
        } catch (error) {
            console.error("Error unstaking:", error);
        }
    };

    const handleClaimRewards = async () => {
        try {
            await getReward();
            fetchStakingDetails();
        } catch (error) {
            console.error("Error claiming rewards:", error);
        }
    };

    return (
        <div className=" w-full mx-auto">
            <Card className="bg-white rounded-lg p-2 mb-4">
                <CardBody className="px-2 mx-2">
                    <div className="flex items-center mb-2">
                        <div className="text-start">
                            <h1 className="text-lg font-semibold text-default-700">Total Staked Amount (8% APY) </h1>
                        </div>
                    </div>
                    <Divider className="" />
                    <div className="flex justify-between text-default-600 text-sm p-4">
                        <div className="">
                            <p
                                className="text-lg"
                            >{new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: 2 }).format(totalAvailableStake)} SMTX</p>
                            <p className="text-2xl text-[#737373]">$ {(totalAvailableStake * 0.001347).toFixed(2)}</p>
                        </div>
                    </div>
                </CardBody>
            </Card>
            <div className="flex flex-row gap-4">
                <Card className="bg-white rounded-lg p-2 flex-1">
                    <CardBody className="px-2 mx-2">
                        <div className="flex justify-between text-default-600 text-sm p-4">
                            <div className="">
                                <p className="text-[#737373] mb-2">My Staked Amount</p>
                                <p className="text-xl font-semibold">{totalStaked} SMTX</p>
                                <Button className="mt-2" onPress={handleUnstake}>UNSTAKE</Button>
                            </div>
                        </div>
                        <Divider className="" />
                        <div className="flex justify-between text-default-600 text-sm p-4">
                            <div className="">
                                <p className="text-[#737373] mb-2">Earned Rewards</p>
                                <p className="text-xl font-semibold">{earnedRewards} SMTX</p>
                                <p className="text-sm text-[#737373]">Last Snapshot: 08/04/2024 10:30</p>
                                <Button className="mt-2" onPress={handleClaimRewards}>CLAIM REWARDS</Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card className="bg-white rounded-lg p-2 flex-1">
                    <CardBody className="px-2 mx-2">
                        <div className="flex items-center mb-2">
                            <div className="text-start">
                                <h4 className="text-xl font-semibold text-default-700">Stake</h4>
                            </div>
                        </div>
                        <Divider className="" />
                        <div className="flex items-center p-4">
                            <label className="mr-2">Amount</label>
                            <input
                                type="number"
                                value={stakeAmount}
                                onChange={(e) => setStakeAmount(Number(e.target.value))}
                                className="border p-2"
                            />
                        </div>
                        <Button  className="mt-2" onPress={handleApprove}>APPROVE</Button>
                        <Button  className="mt-2" onPress={handleStake}>STAKE</Button>
                        <div className="text-sm mt-2">
                            Step 1. Approve staking contract usage for staking<br />
                            Step 2. Stake SMTX on Contract
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default StakingDetails;
