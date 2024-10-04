'use client'
import React, { useEffect, useContext, useState } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Avatar, Button } from '@nextui-org/react';
import { WalletContext } from '@/config/lib/use-connect';


const holdingsData = [
  {
    name: 'Growth Opportunities Fund',
    type: 'Equity Fund',
    currentValue: '$50,000',
    percentageChange: '+10%',
    available: '$1,260,000',
    gains: '+15%',
    losses: '-6%',
  },
  // Add more fund data as needed
];

const KeyHoldings = () => {
  const { splitPerFSTValue, address } = useContext(WalletContext);
  const [portfolio, setPortfolio] = useState<any>([])
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const fundDetails = await splitPerFSTValue();
        setPortfolio(fundDetails)

      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };
    fetchDetails();
  }, [address]);
  return (
    <div className="w-full mx-auto px-4 sm:px-2 lg:px-4 py-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-xl text-start font-bold text-gray-900 mb-4">Holdings</h2>
      {portfolio.length > 0 ? (<Table aria-label="Holdings table" style={{ height: 'auto', minWidth: '100%' }}>
        <TableHeader>
          <TableColumn>Fund Name</TableColumn>
          <TableColumn>Available</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {portfolio.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center">
                  <Avatar src="/path/to/logo.svg" alt="Logo" className="mr-3" />
                  <div>
                    <div className="font-semibold">{item.name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{item.usd}</TableCell>
              <TableCell>
                <div className="flex flex-row">
                  {item.usd>0?<Button color="primary" variant="flat" className="mr-2">Sell</Button>:null}
                  <Button color="secondary" variant="flat">Buy</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      ) : (
        <div>No holdings available</div>
      )}

    </div>
  );
};

export default KeyHoldings;
