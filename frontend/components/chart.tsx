/* eslint-disable */
/* @ts-nocheck */
'use client';
import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, ChartOptions, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Button, ButtonGroup } from "@nextui-org/react";

Chart.register(...registerables);
Chart.register(annotationPlugin);

// Example data, this should be replaced with real data fetched from your API or other sources
const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            label: '# SMTX Price',
            data: [800, 820, 810, 830, 820, 810, 840], // Replace with real data
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: '#60B7A3',
            borderWidth: 4,
            pointRadius: 0,
            fill: true,
            tension: 0.5,
        },
    ],
};

const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: '#ffffff',
            borderColor: '#60B7A3',
            borderWidth: 1,
            bodyColor: '#000',
            titleColor: '#000',
            cornerRadius: 4,
        },
        legend: {
            display: false,
        },
        annotation: {
            annotations: {
                line1: {
                    type: 'line',
                    yMin: 830,
                    yMax: 830,
                    borderColor: '#60B7A3',
                    borderWidth: 1,
                    label: {
                        content: '$830.0',
                        position: 'start',
                        backgroundColor: '#60B7A3',
                        color: '#ffffff',
                    },
                },
            },
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
            ticks: {
                color: '#000',
                font: {
                    size: 10,
                },
            },
        },
        y: {
            grid: {
                tickBorderDash: [5, 5],
                color: '#e5e5e5',
            },
            ticks: {
                stepSize: 10,
                color: '#000',
                font: {
                    size: 10,
                },
                callback: (value: any) => `$${value}`,
            },
        },
    },
};

const LineChart: React.FC = () => {
    const chartRef = useRef(null);

    // Check if there is actual data
    const hasData = data.datasets && data.datasets.length > 0 && data.datasets[0].data.length > 0;

    return (
        <div style={{ height: '450px' }} className='border p-6 rounded'>
            <div className='flex flex-col md:flex-row justify-between mb-4'>
                <h2 className='text-left text-black font-bold text-md md:text-2xl'>Performance</h2>
                <ButtonGroup
                    radius="lg"
                    variant="bordered"
                    className="flex-nowrap overflow-x-auto no-scrollbar"
                >
                    <Button
                    size='sm'
                     className="w-14 md:w-16 lg:w-20 px-1 py-1 text-xs md:text-sm lg:text-base">
                        All
                    </Button>
                    <Button 
                     size='sm'
                    className="w-14 md:w-16 lg:w-20 px-1 py-1 text-xs md:text-sm lg:text-base">
                        1M
                    </Button>
                    <Button 
                     size='sm'
                    className="w-14 md:w-16 lg:w-20 px-1 py-1 text-xs md:text-sm lg:text-base">
                        6M
                    </Button>
                    <Button 
                     size='sm'
                    className="w-14 md:w-16 lg:w-20 px-1 py-1 text-xs md:text-sm lg:text-base">
                        1Y
                    </Button>
                    <Button 
                     size='sm'
                    className="w-14 md:w-16 lg:w-20 px-1 py-1 text-xs md:text-sm lg:text-base">
                        YTD
                    </Button>
                </ButtonGroup>
            </div>

            {hasData ? (
                <Line ref={chartRef} data={data} options={options} />
            ) : (
                <div className="text-center text-gray-500">No chart available</div>
            )}
        </div>
    );
};

export default LineChart;
