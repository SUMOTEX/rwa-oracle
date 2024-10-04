'use client'
import { useEffect, useState, createContext, ReactNode } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import ethUSD from '../abi/ethUSD.json';
import API from '../lib/API';
import FSTABI from '../abi/fstABI.json';
import fstCoinABI from '../abi/fstCoinABI.json';
import SSTABI from '../abi/sstABI.json';
import erc20ABI from '../abi/erc20.json';
import stakingABI from '../abi/stakingABI.json';

export const STAKING_CONTRACT_ADDRESS = "0xe5e1A13a85940Eefd45555D79B196E93c9f6EFce";
export const WalletContext = createContext<any>({});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  //prod
  const [address, setAddress] = useState<string>('');
  const [chainId] = useState<string | number>(Number);
  const [balance, setBalance] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const web3Modal =
    typeof window !== 'undefined'
    && new Web3Modal({ cacheProvider: true });

  /* This effect will fetch wallet address if user has already connected his/her wallet */
  useEffect(() => {
    async function checkConnection() {
      //await getSSTTokenDetails();
      try {
        if (window && window.ethereum) {
          await connectToWallet();
          await checkWalletConnection();
        } else {
          console.log('window or window.ethereum is not available');
        }
      } catch (error) {
        console.log(error, 'Catch error Account is not connected');
      }
    }
    checkConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        // Request accounts from the wallet provider
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          getBalance(accounts[0]);
          return true; // Wallet is connected
        } else {
          console.log('Wallet is not connected');
          return false; // Wallet is not connected
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
        return false; // Error occurred
      }
    } else {
      console.log('Ethereum wallet is not available');
      return false; // No wallet available
    }
  };

  const getBalance = async (walletAddress: string) => {
    try {
      if (!window.ethereum) {
        console.error('Ethereum wallet is not available');
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const walletBalance = await provider.getBalance(walletAddress);
      const balanceInEth = ethers.formatEther(walletBalance);
      setBalance(balanceInEth);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const checkIfExtensionIsAvailable = () => {
    if (
      (window && window.web3 === undefined) ||
      (window && window.ethereum === undefined)
    ) {
      setError(true);
      web3Modal && web3Modal.toggleModal();
    }
  };

  const connectToWallet = async () => {
    try {
      setLoading(true);
      checkIfExtensionIsAvailable();
      const connection = web3Modal && (await web3Modal.connect());
      const provider = new ethers.BrowserProvider(connection);
      await subscribeProvider(connection);
      setWalletAddress(provider);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error,'got this error on connectToWallet catch block while connecting the wallet');
    }
  };

  const subscribeProvider = async (connection: any) => {
    connection.on('close', () => {
      disconnectWallet();
    });
    connection.on('accountsChanged', async (accounts: string[]) => {
      if (accounts?.length) {
        setAddress(accounts[0]);
        //const provider = new ethers.BrowserProvider(connection);
        getBalance(accounts[0]);
      } else {
        disconnectWallet();
      }
    });
  };
  const disconnectWallet = async () => {
    try {
      if (web3Modal) {
        await web3Modal.clearCachedProvider(); // Clears cached provider
        setAddress('');
        setBalance(undefined);
        console.log('Wallet disconnected');
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const setWalletAddress = async (provider: any) => {
    try {
      const signer = await provider.getSigner();
      if (signer) {
        const web3Address = await signer.getAddress();
        setAddress(web3Address);
        await getBalance(web3Address);
      }
    } catch (error) {
      console.log('Error fetching wallet address from setWalletAddress:', error);
    }
  };
  

  const stakingContract = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(STAKING_CONTRACT_ADDRESS, stakingABI, signer);
  };

  const balanceOf = async (account: string) => {
    const contract = await stakingContract();
    return await contract.balanceOf(account);
  };

  const duration = async () => {
    const contract = await stakingContract();
    return await contract.duration();
  };

  const earned = async (account: string) => {
    const contract = await stakingContract();
    return await contract.earned(account);
  };
  const totalStakeSupply = async () => {
    const contract = await stakingContract();
    const totalSupply = await contract.totalSupply();
    return ethers.formatUnits(totalSupply, 18)
  };
  const finishAt = async () => {
    const contract = await stakingContract();
    return await contract.finishAt();
  };

  const getReward = async () => {
    const contract = await stakingContract();
    return await contract.getReward();
  };

  const lastTimeRewardApplicable = async () => {
    const contract = await stakingContract();
    return await contract.lastTimeRewardApplicable();
  };
  const stake = async (amount: BigInt) => {
    const contract = await stakingContract();
    return await contract.stake(amount);
  };

  const stakingToken = async () => {
    const contract = await stakingContract();
    return await contract.stakingToken();
  };


  const owner = async () => {
    const contract = await stakingContract();
    return await contract.owner();
  };

  const rewardPerToken = async () => {
    const contract = await stakingContract();
    return await contract.rewardPerToken();
  };

  const rewardPerTokenStored = async () => {
    const contract = await stakingContract();
    return await contract.rewardPerTokenStored();
  };

  const rewardRate = async () => {
    const contract = await stakingContract();
    return await contract.rewardRate();
  };

  const userRewardPerTokenPaid = async (account: string) => {
    const contract = await stakingContract();
    return await contract.userRewardPerTokenPaid(account);
  };

  const withdraw = async (amount: BigInt) => {
    const contract = await stakingContract();
    return await contract.withdraw(amount);
  };
  const getFSTSupply = async (contractAddress: any) => {
    const fstContract = contractAddress;
    const provider = new ethers.InfuraProvider("mainnet", "b02fa7c04bbf4d39b20c69fe71d5ca94");
    const signer = await provider.getSigner();
    const theFST = new ethers.Contract(contractAddress, fstCoinABI, signer);
    let totalSupply = await theFST.initialSupply()
    //let theAddress = await coinContract.balanceOf("0x433d9c1dcfea21654cf962cecf36c9029f649c3a")
    //let total = ethers.utils.formatUnits(txnHash, 18)
    return ethers.formatUnits(totalSupply, 18)
  };
  const getFSTMaxSupply = async (contractAddress: any) => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const fstContract = contractAddress;
    const theFST = new ethers.Contract(fstContract, fstCoinABI, signer);
    const address = signer.getAddress();
    let totalSupply = await theFST.totalSupply();
    //let theAddress = await coinContract.balanceOf("0x433d9c1dcfea21654cf962cecf36c9029f649c3a")
    let total = ethers.formatUnits(totalSupply, 18)
    return parseInt(total)
  }
  const getFundManagerAddress = async (contractAddress: any) => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const fstContract = contractAddress;
    const theFST = new ethers.Contract(fstContract, fstCoinABI, signer);
    const address = signer.getAddress();
    let theAdd = await theFST.fundManagerAddress();
    //let theAddress = await coinContract.balanceOf("0x433d9c1dcfea21654cf962cecf36c9029f649c3a")
    return theAdd
  }

  const approvedUSDC = async (contractAddress: any, purchase_amount: any) => {
    await window.ethereum.enable();
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    //PROD
    const usdcContract = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    //Goerli beta
    //const usdcContract = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
    const fstContract = contractAddress;
    const coinContract = new ethers.Contract(usdcContract, erc20ABI, signer);
    let txnHash = await coinContract.approve(fstContract, String(purchase_amount * 1000000), {
      value: 0
    })
    try {
      // Wait for the transaction to be mined
      const receipt = await txnHash.wait();
      // The transactions was mined without issue
      return 1
    } catch (error) {
      return 2
    }
  }
  const approvedSMTX = async (contractAddress: any, purchase_amount: any) => {
    await window.ethereum.enable();
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const smtxContract = "0x102203517ce35AC5Cab9a2cda80DF03f26c7419b";
    const fstContract = contractAddress;
    const coinContract = new ethers.Contract(smtxContract, erc20ABI, signer);

    // Convert purchase_amount to a BigInt
    const amountBigInt = BigInt(purchase_amount) * BigInt(100);

    let txnHash = await coinContract.approve(fstContract, amountBigInt, {
      value: 0
    });

    try {
      // Wait for the transaction to be mined
      const receipt = await txnHash.wait();
      // The transaction was mined without issue
      return 1;
    } catch (error) {
      return 2;
    }
  };
  const getAgreements = async (contractAddress: any) => {
    await window.ethereum.enable();
    const provider = new ethers.BrowserProvider(window.ethereum);
    //const provider = new ethers.getDefaultProvider("homestead");
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    //const usdcContract = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
    const theContract = new ethers.Contract(contractAddress, fstCoinABI, signer);
    let theAgreemeents = await theContract.getAgreements(address);
    return theAgreemeents;
  }
  const getApprovalForUSDC = async (contractAddress: any) => {
    await window.ethereum.enable();
    const provider = new ethers.BrowserProvider(window.ethereum);
    //const provider = new ethers.getDefaultProvider("homestead");
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    //const usdcContract = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
    const usdcContract = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const theContract = new ethers.Contract(usdcContract, erc20ABI, signer);
    let theApproval = await theContract.allowance(address, contractAddress)
    return ethers.formatUnits(theApproval, 6);
  }
  const getFSTBalance = async (contractAddress: any) => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    //const provider = new ethers.getDefaultProvider("homestead");
    const signer = await provider.getSigner();
    const fstContract = contractAddress;
    const theFST = new ethers.Contract(fstContract, FSTABI, signer);
    const address = signer.getAddress();
    let balanceFST = await theFST.balanceOf(address);
    return parseInt(balanceFST)
  }
  const getFSTTokenIndex = async (contractAddress: any, tokenId: any) => {
    await window.ethereum.enable();
    const provider = new ethers.BrowserProvider(window.ethereum);
    //const provider = new ethers.getDefaultProvider("homestead");
    const signer = await provider.getSigner();
    const fstContract = contractAddress;
    const theFST = new ethers.Contract(fstContract, FSTABI, signer);
    const address = signer.getAddress();
    let tokenOfOwner = await theFST.tokenOfOwnerByIndex(address, tokenId);
    return parseInt(tokenOfOwner)
  }
  const getFSTTokenURI = async (contractAddress: any, tokenId: any) => {
    await window.ethereum.enable();
    const provider = new ethers.BrowserProvider(window.ethereum);
    //const provider = new ethers.getDefaultProvider("homestead");
    const signer = await provider.getSigner();
    const fstContract = contractAddress;
    const theFST = new ethers.Contract(fstContract, FSTABI, signer);
    let tokenOfOwner = await theFST.tokenURI(tokenId);
    return (tokenOfOwner)
  }
  const getFSTTokenCost = async (contractAddress: any) => {
    await window.ethereum.enable();
    const provider = new ethers.BrowserProvider(window.ethereum);
    //const provider = new ethers.getDefaultProvider("homestead");
    const signer = await provider.getSigner();
    const fstContract = contractAddress;
    const theFST = new ethers.Contract(fstContract, FSTABI, signer);
    let cost = await theFST.cost();
    return ethers.formatUnits(cost, 18);

  }
  const increaseAllowance = async (amount) => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const tokenContract = new ethers.Contract("0x102203517ce35AC5Cab9a2cda80DF03f26c7419b", erc20ABI, signer);

    // Fetch current allowance and convert to BigNumber
    let currentAllowance = await tokenContract.allowance(signer.getAddress(), STAKING_CONTRACT_ADDRESS);
    currentAllowance = BigInt(currentAllowance);

    // Convert amount to BigNumber and add to current allowance
    const amountBigInt = BigInt(amount);
    const newAllowance = currentAllowance.add(amountBigInt);

    // Approve the new allowance
    const txn = await tokenContract.approve(STAKING_CONTRACT_ADDRESS, newAllowance);
    await txn.wait();
  };


  const getSSTTokenDetails = async () => {
    //await window.ethereum.enable();
    //await window.ethereum.request({ method: "eth_requestAccounts" });
    //const provider = new ethers.BrowserProvider(window.ethereum);
    //to change to homestead for mainnet
    //const provider = new ethers.getDefaultProvider("https://mainnet.infura.io/v3/b02fa7c04bbf4d39b20c69fe71d5ca94", "a7afdc19a8f04a0c8c1a4743db0cedcd");
    //const provider = ethers.getDefaultProvider("https://mainnet.infura.io/v3/b02fa7c04bbf4d39b20c69fe71d5ca94");
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    //testnet
    //const sstContract = '0x7bf762D1Ded287068Fba536AF3ee96D79B0807Bf';
    //mainnet
    const sstContract = '0x2A0827A41b36C0f5Cb5BD4AD7bf84515cb9d7bd7';
    const provider = new ethers.InfuraProvider("mainnet", "b02fa7c04bbf4d39b20c69fe71d5ca94");
    //const signer = await provider.getSigner();  
    const theSST = new ethers.Contract(sstContract, SSTABI, provider);
    let theSupply = await theSST.totalSupply();
    let theFundsDetails: any = [];
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    for (var i = 1; i <= theSupply; i++) {
      try {
        let theURI = await theSST.tokenURI(i);
        const res = await API.get(theURI);
        theFundsDetails.push(res.data);
  
        // Add a delay between requests
        await delay(200); // Adjust delay as needed (e.g., 200ms)
      } catch (error) {
        console.error(`Error fetching data for token ${i}:`, error);
      }
    }
    return theFundsDetails
  }
  const mintSSTDetails = async () => {
    try {
      // Requesting user's wallet connection
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Setting up the provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Address of the SST contract on mainnet
      const sstContract = '0x2A0827A41b36C0f5Cb5BD4AD7bf84515cb9d7bd7';

      // Create a new instance of the contract
      const theSST = new ethers.Contract(sstContract, SSTABI, signer);

      // Mint the NFT
      console.log('Minting NFT...');
      const transaction = await theSST.safeMint(
        '0x3655c868cafa3aa97803cc0aded6419a5eeb4ab2',
        'https://sumotex.mypinata.cloud/ipfs/Qmc86dAk3DdLj23DbugtVPFhmZzuBUAjFf3wjRqLP1i1Wz'
      );

      // Wait for the transaction to be mined
      const receipt = await transaction.wait();
      console.log('Minted successfully:', receipt);

      return receipt;
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    }
  };
  const updateTokenURIs = async () => {
    try {
      // Requesting user's wallet connection
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Setting up the provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Address of the SST contract on mainnet
      const sstContract = '0x2A0827A41b36C0f5Cb5BD4AD7bf84515cb9d7bd7';

      // Create a new instance of the contract
      const theSST = new ethers.Contract(sstContract, SSTABI, signer);

      // Mint the NFT
      const transaction = await theSST.updateTokenURI(
        '6',
        'https://sumotex.mypinata.cloud/ipfs/QmZnrotCsU91waQyqCQCUfye1eDtUV7qXSD4vb64F8D7zS'
      );
      console.log('called',transaction)
      // Wait for the transaction to be mined
      const receipt = await transaction.wait();

      return receipt;
    } catch (error) {
      console.error('Error Updating NFT:', error);
      throw error;
    }
  };
  const getSpecificSSTDetails = async (id: any) => {
    //await window.ethereum.enable();
    //const provider = new ethers.BrowserProvider(window.ethereum);
    //to change to homestead for mainnet
    //const provider = new ethers.getDefaultProvider("https://mainnet.infura.io/v3/b02fa7c04bbf4d39b20c69fe71d5ca94", "b02fa7c04bbf4d39b20c69fe71d5ca94");
    
    //testnet
    //const sstContract = '0x7bf762D1Ded287068Fba536AF3ee96D79B0807Bf';
    //mainnet
    const sstContract = '0x2A0827A41b36C0f5Cb5BD4AD7bf84515cb9d7bd7';
    const provider = new ethers.InfuraProvider("mainnet", "b02fa7c04bbf4d39b20c69fe71d5ca94");
    const theSST = new ethers.Contract(sstContract, SSTABI, provider);
    if (id == 2) {
      let theURI = await theSST.tokenURI(1);
      let details = {}
      await API.get(theURI).then(async res => {
        details = res.data
      })
      return details
    } else if (id == 1) {
      let theURI = await theSST.tokenURI(2);
      let details = {}
      await API.get(theURI).then(async res => {
        details = res.data
      })
      return details
    } else if (id ==7) {
      let theURI = await theSST.tokenURI(5);
      let details = {}
      await API.get(theURI).then(async res => {
        details = res.data
      })
      return details
    }else if (id == 6) {
      let theURI = await theSST.tokenURI(6);
      let details = {}
      await API.get(theURI).then(async res => {
        details = res.data
      })
      return details
    }
    else {
      let theURI = await theSST.tokenURI(id);
      let details = {}
      await API.get(theURI).then(async res => {
        details = res.data
      })
      return details
    }
  }
  const getPortfolioFST = async () => {
    await window.ethereum.enable();
    const provider = new ethers.BrowserProvider(window.ethereum);
    //const provider = new ethers.getDefaultProvider("homestead");
    const signer = await provider.getSigner();
    //testnet
    //const sstContract = '0x7bf762D1Ded287068Fba536AF3ee96D79B0807Bf';
    //mainnet
    const sstContract = '0x2A0827A41b36C0f5Cb5BD4AD7bf84515cb9d7bd7';
    const theSST = new ethers.Contract(sstContract, SSTABI, signer);
    let theSupply = await theSST.totalSupply();
    let theFundsDetails: any = [];
    for (var i = 1; i <= theSupply; i++) {
      let theURI = await theSST.tokenURI(i);
      await API.get(theURI).then(async res => {
        const fstContract = res.data['fstAddress']
        const address = signer.getAddress();
        const theFST = new ethers.Contract(fstContract, fstCoinABI, signer);
        try {
          let balanceFST = await theFST.balanceOf(address);
          let formattedBalance = ethers.formatUnits(balanceFST, 18);
          if (parseInt(formattedBalance) > 0) {
            theFundsDetails.push((res.data))
          }
        }
        catch {
          return ""
        }
      }
      )
    }
    return theFundsDetails

  }
  const checkPortfolioValue = async () => {
    await window.ethereum.enable();
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    //testnet
    //const sstContract = '0x7bf762D1Ded287068Fba536AF3ee96D79B0807Bf';
    //mainnet
    const sstContract = '0x2A0827A41b36C0f5Cb5BD4AD7bf84515cb9d7bd7';
    const theSST = new ethers.Contract(sstContract, SSTABI, signer);
    let theSupply = await theSST.totalSupply();
    var theValues = 0
    var smtxValues = 0
    for (var i = 1; i <= theSupply; i++) {
      let theURI = await theSST.tokenURI(i);
      await API.get(theURI).then(async res => {
        const fstContract = res.data['fstAddress']
        const fstValue = res.data['cost_per_coin']
        const address = signer.getAddress();
        const theFST = new ethers.Contract(fstContract, fstCoinABI, signer);
        let balanceFST = await theFST.balanceOf(address);
        var theBalance: any = ethers.formatUnits(balanceFST, 18);
        theValues = theBalance * fstValue
        //the assumption here is that we give 200 iotex per NFT purchase at 0.07 price, price to be come up with once we have the live price.
        smtxValues = (theBalance * 200) * 0.07
      }
      )
      return { "usd": theValues, "smtx": smtxValues.toFixed(2) }
    }
  }
  const splitPerFSTValue = async () => {
    await window.ethereum.enable();
    //const { ethers } = require("ethers");
    const provider = new ethers.BrowserProvider(window.ethereum);
    //const provider = new ethers.getDefaultProvider("homestead");
    const signer = await provider.getSigner();
    //testnet
    //const sstContract = '0x7bf762D1Ded287068Fba536AF3ee96D79B0807Bf';
    //mainnet
    const sstContract = '0x2A0827A41b36C0f5Cb5BD4AD7bf84515cb9d7bd7';
    const theSST = new ethers.Contract(sstContract, SSTABI, signer);
    let theSupply = await theSST.totalSupply();
    let theFundsDetails: any = [];
    for (var i = 1; i <= theSupply; i++) {
      let theURI = await theSST.tokenURI(i);
      await API.get(theURI).then(async res => {
        const fstContract = res.data['fstAddress']
        const fstValue = res.data['cost_per_coin']
        const name = res.data['name']
        const fundStatus = res.data['fundStatus']
        if (fundStatus != 'hide') {
          const address = signer.getAddress();
          const theFST = new ethers.Contract(fstContract, fstCoinABI, signer);
          //if 
          let balanceFST = await theFST.balanceOf(address);
          var theBalance: any = ethers.formatUnits(balanceFST, 18);
          let theValues = theBalance * fstValue;
          if (theValues > 0) {
            theFundsDetails.push({ "id": fstContract, "name": name, "usd": theValues })
          }
        }

      }
      )
    }
    return theFundsDetails
  }

  const getAddress = async () => {
    await window.ethereum.enable();
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = signer.getAddress();
    return address
  }
  const getSpecificFST = async (fstAddress: any) => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const fstContract = fstAddress;
    const signer = await provider.getSigner();
    const address = signer.getAddress();
    const theFST = new ethers.Contract(fstContract, FSTABI, signer);
    let balanceFST = await theFST.balanceOf(address);
    var fstOwnTokens = []
    for (var i = 0; i < parseInt(balanceFST); i++) {
      let tokenOfOwnerID = await theFST.tokenOfOwnerByIndex(address, i);
      let tokenURI = await theFST.tokenURI(parseInt(tokenOfOwnerID));
      fstOwnTokens.push({ "id": parseInt(tokenOfOwnerID), "uri": tokenURI });
    }
    return fstOwnTokens;
    //console.log(balanceFST);
  }
  const getChainLinkETHUSDPrice = async () => {
    await window.ethereum.enable();
    const provider = new ethers.BrowserProvider(window.ethereum);
    //const provider = new ethers.getDefaultProvider("homestead");
    const signer = await provider.getSigner();
    //mainnet
    const chainLinkContractAddress = "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419";
    //testnet goerli
    //const chainLinkContractAddress = "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e";
    const coinContract = new ethers.Contract(chainLinkContractAddress, ethUSD, signer);
    let thePrice = await coinContract.latestRoundData()
    return thePrice['answer'];
  }
  return (
    <WalletContext.Provider
      value={{
        chainId,
        address,
        balance,
        loading,
        error,
        disconnectWallet,
        totalStakeSupply,
        balanceOf,
        getAgreements,
        getAddress,
        getFundManagerAddress,
        getChainLinkETHUSDPrice,
        getSpecificSSTDetails,
        getApprovalForUSDC,
        approvedSMTX,
        approvedUSDC,
        getPortfolioFST,
        getSpecificFST,
        splitPerFSTValue,
        checkPortfolioValue,
        getSSTTokenDetails,
        getFSTTokenCost,
        getFSTTokenURI,
        getFSTTokenIndex,
        getFSTBalance,
        getFSTMaxSupply,
        getFSTSupply,
        connectToWallet,
        duration,
        earned,
        finishAt,
        getReward,
        lastTimeRewardApplicable,
        owner,
        rewardPerToken,
        rewardPerTokenStored,
        rewardRate,
        stake,
        stakingToken,
        userRewardPerTokenPaid,
        withdraw,
        mintSSTDetails,
        increaseAllowance,
        updateTokenURIs
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
