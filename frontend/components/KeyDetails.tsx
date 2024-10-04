'use client'
import React from "react";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { MdTrendingUp, MdWarning, MdShowChart } from "./icons";

interface KeyDetailsProp {
    returnRate: number;
    repaymentFreq:number;
    fundSize:number;
    smtxRate:number;
    tenure:number;
    costPerCoin:number;
    usdtReturns:number;

}


const KeyDetails: React.FC<KeyDetailsProp> = ({ returnRate,smtxRate,tenure,repaymentFreq,fundSize,costPerCoin,usdtReturns}) => {
    return (
        <Card className="bg-white rounded-lg p-2">
            <CardHeader className="flex-col justify-center items-start px-4">
                <div className="flex items-center mb-2">
                    <div className="text-start">
                        <h4 className="text-xl font-semibold text-default-700">Key Details</h4>
                    </div>
                </div>
                <Divider className="mt-2" />
            </CardHeader>
            <CardBody className="px-2 mx-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-default-600 text-sm p-4">
                    <div className="flex flex-col items-start">
                        <p className="text-[#737373] mb-2">Return rate (APY)</p>
                        <div className="flex items-center">
                            <p className="ml-1 text-lg font-semibold">{returnRate}%</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-start">
                        <p className="text-[#737373] mb-2">Repayment Frequency</p>
                        <div className="flex items-center">

                            <p className="ml-1 text-lg text-orange-500">{repaymentFreq}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-start">
                        <p className="text-[#737373] mb-2">Size</p>
                        <div className="flex items-center">
                
                            <p className="ml-1 font-semibold text-lg">{fundSize}</p>
                        </div>
                    </div>
                </div>
                <Divider className="mt-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-default-600 text-sm p-4">
                    <div className="flex flex-col items-start">
                        <p className="text-[#737373] mb-2">SMTX Return</p>
                        <div className="flex items-center">
                            <p className="ml-1 text-lg font-semibold">{smtxRate}%</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-start">
                        <p className="text-[#737373] mb-2">Tenure</p>
                        <div className="flex items-center">

                            <p className="ml-1 text-lg font-semibold">{tenure}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-start"> 
                        <p className="text-[#737373] mb-2">Cost per Tranche</p>
                        <div className="flex items-center">

                            <p className="ml-1 font-semibold text-lg">{costPerCoin} USD</p>
                        </div>
                    </div>
                </div>
                <Divider className="mt-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-default-600 text-sm p-4">
                    <div className="flex flex-col items-start">
                        <p className="text-[#737373] mb-2">USDT Returns</p>
                        <div className="flex items-center">

                            <p className="ml-1 text-lg font-semibold">{usdtReturns}</p>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
export default KeyDetails;