import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { YOUR_CONTRACT_ABI, YOUR_CONTRACT_ADDRESS } from "../config";

function InstallmentTransfer() {
  const [projectID, setProjectID] = useState("");
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
    } else if (e.target.name === "installmentAmount") {
      setInstallmentAmount(e.target.value);
    }
  };

  const handleTransferInstallment = async () => {
    try {
      if (!web3) {
        console.error("Web3 not initialized.");
        return;
      }

      if (!projectID || !installmentAmount) {
        console.error("Please fill in both Project ID and Installment Amount.");
        return;
      }

      if (!contract) {
        console.error("Contract not initialized.");
        return;
      }

      await contract.methods
        .sendInstallment(projectID, installmentAmount)
        .send({
          from: accounts[0],
          gas: 200000,
          value: installmentAmount, // Directly use the installmentAmount as the value
        });
      console.log("Amount Sent: ", installmentAmount);
      console.log("Installment transferred successfully!");
    } catch (error) {
      console.error("Error transferring installment:", error);
    }
  };

  // Remove number input spinner for all browsers
  const noSpinnerStyle = {
    MozAppearance: "textfield",
    appearance: "textfield",
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
          Transfer Installment
        </h2>
        <p className="mt-1 text-xs text-emerald-700/80 dark:text-slate-400">
          Transfer installment amount securely using a valid Project ID.
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

        {/* Installment Amount */}
        <div>
          <label
            htmlFor="installmentAmount"
            className="mb-2 block text-sm
        text-white"
          >
            Installment Amount
          </label>

          <div className="relative">
            <span
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3
          text-emerald-700/80 dark:text-slate-300 text-sm"
            >
              ৳
            </span>

            <input
              id="installmentAmount"
              type="text"
              inputMode="decimal"
              name="installmentAmount"
              placeholder="Enter amount"
              onChange={handleInputChange}
              className="w-full rounded-lg border bg-transparent pl-8 pr-4 py-2.5
            text-white placeholder-gray-400
            border-emerald-300 focus:outline-none
            focus:ring-2 focus:ring-emerald-400/50
            dark:border-slate-600"
              style={noSpinnerStyle}
              // Remove spinner for Chrome, Safari, Edge, Opera
              onWheel={(e) => e.target.blur()}
            />
          </div>

          <p className="mt-1 text-xs text-emerald-700/80 dark:text-slate-400">
            Amount in BDT. Decimals allowed.
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
            onClick={handleTransferInstallment}
            className="inline-flex items-center rounded-lg px-4 py-2 font-medium
          text-white transition-colors
          bg-emerald-600 hover:bg-emerald-500
          dark:bg-indigo-600 dark:hover:bg-indigo-500
          focus:outline-none focus:ring-2
          focus:ring-emerald-400/50 dark:focus:ring-indigo-400/50"
          >
            Transfer Installment
          </button>
        </div>
      </form>
    </div>
  );
}

export default InstallmentTransfer;
