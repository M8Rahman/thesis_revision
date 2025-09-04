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
      className={`
        m-auto w-full max-w-xl rounded-b-3xl border shadow-2xl
        bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-slate-700/50
        dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 dark:border-slate-700/50
        light:bg-gradient-to-br light:from-white light:via-emerald-50 light:to-emerald-100 light:border-emerald-200
      `}
    >
      {/* Header */}
      <div
        className={`
          border-b px-8 py-6 
          bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border-slate-700/50
          dark:bg-gradient-to-r dark:from-cyan-500/10 dark:to-purple-600/10 dark:border-slate-700/50
          light:bg-gradient-to-r light:from-emerald-100 light:to-emerald-50 light:border-emerald-200 space-y-4
        `}
      >
        <h2 className="text-white text-2xl font-semibold">Set Builder</h2>
        <p className="text-white">
          Assign a builder address to a project using a valid Project ID.
        </p>
      </div>

      {/* Form */}
      <form
        className="space-y-7 p-8 text-white dark:text-white light:text-emerald-900"
        noValidate
      >
        {/* Project ID */}
        <div>
          <label htmlFor="projectId" className="text-white text-lg block mb-4">
            Project ID
          </label>

          <div className="relative mb-2">
            <input
              id="projectId"
              type="text"
              name="id"
              placeholder="e.g. PRJ-2024-00123"
              onChange={handleInputChange}
              autoComplete="off"
              className={`
                w-full rounded-lg border px-4 py-3 transition-all duration-200
                bg-slate-900/60 text-white placeholder-cyan-200/60 border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 dark:border-slate-600
                dark:bg-slate-900/60 dark:text-white dark:placeholder-cyan-200/60 dark:border-cyan-400/60 dark:focus:ring-cyan-400/40
                light:bg-white light:text-emerald-900 light:placeholder-emerald-400/60 light:border-emerald-300 light:focus:ring-emerald-200/60
              `}
            />
          </div>

          {/* optional helper / error slot */}
          <p className="mt-1 ml-0.5 text-xs text-white">
            Use the official system-issued Project ID.
          </p>
        </div>

        {/* Builder Address */}
        <div>
          <label
            htmlFor="builderAddress"
            className="text-white text-lg block mb-4"
          >
            Builder Address
          </label>

          <div className="relative mb-2">
            <input
              id="builderAddress"
              type="text"
              name="builderAddress"
              placeholder="Enter builder address"
              onChange={handleInputChange}
              className={`
                w-full rounded-lg border px-4 py-3 transition-all duration-200
                bg-slate-900/60 text-white placeholder-cyan-200/60 border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 dark:border-slate-600
                dark:bg-slate-900/60 dark:text-white dark:placeholder-cyan-200/60 dark:border-cyan-400/60 dark:focus:ring-cyan-400/40
                light:bg-white light:text-emerald-900 light:placeholder-emerald-400/60 light:border-emerald-300 light:focus:ring-emerald-200/60
              `}
            />
          </div>

          <p className="mt-1 ml-0.5 text-xs text-white">
            Enter the wallet address of the builder.
          </p>
        </div>

        {/* Divider */}
        <div
          className={`border-t pt-4 border-slate-700/50 dark:border-slate-700/50 light:border-emerald-200`}
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleSetBuilder}
            className={`
              inline-flex items-center rounded-lg px-5 py-2.5 font-semibold transition-all duration-200
              bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white
              focus:outline-none focus:ring-2 focus:ring-cyan-400/50 shadow-lg shadow-cyan-500/10
              dark:bg-gradient-to-r dark:from-cyan-500 dark:to-purple-600 dark:hover:from-cyan-400 dark:hover:to-purple-500 dark:text-white dark:focus:ring-cyan-400/50
              light:bg-gradient-to-r light:from-emerald-400 light:to-emerald-600 light:hover:from-emerald-300 light:hover:to-emerald-500 light:text-emerald-900 light:focus:ring-emerald-300/50
            `}
          >
            Set Builder
          </button>
        </div>
      </form>
    </div>
  );
};

export default Builder;
