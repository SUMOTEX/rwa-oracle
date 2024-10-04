// PortfolioPieChart.js
/* eslint-disable */
/* @ts-nocheck */
'use client';
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ChartOptions, registerables } from 'chart.js';

Chart.register(...registerables);

const pieOptions: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#ffffff',
      bodyColor: '#000',
      borderColor: '#ccc',
      borderWidth: 1,
    },
  },
};

const PortfolioPieChart: React.FC = ( labels:any, initialData:any) => {
  const [inputValues, setInputValues] = useState(initialData);
  const [portfolioData, setPortfolioData] = useState({
    labels: labels,
    datasets: [
      {
        label: 'Portfolio Distribution',
        data: initialData,
        backgroundColor: [
          '#60B7A3', // Custom green tones for consistency
          '#6FC2B1',
          '#78CDBF',
          '#81D7CC',
        ],
        borderWidth: 0,
      },
    ],
  });

  useEffect(() => {
    setPortfolioData((prevData) => ({
      ...prevData,
      labels,
      datasets: [
        {
          ...prevData.datasets[0],
          data: inputValues,
        },
      ],
    }));
  }, [labels, inputValues]);

  const handleInputChange = (index: number, value: number) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const totalInvestment = inputValues.reduce((acc, value) => acc + value, 0);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', gap: '40px' }}>
      <div className='flex flex-col'>
        <h2 style={{ fontWeight: 'bold', color: '#000', marginBottom: '20px' }}>Asset Allocation</h2>
        
        <div style={{ flex: '1 1 40%', minWidth: '300px', maxWidth: '400px' }}>
          {totalInvestment > 0 ? (
            <Pie data={portfolioData} options={pieOptions} />
          ) : (
            <div style={{ color: 'red' }}>No portfolio value entered.</div>
          )}
        </div>
      </div>
      <div style={{ flex: '1 1 60%', minWidth: '200px', maxWidth: '300px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ marginTop: '20px', color: totalInvestment === 0 ? 'red' : 'black' }}>
            {totalInvestment === 0 ? 'No portfolio value entered.' : `Total Investment: ${totalInvestment}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPieChart;
