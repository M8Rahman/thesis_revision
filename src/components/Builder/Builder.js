import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './Builder.css'
import { YOUR_CONTRACT_ABI, YOUR_CONTRACT_ADDRESS } from '../../config';

const Builder = () => {
  const [projectID, setProjectID] = useState('');
  const [builderAddress, setBuilderAddress] = useState('');
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
    } else if (e.target.name === 'builderAddress') {
      setBuilderAddress(e.target.value);
    }
  };

  const handleSetBuilder = async () => {
    try {
      if (!web3) {
        console.error('Web3 not initialized.');
        return;
      }

      if (!projectID || !builderAddress) {
        console.error('Please fill in both Project ID and Builder Address.');
        return;
      }

      if (!contract) {
        console.error('Contract not initialized.');
        return;
      }

      await contract.methods.setBuilder(projectID, builderAddress).send({ from: accounts[0] });

      console.log('Builder set successfully!');
    } catch (error) {
      console.error('Error setting Builder:', error);
    }
  };

  return (
    // <div>
    //   {/* <h1 className="text-4xl mb-5 ml-36">Builder Project Management</h1> */}
      
    // </div>
	<div class="card1 m-auto">
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
			<input className="bg-transparent ml-20" placeholder='Builder Address' type="text" name="builderAddress" onChange={handleInputChange} />
			<hr className='ml-20 mt-1'/>
		  </div>
        </label>
        <br />
        {/* <button className="text-black hover:text-white bg-green-400 p-1 hover:bg-green-800 rounded-xl mt-8 mb-4 h-10 w-[200px] ml-" type="button" onClick={handleSetBuilder}>
          Set Builder
        </button> */}
		<div className='flex justify-center ml-16'>
		<button className="shadow__btn" type="button" onClick={handleSetBuilder}>
    		Set Builder
		</button >
		</div>
      </form>
	</div>

  );
};

export default Builder;
