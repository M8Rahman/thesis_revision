// ─────────────────────────────────────────────────────────────────────────────
//  config.js  — Contract ABIs and Addresses
//  REVISED for Thesis v2 (three-contract modular architecture)
//  Replace YOUR_*_ADDRESS values after each truffle migrate run.
// ─────────────────────────────────────────────────────────────────────────────

// ─── ProjectRegistry ABI ─────────────────────────────────────────────────────
export const PROJECT_REGISTRY_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "defaultAdmin", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "FINANCE_MINISTRY_ROLE",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "TREASURY_ROLE",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "CITY_CORPORATION_ROLE",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "BUILDER_ROLE",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_id", "type": "string" },
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_area", "type": "string" },
      { "internalType": "uint256", "name": "_budget", "type": "uint256" },
      { "internalType": "address", "name": "_treasury", "type": "address" }
    ],
    "name": "createProject",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_id", "type": "string" },
      { "internalType": "address", "name": "_cc", "type": "address" }
    ],
    "name": "assignCityCorporation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_id", "type": "string" },
      { "internalType": "address", "name": "_builder", "type": "address" }
    ],
    "name": "assignBuilder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
    "name": "getProjectActors",
    "outputs": [
      { "internalType": "address", "name": "treasury", "type": "address" },
      { "internalType": "address", "name": "cityCorporation", "type": "address" },
      { "internalType": "address", "name": "builder", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
    "name": "getProjectBudget",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
    "name": "projectExists",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalProjectCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// ─── FundTransferManager ABI ─────────────────────────────────────────────────
export const FUND_TRANSFER_MANAGER_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "_registry", "type": "address" }],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
    "name": "releaseInstallment",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
    "name": "sendFundsToBuilder",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
    "name": "getFundData",
    "outputs": [
      { "internalType": "uint256", "name": "toCC", "type": "uint256" },
      { "internalType": "uint256", "name": "toBuilder", "type": "uint256" },
      { "internalType": "uint256", "name": "numInstallments", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// ─── TransparencyPortal ABI ──────────────────────────────────────────────────
export const TRANSPARENCY_PORTAL_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_registry", "type": "address" },
      { "internalType": "address", "name": "_fundManager", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
    "name": "getProjectCompleteDetails",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "projectID", "type": "string" },
          { "internalType": "string", "name": "projectName", "type": "string" },
          { "internalType": "string", "name": "projectArea", "type": "string" },
          { "internalType": "bool", "name": "isActive", "type": "bool" },
          { "internalType": "bool", "name": "hasCityCorporation", "type": "bool" },
          { "internalType": "bool", "name": "hasBuilder", "type": "bool" },
          { "internalType": "string", "name": "phase", "type": "string" },
          { "internalType": "uint256", "name": "createdAt", "type": "uint256" }
        ],
        "internalType": "struct TransparencyPortal.ProjectStatus",
        "name": "status",
        "type": "tuple"
      },
      {
        "components": [
          { "internalType": "string", "name": "projectID", "type": "string" },
          { "internalType": "uint256", "name": "installmentsReleased", "type": "uint256" },
          { "internalType": "uint256", "name": "maxInstallments", "type": "uint256" },
          { "internalType": "uint256", "name": "percentFunded", "type": "uint256" },
          { "internalType": "uint256", "name": "fundsReachedCC", "type": "uint256" },
          { "internalType": "uint256", "name": "fundsReachedBuilder", "type": "uint256" }
        ],
        "internalType": "struct TransparencyPortal.ProjectProgress",
        "name": "progress",
        "type": "tuple"
      },
      {
        "components": [
          { "internalType": "string", "name": "projectID", "type": "string" },
          { "internalType": "uint256", "name": "allocatedBudget", "type": "uint256" },
          { "internalType": "uint256", "name": "totalDisbursed", "type": "uint256" },
          { "internalType": "uint256", "name": "totalUtilized", "type": "uint256" },
          { "internalType": "uint256", "name": "unutilizedTreasuryFunds", "type": "uint256" },
          { "internalType": "uint256", "name": "ccHoldingFunds", "type": "uint256" }
        ],
        "internalType": "struct TransparencyPortal.FundFlow",
        "name": "flow",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllProjectSummaries",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "projectID", "type": "string" },
          { "internalType": "string", "name": "projectName", "type": "string" },
          { "internalType": "uint256", "name": "allocatedBudget", "type": "uint256" },
          { "internalType": "uint256", "name": "totalDisbursed", "type": "uint256" },
          { "internalType": "uint256", "name": "totalUtilized", "type": "uint256" },
          { "internalType": "uint256", "name": "utilizationRate", "type": "uint256" }
        ],
        "internalType": "struct TransparencyPortal.ProjectFinancialSummary[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// ─── Contract Addresses ───────────────────────────────────────────────────────
// Replace these local hex hashes following your local deployment execution
export const CONTRACT_ADDRESSES = {
  PROJECT_REGISTRY:      "YOUR_PROJECT_REGISTRY_ADDRESS",
  FUND_TRANSFER_MANAGER: "YOUR_FUND_TRANSFER_MANAGER_ADDRESS",
  TRANSPARENCY_PORTAL:   "YOUR_TRANSPARENCY_PORTAL_ADDRESS"
};

export const YOUR_CONTRACT_ABI     = PROJECT_REGISTRY_ABI;
export const YOUR_CONTRACT_ADDRESS = CONTRACT_ADDRESSES.PROJECT_REGISTRY;