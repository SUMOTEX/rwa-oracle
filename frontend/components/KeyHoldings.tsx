import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Avatar } from '@nextui-org/react';

interface Asset {
    Name: string;
    Location: string;
    Space?: string;
    Rooms?: string;
    Type?: string;
    Completion?: string;
    Value?: string;
}

interface AssetDetailsProps {
    assetDetails: Asset | Asset[];
}

const parseValue = (value: string): number => {
    const parsed = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    return isNaN(parsed) ? 0 : parsed;
};

const KeyHoldings: React.FC<AssetDetailsProps> = ({ assetDetails }) => {
    if (!assetDetails || (Array.isArray(assetDetails) && assetDetails.length === 0)) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Key Holdings</h2>
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                    <p className="text-gray-700">No key holdings available.</p>
                </div>
            </div>
        );
    }

    const isSingleAsset = !Array.isArray(assetDetails);
    const assets = isSingleAsset ? [assetDetails] : assetDetails;

    // Calculate the total value for array-based assets
    const totalValue = Array.isArray(assets) ? assets.reduce((total, asset) => total + parseValue(asset.Value || ""), 0) : 0;

    // Prepare data for display
    const holdingsData = assets.map((asset) => ({
        name: asset.Name,
        symbol: asset.Type || asset.Location, // Use Type if available, otherwise Location
        percentage: asset.Value ? ((parseValue(asset.Value) / totalValue) * 100).toFixed(2) + '%' : 'N/A',
        additionalInfo: asset.Space || asset.Rooms || '' // Additional info if available
    }));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Key Holdings</h2>
            <Table
                aria-label="Key holdings table"
                className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm"
            >
                <TableHeader className="bg-gray-50 border-b border-gray-200">
                    <TableColumn className="font-semibold text-gray-700 py-2">COMPANY</TableColumn>
                    <TableColumn className="font-semibold text-gray-700 py-2">DETAILS</TableColumn>
                    <TableColumn className="font-semibold text-gray-700 py-2">PERCENTAGE OF PORTFOLIO</TableColumn>
                </TableHeader>
                <TableBody>
                    {holdingsData.map((item, index) => (
                        <TableRow key={index} className="border-b border-gray-200">
                            <TableCell className="flex items-center px-4 py-2">
                                <Avatar src="/path/to/logo.svg" alt="Logo" className="w-6 h-6 mr-3" />
                                {item.name}
                            </TableCell>
                            <TableCell className="px-4 py-2">
                                <div>{item.symbol}</div>
                                <div className="text-xs text-gray-500">{item.additionalInfo}</div>
                            </TableCell>
                            <TableCell className="px-4 py-2">{item.percentage}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default KeyHoldings;
