'use client'
import React, { useEffect, useState } from "react";
import { Card, Chip, CardHeader, CardBody, CardFooter, Button, Avatar, Divider, Progress } from "@nextui-org/react";
import { MdTrendingUp } from "@/components/icons";
import { useContext } from "react";
import { useRouter } from 'next/navigation';
import { WalletContext } from '@/config/lib/use-connect';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";

interface FundCardProps {
    id: number;
    fundStatus: string;
    tranche: number;
    name: string;
    avatarName: string;
    fundType: string;
    returnRate: string;
    riskLevel: string;
    publicShares: string;
    description: string;
    currentProgress: number;
    repayFreq: string;
    fundSize: string;
    fstAddress: string;

}

const FundCard: React.FC<FundCardProps> = ({ id, fundStatus, tranche, name, avatarName, fundType, returnRate, repayFreq, fstAddress, fundSize, description }) => {
    const router = useRouter()
    const { getFSTBalance, getFSTSupply } = useContext(WalletContext);
    const [totalValue, setTotalValue] = useState(id == 7 ? 25000 : 0);
    const [totalFunded, setFunded] = useState(id == 7 ? 250000 : 0);

    useEffect(() => {
        const fetchDetails = async () => {
            const theDetails = await getFSTBalance(fstAddress)
            let theCurrentSupply = await getFSTSupply(fstAddress);
            setTotalValue(theCurrentSupply)
            setFunded(theDetails)
        }
        fetchDetails()
    }, [fstAddress])
    return (
        <Card className="bg-white rounded-lg p-4 flex-grow lg:w-[400px] lg:h-[430px]">
            <CardHeader className="flex-col justify-center items-start px-4">
                <div className="flex items-center mb-2">
                    <Avatar
                        showFallback
                        name={avatarName}
                        className="lg:w-12 lg:h-12 rounded text-large bg-black text-white"
                        radius="none" />
                    <div className="ml-4 text-start">
                        <h4 className="text-lg font-semibold text-default-700">{name}
                            <Chip
                                variant="bordered"
                                className={`${fundStatus == 'completed' ? 'bg-[#60B7A3]' : 'bg-black'} text-white border-0`}
                            >{fundStatus == "completed" ? "Completed" : "In progress"}</Chip>
                        </h4>
                        <p className="text-small text-default-500">{fundType}</p>
                    </div>
                </div>
                <Divider className="mt-2" />
            </CardHeader>
            <CardBody className="px-2 mx-2 flex-grow">
                <div className="flex justify-between text-default-600 text-sm">
                    <div className="m-2">
                        <p className="text-[#737373] mb-2">Return rate</p>
                        <div className="flex items-center">
                            <p className="ml-1 text-lg font-semibold">{returnRate} %</p>
                        </div>
                    </div>
                    <Divider orientation="vertical" />
                    <div className="m-2">
                        <p className="text-[#737373] mb-2">Repayment Freq</p>
                        <div className="flex items-center">
                            <p className="ml-1 text-lg text-center text-orange-500">{repayFreq ? repayFreq : '-'}</p>
                        </div>
                    </div>
                    <Divider orientation="vertical" />
                    <div className="m-2">
                        <p className="text-[#737373] mb-2">Fund Size</p>
                        <div className="flex items-center">

                            <p className="ml-1 font-semibold text-lg">{fundSize}</p>
                        </div>
                    </div>
                </div>
                <p className="text-sm line-clamp-2 text-[#262626] mt-4 ">
                    {description}
                </p>
                <div className="mt-4">
                    <Progress
                        label={fundStatus == 'completed' ? 'Fully Subscribed' : `Total Subscription`}
                        size="sm"
                        aria-label="Loading..."
                        showValueLabel={true}
                        value={fundStatus == 'completed'&&id==6 ? 250000 :fundStatus == 'completed'&&id==7 ?25000: totalValue}
                        maxValue={fundStatus == 'completed'&&id==6 ? 250000 :fundStatus == 'completed'&&id==7 ?25000: totalFunded}
                        formatOptions={{ style: "currency", currency: "USD" }}
                        classNames={{
                            base: "max-w-md",
                            track: " border border-default",
                            indicator: "bg-[#60B7A3]",
                            label: "tracking-wider font-medium text-default-600",
                            value: "text-foreground/60",
                        }}
                    />
                </div>
            </CardBody>
            <Divider orientation="horizontal" />
            <CardFooter className="space-x-2 justify-center">
                <Button variant="bordered" className="px-10 py-4" size="lg"
                    onClick={() => router.push(`/detail.html?id=${id}`)}>
                    View Details
                </Button>
                {fundStatus == 'completed' ? null : <Button
                    className="bg-[#60B7A3] text-white px-10 py-4" size="lg"
                    onClick={() => router.push(`/detail.html?id=${id}`)}>
                    Invest Now <MdTrendingUp className="text-lg text-white" />
                </Button>}
            </CardFooter>
        </Card>
    );
}

export default FundCard;
