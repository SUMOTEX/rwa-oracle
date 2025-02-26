"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import OracleABI from "@/lib/abi/OracleABI.json";
import OracleBytecode from "@/lib/abi/OracleByteCode.json";
import Button from "@/components/ui/button";
import Input from "@/components/ui/forms/input";
import InputLabel from "@/components/ui/input-label";
import Textarea from "@/components/ui/forms/textarea";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

export default function CreateContract() {
    const { address, isConnected } = useAccount();

    // UI State
    const [contractName, setContractName] = useState("");
    const [description, setDescription] = useState("");
    const [deploying, setDeploying] = useState(false);
    const [contractAddress, setContractAddress] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    // Contract Settings
    const [minVerifiers, setMinVerifiers] = useState(3);
    const [rewardPerUpdate, setRewardPerUpdate] = useState("0.0000005");

    // Smart Contract Deployment Function
    const deployContract = async () => {
        if (!address) {
            setMessage("🚨 Connect your wallet first.");
            return;
        }
    
        try {
            setDeploying(true);
            setMessage("⏳ Deploying contract...");
    
            if (typeof window === "undefined" || !window.ethereum) {
                throw new Error("🚨 Wallet is not detected. Please install or enable it.");
            }
    
            const ethereum = window.ethereum;
            await ethereum.request({ method: "eth_requestAccounts" });
    
            const provider = new ethers.BrowserProvider(ethereum);
            const signer = await provider.getSigner();
    
            if (!signer) throw new Error("❌ Unable to get signer from wallet.");

            // ✅ Deploy Smart Contract with ONLY the required constructor argument
            const contractFactory = new ethers.ContractFactory(OracleABI, OracleBytecode.bytecode, signer);
            const contract = await contractFactory.deploy(
                signer.address, // ✅ Pass the connected wallet address as `initialOwner`
   
                {
                    value: ethers.parseEther("0.1"), // Optional contract funding
                    gasLimit: ethers.toBigInt(3000000), // Ensure enough gas
                }
            );
    
            await contract.waitForDeployment();
            const deployedAddress = await contract.getAddress();
    
            setContractAddress(deployedAddress);
            setMessage(`✅ Contract Deployed Successfully at ${deployedAddress}`);
        } catch (error) {
            setMessage(`❌ Deployment Failed: ${error.message}`);
        } finally {
            setDeploying(false);
        }
    };
    
    
    return (
        <div className="mx-auto w-full lg:px-8 xl:px-10">
            <div className="mb-6">
                <h2 className="text-lg font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:text-2xl">
                    Deploy Real Estate Oracle
                </h2>
            </div>

            {/* Contract Name */}
            <div className="mb-8">
                <InputLabel title="Contract Name" important />
                <Input type="text" placeholder="Enter contract name" value={contractName} onChange={(e) => setContractName(e.target.value)} />
            </div>

            {/* Description */}
            <div className="mb-8">
                <InputLabel title="Description" subTitle="Describe the contract functionality." />
                <Textarea placeholder="Provide a detailed description of your contract" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            {/* Minimum Verifiers */}
            <div className="mb-8">
                <InputLabel title="Minimum Verifier Approvals" subTitle="Number of approvals required for an update." />
                <Input type="number" value={minVerifiers} onChange={(e) => setMinVerifiers(Number(e.target.value))} />
            </div>

            {/* Reward Per Update */}
            <div className="mb-8">
                <InputLabel title="Reward Per Update (ETH)" subTitle="Amount rewarded to verifiers per approved update." />
                <Input type="text" value={rewardPerUpdate} onChange={(e) => setRewardPerUpdate(e.target.value)} />
            </div>

            {/* Deployment Button */}
            <Button
                onClick={deployContract}
                className={`mt-6 p-4 text-lg font-semibold rounded-lg flex items-center gap-2 ${
                    deploying ? "opacity-50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={deploying}
            >
                {deploying ? <Loader2 className="animate-spin" size={20} /> : "🚀 Deploy Contract"}
            </Button>

            {/* Deployment Status Message */}
            {message && (
                <div className={`mt-6 p-3 text-lg rounded-lg flex items-center gap-2 ${
                    contractAddress ? "bg-green-700 text-white" : "bg-red-600 text-white"
                }`}>
                    {contractAddress ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
                    {message}
                </div>
            )}

            {/* Show Contract Address */}
            {contractAddress && (
                <p className="mt-4 text-green-400 font-mono text-lg">
                    ✅ Contract Deployed at: <span className="underline">{contractAddress}</span>
                </p>
            )}
        </div>
    );
}
