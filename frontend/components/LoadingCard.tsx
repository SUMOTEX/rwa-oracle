
'use client'
import React from 'react';
import { Card } from "@nextui-org/react";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


export default function LoadingCard(){
    return(
        <Card className="p-4">
        <div className="flex items-center mb-4">
            <Skeleton circle={true} width={40} height={40} />
            <div className="ml-4">
                <Skeleton  width={100} />
                <Skeleton  width={150} />
            </div>
        </div>
        <div className="mb-4">
            <Skeleton  width="100%" height={20} />
        </div>
        <div className="flex justify-between">
            <Skeleton width={80} height={20} />
            <Skeleton  width={100} height={20} />
        </div>
        <div className="flex justify-between mt-4">
            <Skeleton  width={100} height={36} />
            <Skeleton width={100} height={36} />
        </div>
    </Card>
    )
}