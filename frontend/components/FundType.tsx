'use client'
import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Button, Avatar, Divider } from "@nextui-org/react";
import { MdTrendingUp, MdWarning, MdShowChart } from "./icons";

export default function FundType() {
    return (
        <Card className="bg-white rounded-lg p-2">
            <CardHeader className="flex-col justify-center items-start px-4">
                <div className="flex items-center mb-2">

                    <div className=" text-start">
                        <h4 className=" text-xl font-semibold text-default-700">Fund Type</h4>

                    </div>
                </div>
                <Divider className="" />
            </CardHeader>
            <CardBody className="px-2 mx-2">
                <div className="flex justify-between text-default-600 text-sm p-4">
                    <div className="">
                        <p className="text-[#737373] mb-2">Category</p>
                    </div>
                    <div className="">
                        <p className=" text-md mb-2 text-bold">Multi-Cap Core</p>
                    </div>
                </div>
                <Divider className="" />
                <div className="flex justify-between text-default-600 text-sm p-4">
                    <div className="">
                        <p className="text-[#737373] mb-2">Portfolio Style</p>
                    </div>
                    <div className="">
                        <p className=" text-md mb-2 text-bold">Growth & Income</p>
                    </div>
                </div>
                <Divider className="" />
                <div className="flex justify-between text-default-600 text-sm p-4">
                    <div className="">
                        <p className="text-[#737373] mb-2">Fund Status</p>
                    </div>
                    <div className="">
                        <p className=" text-md mb-2 text-bold">Open</p>
                    </div>
                </div>
                <Divider className="" />
                <div className="flex justify-between text-default-600 text-sm p-4">
                    <div className="">
                        <p className="text-[#737373] mb-2">Fund Inception</p>
                    </div>
                    <div className="">
                        <p className=" text-md mb-2 text-bold">April 28, 2015</p>
                    </div>
                </div>

                <Divider className="" />
            </CardBody>

            <CardFooter className=" justify-center">

            </CardFooter>
        </Card>
    );
}
