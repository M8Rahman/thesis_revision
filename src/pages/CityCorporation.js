import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { YOUR_CONTRACT_ABI, YOUR_CONTRACT_ADDRESS } from '../config';


function CityCorporation() {
  const [projectID, setProjectID] = useState('');
  const [cityCorporationAddress, setCityCorporationAddress] = useState('');
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    // Automatically disconnect MetaMask when component is mounted
    disconnectMetaMask();

    // Set up Web3 and contract when component is mounted
    initWeb3();

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
        // Initialize your contract here
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
    } else if (e.target.name === 'cityCorporationAddress') {
      setCityCorporationAddress(e.target.value);
    }
  };

  const handleSetCityCorporation = async () => {
    try {
      if (!web3) {
        console.error('Web3 not initialized.');
        return;
      }

      if (!projectID || !cityCorporationAddress) {
        console.error('Please fill in both Project ID and City Corporation Address.');
        return;
      }

      if (!contract) {
        console.error('Contract not initialized.');
        return;
      }

      await contract.methods.setCityCorporation(projectID, cityCorporationAddress).send({ from: accounts[0] });

      console.log('City Corporation set successfully!');
    } catch (error) {
      console.error('Error setting City Corporation:', error);
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
			<input className="bg-transparent ml-20" placeholder='City Corporation Address' type="text" name="cityCorporationAddress" onChange={handleInputChange} />
			<hr className='ml-20 mt-1'/>
		</div>
		</label>
		<br />
		<div className='flex justify-center ml-16'>
		<button className="shadow__btn ml-28" type="button" onClick={handleSetCityCorporation}>
			Set City Corporation
		</button >
		</div>
	</form>
	</div>

  );
}

export default CityCorporation;
