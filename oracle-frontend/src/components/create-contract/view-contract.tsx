"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Button from "@/components/ui/button";
import { Loader2, Copy } from "lucide-react";

export default function ViewCreatedContracts() {
    const { address, isConnected } = useAccount();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (isConnected && address) {
            fetchContracts();
        }
    }, [isConnected, address]);

    const fetchContracts = async () => {
        if (!address) {
            setMessage("🚨 Connect your wallet first.");
            return;
        }

        try {
            setLoading(true);
            setMessage("⏳ Fetching contracts...");

            const response = await fetch(`https://ewa.sentinel.money/oracle/get_contracts/${address}`);
            const result = await response.json();

            if (result.success) {
                setContracts(result.contracts);
                setMessage("");
            } else {
                setMessage("❌ No contracts found.");
            }
        } catch (error) {
            setMessage(`❌ Error fetching contracts: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const copyToClipboard = (text:string) => {
        navigator.clipboard.writeText(text);
        alert("Contract address copied to clipboard!");
    };


    return (
        <div className="mx-auto w-full lg:px-8 xl:px-10">
            <div className="mb-6">
                <h2 className="text-lg font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:text-2xl">
                    View Created Contracts
                </h2>
            </div>

            <Button onClick={fetchContracts} className="mt-4 p-4 text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-700">
                🔄 Refresh Contracts
            </Button>

            {loading && (
                <div className="mt-6 p-3 text-lg rounded-lg flex items-center gap-2 bg-blue-500 text-white">
                    <Loader2 className="animate-spin" size={20} /> Fetching contracts...
                </div>
            )}

            {message && (
                <div className={`mt-6 p-3 text-lg rounded-lg text-white ${contracts.length ? "bg-green-700" : "bg-red-600"}`}>
                    {message}
                </div>
            )}

            {contracts.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold">Your Contracts</h3>
                    <ul className="mt-4 space-y-4">
                        {contracts.map((contract) => (
                            <li key={contract.contract_address} className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">📜 {contract.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 italic">{contract.subtitle}</p>
                                <p className="font-mono text-lg mt-2 flex items-center">🔗 Address: 
                                        <span className="underline text-blue-600 dark:text-blue-400 ml-2">{contract.contract_address}</span>
                                        <button onClick={() => copyToClipboard(contract.contract_address)} className="ml-2 p-1 bg-gray-200 dark:bg-gray-700 rounded">
                                            <Copy size={16} />
                                        </button>
                                    </p>
                                <div className="flex justify-between mt-4 text-gray-700 dark:text-gray-300">
                                    <span>✔ Min Verifiers: {contract.min_verifiers}</span>
                                    <span>💰 Reward: {contract.reward_per_update} ETH</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
