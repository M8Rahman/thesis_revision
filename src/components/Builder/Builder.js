import React, { useState, useEffect } from "react";
import Web3 from "web3";
// import './Builder.css'
import { YOUR_CONTRACT_ABI, YOUR_CONTRACT_ADDRESS } from "../../config";

const Builder = () => {
  const [projectID, setProjectID] = useState("");
  const [builderAddress, setBuilderAddress] = useState("");
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
        const contractInstance = new web3Instance.eth.Contract(
          YOUR_CONTRACT_ABI,
          YOUR_CONTRACT_ADDRESS
        );
        setContract(contractInstance);
      } catch (error) {
        console.error("User denied account access:", error);
      }
    } else {
      console.error("MetaMask not found. Please install MetaMask.");
    }
  };

  const disconnectMetaMask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });
      } catch (error) {
        console.error("Error disconnecting MetaMask:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === "id") {
      setProjectID(e.target.value);
    } else if (e.target.name === "builderAddress") {
      setBuilderAddress(e.target.value);
    }
  };

  const handleSetBuilder = async () => {
    try {
      if (!web3) {
        console.error("Web3 not initialized.");
        return;
      }

      if (!projectID || !builderAddress) {
        console.error("Please fill in both Project ID and Builder Address.");
        return;
      }

      if (!contract) {
        console.error("Contract not initialized.");
        return;
      }

      await contract.methods
        .setBuilder(projectID, builderAddress)
        .send({ from: accounts[0] });

      console.log("Builder set successfully!");
    } catch (error) {
      console.error("Error setting Builder:", error);
    }
  };

  return (
    <div
      className="m-auto w-full max-w-xl rounded-xl border shadow-sm
  bg-white dark:bg-slate-800
  border-emerald-200/70 dark:border-slate-700"
    >
      {/* Header */}
      <div
        className="border-b px-6 py-4
      border-emerald-200/70 dark:border-slate-700"
      >
        <h2 className="text-xl font-semibold text-emerald-900 dark:text-slate-100">
          Set Builder
        </h2>
        <p className="mt-1 text-xs text-emerald-700/80 dark:text-slate-400">
          Assign a builder address to a project using a valid Project ID.
        </p>
      </div>

      {/* Form */}
      <form className="space-y-5 p-6 text-white" noValidate>
        {/* Project ID */}
        <div>
          <label
            htmlFor="projectId"
            className="mb-2 block text-sm 
        text-white"
          >
            Project ID
          </label>

          <div className="relative">
            <input
              id="projectId"
              type="text"
              name="id"
              placeholder="e.g. PRJ-2024-00123"
              onChange={handleInputChange}
              autoComplete="off"
              className="w-full rounded-lg border bg-transparent px-4 py-2.5
            text-white placeholder-gray-400 
            border-emerald-300 focus:outline-none
            focus:ring-2 focus:ring-emerald-400/50
            dark:border-slate-600"
            />
          </div>

          {/* optional helper / error slot */}
          <p className="mt-1 text-xs text-emerald-700/80 dark:text-slate-400">
            Use the official system-issued Project ID.
          </p>
        </div>

        {/* Builder Address */}
        <div>
          <label
            htmlFor="builderAddress"
            className="mb-2 block text-sm
        text-white"
          >
            Builder Address
          </label>

          <div className="relative">
            <input
              id="builderAddress"
              type="text"
              name="builderAddress"
              placeholder="Enter builder address"
              onChange={handleInputChange}
              className="w-full rounded-lg border bg-transparent px-4 py-2.5
            text-white placeholder-gray-400
            border-emerald-300 focus:outline-none
            focus:ring-2 focus:ring-emerald-400/50
            dark:border-slate-600"
            />
          </div>

          <p className="mt-1 text-xs text-emerald-700/80 dark:text-slate-400">
            Enter the wallet address of the builder.
          </p>
        </div>

        {/* Divider */}
        <div
          className="border-t pt-4
      border-emerald-200/70 dark:border-slate-700"
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleSetBuilder}
            className="inline-flex items-center rounded-lg px-4 py-2 font-medium
          text-white transition-colors
          bg-emerald-600 hover:bg-emerald-500
          dark:bg-indigo-600 dark:hover:bg-indigo-500
          focus:outline-none focus:ring-2
          focus:ring-emerald-400/50 dark:focus:ring-indigo-400/50"
          >
            Set Builder
          </button>
        </div>
      </form>
    </div>
  );
};

export default Builder;
