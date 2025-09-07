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
    <div className="w-full max-w-xl mx-auto">
      {!isConnected ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <button
            className="inline-flex items-center rounded-lg px-5 py-2.5 font-semibold transition-all duration-200
                    bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white
                    focus:outline-none focus:ring-2 focus:ring-cyan-400/50 shadow-lg shadow-cyan-500/10"
            type="button"
            onClick={() => setIsConnected(true)}
          >
            Connect to MetaMask
          </button>
        </div>
      ) : (
        <div
          className="
            m-auto w-full rounded-b-3xl border shadow-2xl
            bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-slate-700/50
            dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 dark:border-slate-700/50
            light:bg-gradient-to-br light:from-white light:via-emerald-50 light:to-emerald-100 light:border-emerald-200
          "
        >
          {/* Header */}
          <div
            className="
              border-b px-8 py-6
              bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border-slate-700/50
              dark:bg-gradient-to-r dark:from-cyan-500/10 dark:to-purple-600/10 dark:border-slate-700/50
              light:bg-gradient-to-r light:from-emerald-100 light:to-emerald-50 light:border-emerald-200 space-y-1
            "
          >
            <h2 className="text-white text-2xl font-semibold">Create / Allocate Project Budget</h2>
            <p className="text-white/80 text-sm">
              Provide project details and allocate budget to the selected treasury.
            </p>
          </div>

          {/* Form body */}
          <div className="p-8">
            <form>
              {/* Project ID */}
              <div className="mb-6">
                <label htmlFor="id" className="text-white text-lg block mb-4">
                  Project ID
                </label>
                <div className="relative">
                  <input
                    className="
                      w-full rounded-lg border px-4 py-3 transition-all duration-200
                      bg-slate-900/60 text-white placeholder-cyan-200/60 border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40
                    "
                    id="id"
                    type="text"
                    name="id"
                    placeholder="Project ID"
                    value={projectDetails.id}
                    onChange={handleInputChange}
                  />
                </div>
                <p className="mt-1 text-xs text-white/70">Use official system-issued ID (e.g., PRJ-2025-0001).</p>
              </div>

              {/* Project Name */}
              <div className="mb-6">
                <label htmlFor="name" className="text-white text-lg block mb-4">
                  Project Name
                </label>
                <input
                  className="
                    w-full rounded-lg border px-4 py-3 transition-all duration-200
                    bg-slate-900/60 text-white placeholder-cyan-200/60 border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40
                  "
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Project Name"
                  value={projectDetails.name}
                  onChange={handleInputChange}
                />
              </div>

              {/* Project Area */}
              <div className="mb-6">
                <label htmlFor="area" className="text-white text-lg block mb-4">
                  Project Area
                </label>
                <input
                  className="
                    w-full rounded-lg border px-4 py-3 transition-all duration-200
                    bg-slate-900/60 text-white placeholder-cyan-200/60 border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40
                  "
                  id="area"
                  type="text"
                  name="area"
                  placeholder="Project Area"
                  value={projectDetails.area}
                  onChange={handleInputChange}
                />
              </div>

              {/* Project Budget */}
              <div className="mb-6">
                <label htmlFor="budget" className="text-white text-lg block mb-4">
                  Project Budget
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-base text-cyan-300/80">
                    ৳
                  </span>
                  <input
                    className="
                      w-full rounded-lg border pl-8 pr-4 py-3 transition-all duration-200
                      bg-slate-900/60 text-white placeholder-cyan-200/60 border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40
                    "
                    id="budget"
                    type="number"
                    name="budget"
                    placeholder="Project Budget"
                    value={projectDetails.budget}
                    onChange={handleInputChange}
                  />
                </div>
                <p className="mt-1 text-xs text-white/70">Amount in BDT. Integers only (as per your current logic).</p>
              </div>

              {/* Treasury */}
              <div className="mb-8">
                <label htmlFor="treasury" className="text-white text-lg block mb-4">
                  Treasury
                </label>
                <input
                  className="
                    w-full rounded-lg border px-4 py-3 transition-all duration-200
                    bg-slate-900/60 text-white placeholder-cyan-200/60 border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40
                  "
                  id="treasury"
                  type="text"
                  name="treasury"
                  placeholder="Treasury"
                  value={projectDetails.treasury}
                  onChange={handleInputChange}
                />
              </div>

              {/* Divider */}
              <div className="border-t border-slate-700/50 pt-4 mb-6" />

              {/* Actions */}
              <div className="flex items-center justify-end">
                <button
                  className="
                    inline-flex items-center rounded-lg px-5 py-2.5 font-semibold transition-all duration-200
                    bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white
                    focus:outline-none focus:ring-2 focus:ring-cyan-400/50 shadow-lg shadow-cyan-500/10
                  "
                  type="button"
                  onClick={handleAllocateBudget}
                >
                  Allocate Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectCreation;
