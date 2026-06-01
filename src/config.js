// src/config.js
// ─────────────────────────────────────────────────────────────────────────────
//  FIXED — FundTransferManager ABI constructor corrected
//
//  BUG: The FundTransferManager constructor in the Solidity is:
//    constructor(address _registry, address _defaultAdmin)
//  But the original ABI here only had one input: (address _registry).
//  This mismatch means the frontend may fail to call the contract correctly.
//
//  FIX: Added the missing _defaultAdmin constructor argument to the ABI.
//
//  Also added the missing `sendInstallment` function — the ABI had
//  `releaseInstallment` but your Solidity uses `sendInstallment`.
//
//  IMPORTANT: Replace CONTRACT_ADDRESSES values after each Remix deployment.
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
      { "internalType": "bytes32", "name": "role", "type": "bytes32" },
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "hasRole",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "role", "type": "bytes32" },
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "role", "type": "bytes32" },
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
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
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "allProjectIDs",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "name": "projects",
    "outputs": [
      { "internalType": "string",  "name": "projectID",       "type": "string" },
      { "internalType": "string",  "name": "projectName",     "type": "string" },
      { "internalType": "string",  "name": "projectArea",     "type": "string" },
      { "internalType": "uint256", "name": "allocatedBudget", "type": "uint256" },
      { "internalType": "address", "name": "financeMinistry", "type": "address" },
      { "internalType": "address", "name": "treasury",        "type": "address" },
      { "internalType": "address", "name": "cityCorporation", "type": "address" },
      { "internalType": "address", "name": "builder",         "type": "address" },
      { "internalType": "uint256", "name": "createdAt",       "type": "uint256" },
      { "internalType": "bool",    "name": "isActive",        "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// ─── FundTransferManager ABI ─────────────────────────────────────────────────
// FIXED: Constructor now has BOTH arguments matching the Solidity:
//   constructor(address _registry, address _defaultAdmin)
export const FUND_TRANSFER_MANAGER_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_registry",     "type": "address" },
      { "internalType": "address", "name": "_defaultAdmin", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
    "name": "sendInstallment",
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
      { "internalType": "uint256", "name": "toCC",             "type": "uint256" },
      { "internalType": "uint256", "name": "toBuilder",        "type": "uint256" },
      { "internalType": "uint256", "name": "numInstallments",  "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_INSTALLMENTS",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "role",    "type": "bytes32" },
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "hasRole",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "role",    "type": "bytes32" },
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// ─── TransparencyPortal ABI ──────────────────────────────────────────────────
export const TRANSPARENCY_PORTAL_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_registry",    "type": "address" },
      { "internalType": "address", "name": "_fundManager", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
    "name": "getProjectStatus",
    "outputs": [
      {
        "components": [
          { "internalType": "string",  "name": "projectID",          "type": "string" },
          { "internalType": "string",  "name": "projectName",        "type": "string" },
          { "internalType": "string",  "name": "projectArea",        "type": "string" },
          { "internalType": "bool",    "name": "isActive",           "type": "bool" },
          { "internalType": "bool",    "name": "hasCityCorporation", "type": "bool" },
          { "internalType": "bool",    "name": "hasBuilder",         "type": "bool" },
          { "internalType": "string",  "name": "phase",              "type": "string" },
          { "internalType": "uint256", "name": "createdAt",          "type": "uint256" }
        ],
        "internalType": "struct TransparencyPortal.ProjectStatus",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
    "name": "getProjectProgress",
    "outputs": [
      {
        "components": [
          { "internalType": "string",  "name": "projectID",             "type": "string" },
          { "internalType": "uint256", "name": "installmentsReleased",  "type": "uint256" },
          { "internalType": "uint256", "name": "maxInstallments",       "type": "uint256" },
          { "internalType": "uint256", "name": "percentFunded",         "type": "uint256" },
          { "internalType": "uint256", "name": "fundsReachedCC",        "type": "uint256" },
          { "internalType": "uint256", "name": "fundsReachedBuilder",   "type": "uint256" }
        ],
        "internalType": "struct TransparencyPortal.ProjectProgress",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
    "name": "getFundFlow",
    "outputs": [
      {
        "components": [
          { "internalType": "string",  "name": "projectID",          "type": "string" },
          { "internalType": "uint256", "name": "allocatedBudget",    "type": "uint256" },
          { "internalType": "uint256", "name": "releasedToCC",       "type": "uint256" },
          { "internalType": "uint256", "name": "forwardedToBuilder", "type": "uint256" },
          { "internalType": "uint256", "name": "pendingAtCC",        "type": "uint256" },
          { "internalType": "uint256", "name": "unreleasedBudget",   "type": "uint256" }
        ],
        "internalType": "struct TransparencyPortal.FundFlow",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
    "name": "getProjectParticipants",
    "outputs": [
      {
        "components": [
          { "internalType": "string",  "name": "projectID",      "type": "string" },
          { "internalType": "address", "name": "financeMinistry","type": "address" },
          { "internalType": "address", "name": "treasury",       "type": "address" },
          { "internalType": "address", "name": "cityCorporation","type": "address" },
          { "internalType": "address", "name": "builder",        "type": "address" }
        ],
        "internalType": "struct TransparencyPortal.ProjectParticipants",
        "name": "",
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
          { "internalType": "string",  "name": "projectID",       "type": "string" },
          { "internalType": "string",  "name": "projectName",     "type": "string" },
          { "internalType": "uint256", "name": "allocatedBudget", "type": "uint256" },
          { "internalType": "uint256", "name": "totalDisbursed",  "type": "uint256" },
          { "internalType": "uint256", "name": "totalUtilized",   "type": "uint256" },
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
// Replace these after each fresh Remix deployment
export const CONTRACT_ADDRESSES = {
  PROJECT_REGISTRY:      "0x8a12D261552664C768371846c171403A4B572dB9",
  FUND_TRANSFER_MANAGER: "0xCb2ccef7703A7DcdeBB88e6390cA48C872c47D75",
  TRANSPARENCY_PORTAL:   "0xE7B0229958184f012aFa0d630D6Ca0943E86433D"
};

export const YOUR_CONTRACT_ABI     = PROJECT_REGISTRY_ABI;
export const YOUR_CONTRACT_ADDRESS = CONTRACT_ADDRESSES.PROJECT_REGISTRY;
