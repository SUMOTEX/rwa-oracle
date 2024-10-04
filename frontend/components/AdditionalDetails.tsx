'use client'
import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Button, Avatar, Divider } from "@nextui-org/react";

interface DetailsProps {
    termsheet: [];

}
const AdditionalDetails: React.FC<DetailsProps> = ({ termsheet }) => {
    { console.log(termsheet) }
    return (
        <Card className="bg-white rounded-lg p-2">
            <CardHeader className="flex-col justify-center items-start px-4">
                <div className="flex items-center mb-2">

                    <div className=" text-start">
                        <h4 className=" text-xl font-semibold text-default-700">Additional Details</h4>

                    </div>
                </div>
                <Divider className="" />
            </CardHeader>
            <CardBody className="px-2 mx-2">
                <ul className="list-disc">
                    {termsheet.map((item, index) => (
                        <li key={index} className="text-default-600 text-sm p-4">
                            <p className="text-[#737373] text-md mb-2">{item}</p>
                        </li>
                    ))}
                </ul>

                <Divider className="" />
            </CardBody>

            <CardFooter className=" justify-center">

            </CardFooter>
        </Card>
    );
}
export default AdditionalDetails;