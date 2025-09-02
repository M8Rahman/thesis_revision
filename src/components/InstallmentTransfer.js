import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { YOUR_CONTRACT_ABI, YOUR_CONTRACT_ADDRESS } from '../config';

function InstallmentTransfer() {
  const [projectID, setProjectID] = useState('');
  const [installmentAmount, setInstallmentAmount] = useState(0);
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    initWeb3();
    disconnectMetaMask(); // Disconnect MetaMask when component is mounted

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
    } else if (e.target.name === 'installmentAmount') {
      setInstallmentAmount(e.target.value);
    }
  };

  const handleTransferInstallment = async () => {
    try {
      if (!web3) {
        console.error('Web3 not initialized.');
        return;
      }

      if (!projectID || !installmentAmount) {
        console.error('Please fill in both Project ID and Installment Amount.');
        return;
      }

      if (!contract) {
        console.error('Contract not initialized.');
        return;
      }

      await contract.methods.sendInstallment(projectID, installmentAmount).send({
        from: accounts[0],
        gas: 200000,
        value: installmentAmount, // Directly use the installmentAmount as the value
      });
      console.log('Amount Sent: ', installmentAmount);
      console.log('Installment transferred successfully!');
    } catch (error) {
      console.error('Error transferring installment:', error);
    }
  };

  return (
    <div className="card1 m-auto">
      <form>
        <div className='ml-24 pb-4'>
          <label className='flex'>
            <div>
              <input className="project bg-transparent ml-20" placeholder='Project ID' type="text" name="id" onChange={handleInputChange} />
              <hr className='ml-20 mt-1' />
            </div>
          </label>
        </div>
        <label className='ml-24 flex'>
          <div>
            <input className="bg-transparent ml-20" placeholder='Installment Amount' type="number" name="installmentAmount" onChange={handleInputChange} />
            <hr className='ml-20 mt-1'/>
          </div>
        </label>
        <br />
        <div className='flex justify-center ml-16'>
          <button className="shadow__btn ml-28" type="button" onClick={handleTransferInstallment}>
            Transfer Installment
          </button >
        </div>
      </form>
    </div>
  );
}

export default InstallmentTransfer;
