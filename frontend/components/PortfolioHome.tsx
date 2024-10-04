'use client';
import React, { Suspense, useEffect, useContext, useState } from "react";
import { WalletContext } from '@/config/lib/use-connect';
import { useSearchParams } from 'next/navigation';

export default function PortfolioHome() {
    const { getPortfolioFST, address } = useContext(WalletContext);
    const [listFST, setFST] = useState<any>({})

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const theDetails = await getPortfolioFST();
                console.log(theDetails)
                setFST(theDetails);
            } catch (error) {
                console.error('Error fetching details:', error);
            }
        };
        fetchDetails();
        console.log(address)
    }, [address]);

    if (!listFST) {
        return <div>Loading...</div>; // Or a more sophisticated loading component
    }

    return (
        <div className="w-full px-2 md:px-4 lg:px-8">
        </div>
    );
}
