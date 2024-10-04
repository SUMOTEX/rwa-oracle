// InvestmentModal.js
import React, { useEffect, useState, useContext } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { WalletContext } from '@/config/lib/use-connect';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThreeDots, Puff } from 'react-loading-icons';
import { useCopyToClipboard } from 'react-use';

export default function InvestmentModal({ isOpen, onClose, projectName, fstAddress }) {
  const { getSpecificSSTDetails, getAddress, getChainLinkETHUSDPrice, purchaseViaETH, purchaseViaUSDC, getApprovalForUSDC, approvedUSDC, mintViaUSDC } = useContext(WalletContext);
  const [totalSupply, setTotalSupply] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadFST, setLoadFST] = useState(true);
  const [maxSupply, setMaxSupply] = useState(0);
  const [theObject, setTheObject] = useState<any>({});
  const [subscribeAmount, setSubscribeAmount] = useState<number>(1);

  let [copyButtonStatus, setCopyButtonStatus] = useState('Copy');
  let [_, copyToClipboard] = useCopyToClipboard();
  useEffect(() => {
    let url = new URL(window.location.href);
    let searchParams = new URLSearchParams(url.search);
    var theID = searchParams.get('id');
    const LoadFunction = async () => {
      let theSST = await getSpecificSSTDetails(theID);
      setTheObject(theSST);
      setLoadFST(false)
    }
    LoadFunction();
  }, []);
  function currencyFormat(num) {
    return '$ ' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  const handleCopyToClipboard = () => {
    //copyToClipboard(theFST);
    setCopyButtonStatus('Copied!');
    setTimeout(() => {
      setCopyButtonStatus(copyButtonStatus);
    }, 1000);
  };
  const subscribeFST = async (paymentMethod) => {
    var address = await getAddress();
    //const theURI = theObject.agreement
    if (subscribeAmount >= 1) {
      setLoading(true)
      if (paymentMethod == 0) {
        const allowance = 0;
        // Assuming theObject.tranche is a string that can be converted to a number
        const trancheAmount: number = parseInt(theObject.tranche, 10);

        //if (allowance < parseInt(theObject.tranche)) {
        if (allowance < (subscribeAmount * trancheAmount)) {
          let tranche = 10
          const result = await approvedUSDC(fstAddress, subscribeAmount * parseInt(theObject.tranche))
          if (result == 1) {
            let totalCoin = (theObject.tranche / theObject.cost_per_coin) + '0'.repeat(18)
            let usdcAmount = String(Math.floor((theObject.tranche / theObject.cost_per_coin))) + '0'.repeat(6);

            var agreementLink = ""
            if (agreementLink != 'undefined') {
              const theResult = await purchaseViaUSDC(fstAddress, totalCoin, usdcAmount, "https://sumotex.mypinata.cloud/ipfs/" + agreementLink['IpfsHash']);
              if (theResult['type'] != 'error') {
                setLoading(false);
                toast.success("Succesfully subscribed with USDC!");
              } else {
                setLoading(false);
                toast.error(theResult['message']);
              }
              if (theResult['type'] != 'error') {
                setLoading(false)
                toast.success("Succesfully subscribed ETH!");
              } else {
                setLoading(false)
                toast.error(theResult['message']);
              }
            } else {
              setLoading(false)
              toast.error("Something went wrong.");
            }
          }
        } else {
          let totalCoin = (theObject.tranche / theObject.cost_per_coin) + '0'.repeat(18);
          let usdcAmount = String(Math.floor((theObject.tranche / theObject.cost_per_coin))) + '0'.repeat(6);

          var agreementLink = ""
          const theResult = await purchaseViaUSDC(fstAddress, totalCoin, usdcAmount, "https://sumotex.mypinata.cloud/ipfs/" + agreementLink['IpfsHash']);
          if (theResult['type'] != 'error') {
            setLoading(false);
            toast.success("Succesfully subscribed with USDC!");
          } else {
            setLoading(false);
            toast.error(theResult['message']);
          }
        }
      } else if (paymentMethod == 1) {
        var address = await getAddress();
        var price = await getChainLinkETHUSDPrice();
        let thePrice = (theObject.tranche / (parseInt(price) / 100000000)) * 1000000000000000000
        var agreementLink = ""
        if (agreementLink != 'undefined') {
          let totalCoin = (theObject.tranche / theObject.cost_per_coin) + '0'.repeat(18);
          const theResult = await purchaseViaETH(fstAddress, totalCoin, thePrice, "https://sumotex.mypinata.cloud/ipfs/" + agreementLink['IpfsHash']);
          console.log(theResult['type'])
          if (theResult['type'] != 'error') {
            setLoading(false)
            toast.success("Succesfully subscribed ETH!");
          } else {
            setLoading(false)
            toast.error(theResult['message']);
          }
        }
      } else if (paymentMethod == 2) {
        //const theResult = await mintViaSMTX(subscribeAmount, theURI, subscribeAmount * parseInt(theObject.tranche), theFST)
        // if (theResult != 'error') {
        //   setLoading(false)
        //   toast.success("Succesfully subscribed SMTX!");
        // } else {
        //   setLoading(false)
        //   toast.error("Please try again, there was an issue with the transaction");
        // }
      } else {
        setLoading(false);
        toast.error("There was an error with your transactions, please try again");
      }
      setLoading(false);
    } else {
      setLoading(false);
      toast.error("The minimum amount to purchase is 1.");
    }

  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const parsedValue = parseFloat(value);

    if (!isNaN(parsedValue)) {
      setSubscribeAmount(parsedValue);
    } else {
      // Handle invalid number case, for example, set to 0 or previous valid number
      setSubscribeAmount(0);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="xl">
      <ModalContent>
        <div className="border border-black p-4 border border-gray-200 bg-white px-5 pt-5 pb-7  sm:px-7 sm:pb-8 sm:pt-6">
          <div className="border-t border-b py-2 border-black text-2xl font-bold flex justify-center uppercase text-gray-900 ltr:text-left rtl:text-right dark:text-white lg:text-2xl">
            <h1 className="text-3xl font-bold leading-[1.45em] text-gray-900 dark:text-white sm:text-2xl md:text-2xl xl:text-3xl">{projectName}</h1>
          </div>
          <div className='flex flex-col pt-2'>
            <div className="flex flex-col justify-center flex-wrap sm:pt-2 gap-2 md:gap-2.5 xl:pt-5">
              <div className='flex py-1 row justify-between gap-6'>
                <div>
                  <span className='text-md'>FST CONTRACT</span>
                </div>
                <div>
                  <span className='text-sm font-bold xl:text-md mt-4 text-align-right word-break-all'>{fstAddress}</span>
                </div>
              </div>
              <div className='flex flex-row justify-between'>
                <div className='flex justify-center'>
                  <span className='text-md'>Total Unit</span>
                </div>
                {loadFST ? <div className='flex justify-center'>
                  <span className='text-md'>
                    Loading
                  </span>
                </div> : <div className='flex justify-center'>
                  <span className='text-md'>
                    {totalSupply}/{maxSupply}
                  </span>
                </div>}
              </div>
              <div className='flex flex-row justify-between'>
                <div className='flex justify-center'>
                  <span className=' text-md'>Cost per token</span>
                </div>
                {loadFST ? <div className='flex justify-center'>
                  <span className='text-md'>
                    Loading
                  </span>
                </div> : <div className='flex justify-center'>
                  <span className='text-md'>
                    {theObject.cost_per_coin ? currencyFormat(theObject.cost_per_coin) : ""} USD
                  </span>
                </div>}
              </div>
              <div className='flex flex-row justify-between'>
                <div className='flex justify-center'>
                  <span className=' text-md'>Per tranche</span>
                </div>
                <div className='flex justify-center'>
                  <span className='text-md'>
                    {theObject.tranche ? currencyFormat(theObject.tranche) : ""} USD
                  </span>
                </div>
              </div>
              <div className='flex flex-row justify-between pt-4'>
                <div className='flex justify-center'>
                  <span className=' text-xl'>Total Cost</span>
                </div>
                <div className='flex justify-center'>
                  <span className='text-xl'>
                    {subscribeAmount * theObject.tranche ? currencyFormat(subscribeAmount * theObject.tranche) : ""} USD
                  </span>
                </div>
              </div>
              {/* <button onClick={handleCopyToClipboard}>
    <span className="text-md flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 xl:h-14 xl:w-14">
      <Copy className="h-4 w-4 lg:h-5 lg:w-5" />
    </span>
  </button> */}
            </div>
            <span className='mt-4 mb-2 flex justify-center'>Tranche</span>
          </div >
          {loading ? <div className='flex flex-col w-50 justify-center items-center'>
            <ThreeDots stroke="#70A591" width={100} height={100} fill={'#70A591'} />
            <span>Loading...</span>
          </div> : null}

          {loading ? null : <span className="relative flex justify-center">

            {/* <Tether className="absolute left-6 h-full text-gray-700 dark:text-white" /> */}
            <input
              type="number"
              autoFocus={true}
              defaultValue={subscribeAmount}
              onChange={handleInputChange}
              placeholder="Amount"
              className="w-ful flex text-center justify-center item-center border-x-0 border-b border-solid border-gray-200 py-3.5 text-xl focus:border-gray-300 focus:ring-1 dark:border-gray-600 dark:bg-light-dark dark:text-white dark:focus:border-gray-500"
            />
          </span>}
          {loading ? null : <span className='flex justify-center text-sm mb-4 mt-2'>Select your option</span>}
          {loading ? null : <div className='flex flex-col gap-2 item-center justify-center'>
            {loadFST ? <div className='flex justify-center text-middle'><Puff stroke="#70A591" width={100} height={100} fill={'#70A591'} /></div> : <a
              className="border border-black p-2 px-4 flex justify-center hover:bg-[#70A591] text-center"
              onClick={() => subscribeFST(0)}
            >
              <span className='flex row gap-2 hover:text-white'>
                Subscribe  with
                <span>USDC {approvedUSDC != 0 ? approvedUSDC : ""}</span>
              </span>
            </a>}
            {loadFST ? null : <a
              className="border border-black p-2 px-4 hover:bg-[#70A591] text-center"
              onClick={() => subscribeFST(1)}
            >
              <span className='text-gray-900 hover:text-white'>Subscribe with ETH</span>
            </a>}
            <a
              className="border border-black p-2 px-4 flex justify-center bg-[#f0f0f0] text-center"
            //onClick={() => subscribeFST(2)}
            >
              <span className='text-gray'>Subscribe with SMTX (coming soon)</span>
            </a>
            <div className='mt-2 text-sm text-center '>
              <span>
                By clicking "Subscribe", I agree to the following that as a <br />SUBSCRIBERS SHOULD RELY ON THEIR OWN EVALUATION TO <br />ASSESS THE MERITS OF RISKS OF THE COIN
                AND the following
                <br />
                <a onClick={() => window.open(theObject.investor_agreement, "_open")} className='text-[#70A591] text-bold'>Investor Agreement.</a>
              </span>
            </div>
          </div>}
        </div>
      </ModalContent>
    </Modal>
  );
}
