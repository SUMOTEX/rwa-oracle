'use client';
import React, { Suspense, useEffect, useContext, useState } from "react";
import { Button, Modal, ModalContent, Avatar, Divider, Chip, Tabs, Tab } from "@nextui-org/react";
import { MdTrendingUp } from "./icons";
import LineChart from './chart';
import KeyDetails from "./KeyDetails";
import FundType from "./FundType";
import FundObjective from "./Objectives";
import AdditionalDetails from "./AdditionalDetails";
import TokenDetail from "./TokenDetails";

import KeyHoldings from "./KeyHoldings";
import { WalletContext } from '@/config/lib/use-connect';
import { useSearchParams } from 'next/navigation';

export default function FundDetails() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const { getSpecificSSTDetails, address, updateTokenURIs } = useContext(WalletContext);
    const [details, setDetails] = useState<any>({})
    const [isModalOpen, setModalOpen] = useState(false);
    const [isFullySubscribed, setFullySubscribed] = useState(false);

    // const openModal = () => setModalOpen(true);
    // const closeModal = () => setModalOpen(false);

    useEffect(() => {
        if (!id) return;
        const fetchDetails = async () => {
            try {
                const theDetails = await getSpecificSSTDetails(id);
                setDetails(theDetails);
            } catch (error) {
                console.error('Error fetching details:', error);
            }
        };
        fetchDetails();
    }, [id, address, getSpecificSSTDetails]);

    if (!details.name) {
        return <div>Loading...</div>; // Or a more sophisticated loading component
    }
    const closeModal = () => setModalOpen(false);
    const closeFullySubscribedModal = () => setFullySubscribed(false);

    const openModal = () => {
        if (details.fundStatus == 'completed') {
            setFullySubscribed(true);
        } else {
            setModalOpen(true);
        }
    };
    return (
        <div className="w-full px-2 md:px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                <div className="flex items-center mb-2 lg:mb-0">
                    <Avatar
                        showFallback
                        name={details.name}
                        className="w-20 h-20 rounded text-large bg-black text-white"
                        radius="none" src="" />
                    <div className="ml-4 text-start">
                        <h1 className="text-2xl md:text-4xl font-bold text-default-700 pb-2 md:pb-4">{details.name}</h1>
                        <Chip
                            radius="sm"
                            className="text-white bg-[#000] w-10 h-10 text-md font-bold"
                            variant="solid">
                            {details.collection}
                        </Chip>
                    </div>
                </div>
                <div className="flex space-x-2 justify-center mt-4 lg:mt-0">
                    <Button
                        variant="bordered" className="px-4 md:px-6 py-2 md:py-4" size="md"
                        onClick={()=>updateTokenURIs()}
                    >
                        Add to watchlist
                    </Button>
                    <Button
                        onPress={openModal}
                        className={details.fundStatus === 'completed' ? "text-black" : "bg-[#60B7A3] text-white"}
                        size="md"
                        disabled={details.fundStatus === 'completed'}
                    >
                        {details.fundStatus === 'completed' ? 'Fully Subscribed' : 'Invest Now'}
                        {details.fundStatus !== 'completed' && <MdTrendingUp className="text-sm text-white ml-1" />}
                    </Button>
                </div>

            </div>
            <Modal isOpen={isFullySubscribed} onClose={closeFullySubscribedModal}>
                <ModalContent className="m-4 p-4">
                    <div className="text-lg text-bold">Fully Subscribed</div>
                    <div>The fund is completely subscribed and no further investments can be made.</div>
                    <Button onPress={closeFullySubscribedModal}>
                        Close
                    </Button>
                </ModalContent>
            </Modal>
            <div className="flex flex-col lg:flex-row w-full space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="flex-grow bg-white p-4 md:p-6 rounded shadow-sm">
                    {/* <LineChart /> */}
                    <div className="mt-40 lg:mt-10">
                        <Tabs aria-label="Overview">
                            <Tab key="Overview" title="Overview">
                                <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                                    <div>
                                        <KeyDetails
                                            returnRate={details.returnTotal}
                                            repaymentFreq={details.repaymentFreq}
                                            fundSize={details.size}
                                            smtxRate={details.returnSMTX}
                                            tenure={details.tenure}
                                            costPerCoin={details.tranche}
                                            usdtReturns={details.returns}
                                        />
                                    </div>
                                    {/* <div className="lg:w-2/5">
                                        <FundType />
                                    </div> */}
                                </div>
                                <div className="mt-4 flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                                    {/* <div className="lg:w-2/4">
                                        <FeesDetails />
                                    </div> */}
                                    <div className="space-y-4">
                                        <FundObjective
                                            objectiveTitle={details.name}
                                            objectiveDescription={details.description}
                                        />
                                       
                                        <AdditionalDetails
                                            termsheet={details.term_sheet[0]!==""||''? details.term_sheet : details.portfolio_body[0]}
                                        />
                                        <TokenDetail
                                            tokenID={details.id}
                                            caAddress={details.fstAddress}
                                            fmAddress="0x3655c868CAfa3AA97803cC0aDeD6419a5EEB4ab2"
                                        />
                                    </div>
                                </div>
                            </Tab>

                            <Tab key="key_holdings" title="Key Holdings">
                                <KeyHoldings
                                    assetDetails={details.asset ? details.asset : details.portfolio_body}
                                />
                            </Tab>
                        </Tabs>
                    </div>
                </div>
                <div className="flex-none w-full lg:w-1/4 bg-white p-4 md:p-6 rounded shadow-sm">
                    <h1 className="font-bold text-md">Information</h1>
                    <Divider className="mt-2" />
                    <div className="flex items-center my-2">
                        <Avatar
                            radius="lg"
                            showFallback
                            name={details.advisor}
                            className="bg-black text-white"
                            src="" />
                        <div className="ml-4 text-start">
                            <h4 className="text-xl font-semibold text-default-700">{details.advisor}</h4>
                        </div>
                    </div>
                    <h1 className="text-md mt-4">Key Information</h1>
                    <Divider className=" mb-4" />
                    <p className="text-md text-default-700">{details.description}</p>
                    <Divider className="mt-2" />
                </div>
            </div>
        </div>
    );
}
