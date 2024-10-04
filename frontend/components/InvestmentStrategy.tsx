'use client'
import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Button, Avatar, Divider } from "@nextui-org/react";
import { MdTrendingUp, MdWarning, MdShowChart } from "./icons";

export default function InvestmentStrategy() {
    return (
        <Card className="bg-white rounded-lg p-2">
            <CardHeader className="flex-col justify-center items-start px-4">
                <div className="flex items-center mb-2">
                    <div className="text-start">
                        <h4 className=" text-xl font-semibold text-default-700">Investment Strategy</h4>
                    </div>
                </div>
                <Divider className="" />
            </CardHeader>
            <CardBody className="">
                <div className="flex justify-between text-default-600 text-sm">
                    <div className="">
                        <p className="text-bold text-md ">Tortor id aliquet lectus proin nibh nisl. Massa tincidunt nunc pulvinar sapien et ligula ullamcorper. Adipiscing commodo elit at imperdiet dui accumsan. Mi in nulla posuere sollicitudin aliquam ultrices. Tellus at urna condimentum mattis pellentesque id nibh tortor id. Tincidunt ornare massa eget egestas. Hac habitasse platea dictumst vestibu. </p>
                    </div>
                </div>

            </CardBody>

            <CardFooter className=" justify-center">

            </CardFooter>
        </Card>
    );
}
