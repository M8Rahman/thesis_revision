import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { YOUR_CONTRACT_ABI, YOUR_CONTRACT_ADDRESS } from '../config';

function ProjectCreation() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const [projectDetails, setProjectDetails] = useState({
    id: '',
    name: '',
    area: '',
    budget: 0,
    treasury: '',
  });

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);
          setIsConnected(true); // Set connection state to true when connected
        } catch (error) {
          console.error('User denied account access:', error);
        }
      } else {
        const web3Instance = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);
        setIsConnected(true); // Set connection state to true when connected
      }
    };

    initWeb3();
  }, []);

  useEffect(() => {
    if (web3) {
      const contractInstance = new web3.eth.Contract(YOUR_CONTRACT_ABI, YOUR_CONTRACT_ADDRESS);
      setContract(contractInstance);
    }
  }, [web3]);

  const handleInputChange = (e) => {
    setProjectDetails({ ...projectDetails, [e.target.name]: e.target.value });
  };

  const handleAllocateBudget = async () => {
    try {
      if (!isConnected) {
        console.error('Not connected to MetaMask. Please connect first.');
        return;
      }

      if (!contract) {
        console.error('Contract instance not available. Please wait for the contract to initialize.');
        // Optionally, you could initiate the contract initialization process here
        return;
      }

      if (!projectDetails.budget || !projectDetails.id || !projectDetails.name || !projectDetails.area || !projectDetails.treasury) {
        console.error('Please fill in all the required fields.');
        return;
      }

      await contract.methods.allocateBudget(
        projectDetails.budget,
        projectDetails.id,
        projectDetails.name,
        projectDetails.area,
        projectDetails.treasury
      ).send({ from: accounts[0] });

      console.log('Budget allocated successfully!');
    } catch (error) {
      console.error('Error allocating budget:', error);
    }
  };

  return (
    <div>
      {!isConnected ? (
        // <button
        //   className="text-black hover:text-white bg-green-400 p-1 hover:bg-green-800 rounded-xl mt-8 mb-4 h-10 w-[180px] ml-48"
        // type="button"
        // onClick={() => setIsConnected(true)}
        // >
        //   Connect to MetaMask
        // </button>
        <button className="shadow__btn ml-16" type="button" onClick={() => setIsConnected(true)}>
    		  Connect to MetaMask
		    </button>
      ) : (
        // <div className='border-4 border-white-950 bg-slate-400 m-2 p-4 w-2/5 ml-[425px] shadow-lg rounded-lg font-bold text-[16px] mt-[128px]'>
        //   <div className='mt-8'>
        //   <label className='ml-24'>
        //     Project ID: 
        //   <input className='mb-2 ml-20 rounded-md'
            // type="text"
            // name="id"
            // placeholder="Project ID"
            // value={projectDetails.id}
            // onChange={handleInputChange}
        //   />
        //   </label>
        //   </div>
        //   <label className='ml-24'>
        //     Project Name:
        //   <input className='mb-2 ml-[53px] rounded-md'
            // type="text"
            // name="name"
            // placeholder="Project Name"
            // value={projectDetails.name}
            // onChange={handleInputChange}
        //   />
        //   </label>
        //   <br></br>
        //   <label className='ml-24'>
        //     Project Area:
        //   <input className='mb-2 ml-[61px] rounded-md'
            // type="text"
            // name="area"
            // placeholder="Project Area"
            // value={projectDetails.area}
            // onChange={handleInputChange}
        //   />
        //   </label>
        //   <br></br>
        //   <label className='ml-24'>
        //     Project Budget:
        //   <input className='mb-2 ml-[42px] rounded-md'
            // type="number"
            // name="budget"
            // placeholder="Budget"
            // value={projectDetails.budget}
            // onChange={handleInputChange}
        //   />
        //   </label>
        //   <br></br>
        //   <label className='ml-24'>
        //     Treasury:
        //   <input className='ml-[88px] rounded-md'
            // type="text"
            // name="treasury"
            // placeholder="Treasury"
            // value={projectDetails.treasury}
            // onChange={handleInputChange}
        //   />
        //   </label>
        //   <br></br>
        //   <button
        //     className="text-black hover:text-white bg-green-400 p-1 hover:bg-green-800 rounded-xl mt-8 mb-4 h-10 w-[152px] ml-48"
        //     type="button"
        //     onClick={handleAllocateBudget}
        //   >
        //     Allocate Budget
        //   </button>
        // </div>
        <div class="card1 m-auto">
		<form>
        <div className='ml-24 pb-2'>
		<label className='flex'>
          <div>
		  <input className="project bg-transparent ml-20" type="text"
            name="id"
            placeholder="Project ID"
            value={projectDetails.id}
            onChange={handleInputChange} />
		  <hr className='ml-20 mt-1' />
		  </div>
        </label>
		</div>
        <label className='ml-24 flex pb-2'>
          <div>
			<input className="bg-transparent ml-20" type="text"
            name="name"
            placeholder="Project Name"
            value={projectDetails.name}
            onChange={handleInputChange} />
			<hr className='ml-20 mt-1'/>
		  </div>
        </label>
        <label className='ml-24 flex pb-2'>
          <div>
			<input className="bg-transparent ml-20"
            type="text"
            name="area"
            placeholder="Project Area"
            value={projectDetails.area}
            onChange={handleInputChange} />
			<hr className='ml-20 mt-1'/>
		  </div>
        </label>
        <label className='ml-24 flex pb-2'>
          <div>
			<input className="bg-transparent ml-20" 
      type="number"
      name="budget"
      placeholder="Project Budget"
      value={projectDetails.budget}
      onChange={handleInputChange} />
			<hr className='ml-20 mt-1'/>
		  </div>
        </label>
        <label className='ml-24 flex'>
          <div>
			<input className="bg-transparent ml-20"
            type="text"
            name="treasury"
            placeholder="Treasury"
            value={projectDetails.treasury}
            onChange={handleInputChange} />
			<hr className='ml-20 mt-1'/>
		  </div>
        </label>
        <br />
        {/* <button className="text-black hover:text-white bg-green-400 p-1 hover:bg-green-800 rounded-xl mt-8 mb-4 h-10 w-[200px] ml-" type="button" onClick={handleSetBuilder}>
          Set Builder
        </button> */}
		<div className='flex justify-center ml-16'>
		<button className="shadow__btn ml-16" type="button" onClick={handleAllocateBudget}>
    		Allocate Budget
		</button >
		</div>
      </form>
	</div>
      )}
    </div>
  );
}

export default ProjectCreation;
