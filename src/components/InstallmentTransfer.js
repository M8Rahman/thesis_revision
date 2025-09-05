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

  const noSpinnerStyle = {
    MozAppearance: "textfield",
    appearance: "textfield",
  };

  return (
    <div
      className="
        m-auto w-full max-w-xl rounded-b-3xl border shadow-2xl
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
          light:bg-gradient-to-r light:from-emerald-100 light:to-emerald-50 light:border-emerald-200 space-y-4
        "
      >
        <h2 className="text-white text-2xl font-semibold">
          Transfer Installment
        </h2>
        <p className="text-white">
          Transfer installment amount securely using a valid Project ID.
        </p>
      </div>

      {/* Form */}
      <form
        className="
          space-y-7 p-8
          text-white dark:text-white
          light:text-emerald-900"
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
              className="
                w-full rounded-lg border px-4 py-3 transition-all duration-200
                bg-slate-900/60 text-white placeholder-cyan-200/60 border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 dark:border-slate-600
                dark:bg-slate-900/60 dark:text-white dark:placeholder-cyan-200/60 dark:border-cyan-400/60 dark:focus:ring-cyan-400/40
                light:bg-white light:text-emerald-900 light:placeholder-emerald-400/60 light:border-emerald-300 light:focus:ring-emerald-200/60
              "
            />
          </div>

          <p className="mt-1 ml-0.5 text-xs text-white">
            Use the official system-issued Project ID.
          </p>
        </div>

        <div>
          <label
            htmlFor="installmentAmount"
            className="text-white text-lg block mb-4"
          >
            Installment Amount
          </label>

          <div className="relative mb-2">
            <span
              className="
                pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-base
                text-cyan-300/80 dark:text-cyan-300/80
                light:text-emerald-600/80
              "
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
              className="
                w-full rounded-lg border pl-8 pr-4 py-3 transition-all duration-200
                bg-slate-900/60 text-white placeholder-cyan-200/60 border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 dark:border-slate-600
                dark:bg-slate-900/60 dark:text-white dark:placeholder-cyan-200/60 dark:border-cyan-400/60 dark:focus:ring-cyan-400/40
                light:bg-white light:text-emerald-900 light:placeholder-emerald-400/60 light:border-emerald-300 light:focus:ring-emerald-200/60
              "
              style={noSpinnerStyle}
              onWheel={(e) => e.target.blur()}
            />
          </div>

          <p className=" mt-1 ml-0.5 text-xs text-white">
            Amount in BDT. Decimals allowed.
          </p>
        </div>

        <div className="border-t pt-4 border-slate-700/50 dark:border-slate-700/50 light:border-emerald-2" />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleTransferInstallment}
            className="
              inline-flex items-center rounded-lg px-5 py-2.5 font-semibold transition-all duration-200
              bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white
              focus:outline-none focus:ring-2 focus:ring-cyan-400/50 shadow-lg shadow-cyan-500/10
              dark:bg-gradient-to-r dark:from-cyan-500 dark:to-purple-600 dark:hover:from-cyan-400 dark:hover:to-purple-500 dark:text-white dark:focus:ring-cyan-400/50
            "
          >
            Transfer Installment
          </button>
        </div>
      </form>
    </div>
  );
}

export default InstallmentTransfer;
