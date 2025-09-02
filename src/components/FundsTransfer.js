import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { YOUR_CONTRACT_ABI, YOUR_CONTRACT_ADDRESS } from '../config';
//import './FundsTransfer.css'; // Import CSS file for styling

function FundsTransfer() {
  const [fundsAmount, setFundsAmount] = useState(0);
  const [projectID, setProjectID] = useState('');
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    initWeb3();
    return () => {
      disconnectMetaMask();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initWeb3 = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);
        console.log("Account Address:", accounts[0]);
        const contractInstance = new web3Instance.eth.Contract(YOUR_CONTRACT_ABI, YOUR_CONTRACT_ADDRESS);
        setContract(contractInstance);
      } catch (error) {
        console.error('User denied account access:', error);
      }
    } else {
      console.error('MetaMask not found. Please install MetaMask.');
    }
  };

  const disconnectMetaMask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
      } catch (error) {
        console.error('Error disconnecting MetaMask:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'id') {
      setProjectID(e.target.value);
    } else if (e.target.name === 'fundsAmount') {
      setFundsAmount(e.target.value);
    }
  };

  const handleTransferFunds = async () => {
    try {
      if (!web3) {
        console.error('Web3 not initialized.');
        return;
      }

      if (!projectID || !fundsAmount) {
        console.error('Please fill in both Project ID and Funds Amount.');
        return;
      }

      if (!contract) {
        console.error('Contract not initialized.');
        return;
      }

      await contract.methods.sendFundsToBuilder(projectID, fundsAmount).send({
        from: accounts[0],
        gas: 200000,
        value: fundsAmount, // Directly use the fundsAmount as the value
      });
      console.log('Funds Amount Sent: ', fundsAmount);
      console.log('Funds transferred successfully to the builder!');
    } catch (error) {
      console.error('Error transferring funds:', error);
    }
  };

  return (
    <div className="card1 m-auto funds-transfer-container"> {/* Added funds-transfer-container class */}
      <form>
        <div className='ml-24 pb-4'>
          <label className='flex'>
            <div>
              <input className="project bg-transparent ml-20" type="text" name="id" placeholder='Project ID' onChange={handleInputChange} />
              <hr className='ml-20 mt-1' />
            </div>
          </label>
        </div>
        <label className='ml-24 flex'>
          <div>
            <input className="bg-transparent ml-20" placeholder='Funds Amount' type="text" name="fundsAmount" onChange={handleInputChange} />
            <hr className='ml-20 mt-1'/>
          </div>
        </label>
        <br />
        <div className='flex justify-center ml-16'>
          <button className="shadow__btn ml-24" type="button" onClick={handleTransferFunds}>
            Transfer Funds to Builder
          </button>
        </div>
      </form>
    </div>
  );
}

export default FundsTransfer;
