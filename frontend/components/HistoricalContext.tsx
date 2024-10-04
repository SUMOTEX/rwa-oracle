import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';

const HistoricalContext = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-4 mt-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Historical Context</h2>
      <Table
        aria-label="Historical data table"
        className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm"
      >
        <TableHeader className="bg-gray-50 border-b border-gray-200">
          <TableColumn className="font-semibold text-gray-700 py-2">DATE</TableColumn>
          <TableColumn className="font-semibold text-gray-700 py-2">OPEN</TableColumn>
          <TableColumn className="font-semibold text-gray-700 py-2">HIGH</TableColumn>
          <TableColumn className="font-semibold text-gray-700 py-2">LOW</TableColumn>
          <TableColumn className="font-semibold text-gray-700 py-2">CLOSE</TableColumn>
        </TableHeader>
        <TableBody>
          {[
            { date: '07/15/2024', open: '$252.60', high: '$252.60', low: '$252.60', close: '$252.60' },
            { date: '07/15/2024', open: '$252.60', high: '$252.60', low: '$252.60', close: '$252.60' },
            { date: '07/15/2024', open: '$252.60', high: '$252.60', low: '$252.60', close: '$252.60' },
            { date: '07/15/2024', open: '$252.60', high: '$252.60', low: '$252.60', close: '$252.60' },
            { date: '07/15/2024', open: '$252.60', high: '$252.60', low: '$252.60', close: '$252.60' },
            { date: '07/15/2024', open: '$252.60', high: '$252.60', low: '$252.60', close: '$252.60' },
            { date: '07/15/2024', open: '$252.60', high: '$252.60', low: '$252.60', close: '$252.60' },
            { date: '07/15/2024', open: '$252.60', high: '$252.60', low: '$252.60', close: '$252.60' },
            { date: '07/15/2024', open: '$252.60', high: '$252.60', low: '$252.60', close: '$252.60' },
            { date: '07/15/2024', open: '$252.60', high: '$252.60', low: '$252.60', close: '$252.60' },
          ].map((item, index) => (
            <TableRow key={index} className="border-b border-gray-200">
              <TableCell className="px-4 py-2">{item.date}</TableCell>
              <TableCell className="px-4 py-2">{item.open}</TableCell>
              <TableCell className="px-4 py-2">{item.high}</TableCell>
              <TableCell className="px-4 py-2">{item.low}</TableCell>
              <TableCell className="px-4 py-2">{item.close}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default HistoricalContext;
