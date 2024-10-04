'use client'
import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Button, Avatar, Divider } from "@nextui-org/react";


interface TokenDetailsProps {
    tokenID: string;
    caAddress:string;
    fmAddress:string;

}

const TokenDetails:React.FC<TokenDetailsProps>=({tokenID,caAddress,fmAddress})=> {
    return (
        <Card className="bg-white rounded-lg p-2">
            <CardHeader className="flex-col justify-center items-start px-4">
                <div className="flex items-center mb-2">

                    <div className=" text-start">
                        <h4 className=" text-xl font-semibold text-default-700">On Chain Data</h4>

                    </div>
                </div>
                <Divider className="" />
            </CardHeader>
            <CardBody className="px-2 mx-2">
                <div className="flex justify-between text-default-600 text-sm p-4">
                    <div className="">
                        <p className="text-[#737373] mb-2">SST Token ID</p>
                    </div>
                    <div className="">
                        <p className=" text-md mb-2 text-bold sm:inline">{tokenID}</p>
                    </div>
                </div>
                <Divider className="" />
                <div className="flex justify-between text-default-600 text-sm p-4">
                    <div className="">
                        <p className="text-[#737373] mb-2">Contract Address</p>
                    </div>
                    <div className="">
                        <p className=" text-md mb-2 text-bold sm:inline">{caAddress}</p>
                    </div>
                </div>
                <Divider className="" />
                <div className="flex justify-between text-default-600 text-sm p-4">
                    <div className="">
                        <p className="text-[#737373] mb-2">Fund Manager Address</p>
                    </div>
                    <div className="">
                        <p className=" text-md mb-2 text-bold sm:inline">{fmAddress}</p>
                    </div>
                </div>
                <Divider className="" />
                {tokenID=='6'?<div className="flex justify-between text-default-600 text-sm p-4">
                    <div className="">
                        <p className="text-[#737373] mb-2">On Chain USDT Data</p>
                    </div>
                    <div className="">
                        <p className=" text-md mb-2 text-bold break-words sm:break-normal">https://tronscan.org/#/address/TY42jhjwnR91UGZMBUzT4LwJQkgCF1aQHR</p>
                    </div>
                </div>:null}
            </CardBody>
            <CardFooter className=" justify-center">

            </CardFooter>
        </Card>
    );
}
export default TokenDetails;