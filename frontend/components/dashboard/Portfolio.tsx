'use client'
import React, { useState,useEffect,useContext } from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import PortfolioPieChart from "./PieChart";
import { WalletContext } from '@/config/lib/use-connect';

export const PortfolioPage = () => {
    const { checkPortfolioValue, address } = useContext(WalletContext);
    const [portfolioValue, setValue] = useState<any>({})
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const fundValue = await checkPortfolioValue();
                console.log(fundValue)
                setValue(fundValue);
            } catch (error) {
                console.error('Error fetching details:', error);
            }
        };
        fetchDetails();
    }, [address]);

    return (
        <div>
            <Card className="">
                <Divider />
                <CardBody>
                <PortfolioPieChart/>
                </CardBody>
                <Divider />
                <CardFooter>
                </CardFooter>
            </Card>
        </div>
    );
};
