import React from "react";
import { PortfolioPage } from "@/components/dashboard/Portfolio";
import BalanceCard from "@/components/dashboard/Balance";
import KeyHoldings from "@/components/dashboard/Holding";
import GainsLossesChart from "@/components/dashboard/ProfitLoss";
import StakingDetails from "@/components/Staking";

export default function DashboardPage() {
    return (
        <section className="flex flex-col items-start justify-center gap-4 py-4 md:py-4">
            <h1 className={`text-start font-bold text-2xl`}>Portfolio</h1>
            <div className="flex w-full">
                <BalanceCard />
            </div>
            {/* <div className="flex flex-row w-full">
                <div className="flex">
                    <PortfolioPage />
                </div>
                <div className="ml-2 w-full">
                    <GainsLossesChart />
                </div>
            </div> */}
            <div className="flex w-full">
                <KeyHoldings />
            </div>
            <div className="flex w-full">
                <StakingDetails />
            </div>
        </section>
    );
}
