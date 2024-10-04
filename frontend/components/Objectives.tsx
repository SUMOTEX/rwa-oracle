'use client'
import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Button, Avatar, Divider } from "@nextui-org/react";

interface ObjectivesProp {
    objectiveTitle: string;
    objectiveDescription:string;

}

const FundObjective: React.FC<ObjectivesProp>=({objectiveTitle,objectiveDescription})=> {
    return (
        <Card className="bg-white rounded-lg p-2">
            <CardHeader className="flex-col justify-center items-start px-4">
                <div className="flex items-center mb-2">
                    <div className="text-start">
                        <h4 className=" text-xl font-semibold text-default-700">{objectiveTitle}</h4>
                    </div>
                </div>
                <Divider className="" />
            </CardHeader>
            <CardBody className="">
                <div className="flex justify-between text-default-600 text-sm">
                    <div className="">
                        <p className="text-bold text-lg ">{objectiveDescription}</p>
                    </div>
                </div>

            </CardBody>

            <CardFooter className=" justify-center">

            </CardFooter>
        </Card>
    );
}
export default FundObjective;