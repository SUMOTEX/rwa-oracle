'use client'
import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";


interface FeeDetailsProp {
    returnRate: number;
    repaymentFreq:number;
    fundSize:number;
    smtxRate:number;
    tenure:number;
    costPerCoin:number;
    usdtReturns:number;

}

const FeesDetails: React.FC<FeeDetailsProp>=()=> {
    return (
        <Card className="bg-white rounded-lg p-2">
            <CardHeader className="flex-col justify-center items-start px-4">
                <div className="flex items-center mb-2">
                    <div className=" text-start">
                        <h4 className=" text-xl font-semibold text-default-700">Fees & Expenses</h4>
                    </div>
                </div>
                <Divider />
            </CardHeader>
            <CardBody className="px-2 mx-2">
                <div className="flex justify-between text-default-600 text-sm p-4">
                    <div className="">
                        <p className="text-[#737373] mb-2">Front Load</p>
                    </div>
                    <div className="">
                        <p className=" text-md mb-2 text-bold">N/A</p>
                    </div>
                </div>
                <Divider />
                <div className="flex justify-between text-default-600 text-sm p-4">
                    <div className="">
                        <p className="text-[#737373] mb-2">Deferred Load</p>
                    </div>
                    <div className="">
                        <p className=" text-md mb-2 text-bold">N/A</p>
                    </div>
                </div>
                <Divider />
                <div className="flex justify-between text-default-600 text-sm p-4">
                    <div className="">
                        <p className="text-[#737373] mb-2">Max Redemption Fee</p>
                    </div>
                    <div className="">
                        <p className=" text-md mb-2 text-bold">N/A</p>
                    </div>
                </div>
                <Divider />
                <div className="flex justify-between text-default-600 text-sm p-4">
                    <div className="">
                        <p className="text-[#737373] mb-2">Expense Ratio</p>
                    </div>
                    <div className="">
                        <p className=" text-md mb-2 text-bold">0.20%</p>
                    </div>
                </div>
                <Divider />
                <div className="flex justify-between text-default-600 text-sm p-4">
                    <div className="">
                        <p className="text-[#737373] mb-2">12b-1</p>
                    </div>
                    <div className="">
                        <p className=" text-md mb-2 text-bold">N/A</p>
                    </div>
                </div>
                <Divider />
                <div className="flex justify-between text-default-600 text-sm p-4">
                    <div className="">
                        <p className="text-[#737373] mb-2">Turnover</p>
                    </div>
                    <div className="">
                        <p className=" text-md mb-2 text-bold">2%</p>
                    </div>
                </div>
                <Divider />
            </CardBody>

            <CardFooter className=" justify-center">

            </CardFooter>
        </Card>
    );
}

export default FeesDetails;