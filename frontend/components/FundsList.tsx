'use client'
import React, { useState, useEffect } from "react";
import FundCard from './FundCard';
import { useContext } from "react";
import { useRouter } from 'next/navigation';
import { WalletContext } from '@/config/lib/use-connect';
import LoadingCard from './LoadingCard';

const FundsList = () => {
    const { address, getSSTTokenDetails } = useContext(WalletContext);
    const [funds, setFunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Define an async function inside the effect
        const fetchDetails = async () => {
          if (funds.length > 0) {
            // If funds are already set, stop execution
            setLoading(false);
            return;
          }

          try {
            const details = await getSSTTokenDetails(); // Fetch the SST token details
            setFunds(details.reverse()); // Reverse the order of the fetched details
          } catch (error) {
            console.error("Error fetching details:", error);
          } finally {
            setLoading(false); // Set loading to false whether the fetch succeeds or fails
          }
        };
      
        // Call the async function to fetch data
        fetchDetails();
      
        // The empty dependency array ensures this useEffect runs only once
      }, [funds]); // Dependency on `funds` ensures the effect depends on the `funds` state

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
                <>
                    <LoadingCard />
                    <LoadingCard />
                    <LoadingCard />
                </>
            ) : (
                <>
                    {funds.map((fund) => (
                        fund.fundStatus !== 'hide'? (
                            <FundCard
                                key={fund.id}
                                id={fund.id}
                                tranche={fund.tranche}
                                name={fund.name}
                                avatarName={fund.name}
                                fundType={fund.fundType}
                                returnRate={fund.returnTotal}
                                riskLevel={fund.riskLevel}
                                publicShares={fund.publicShares}
                                description={fund.description}
                                currentProgress={fund.currentProgress}
                                repayFreq={fund.repaymentFreq}
                                fundSize={fund.size}
                                fundStatus={fund.fundStatus}
                                fstAddress={fund.fstAddress}
                            />
                        ) : null
                    ))}
                </>
            )}
        </div>
    );
}

export default FundsList;
