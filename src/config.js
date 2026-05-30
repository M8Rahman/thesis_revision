// ─────────────────────────────────────────────────────────────────────────────
//  config.js  — Contract ABIs and Addresses
//  REVISED for Thesis v2 (three-contract modular architecture)
//  Replace YOUR_*_ADDRESS values after each truffle migrate run.
// ─────────────────────────────────────────────────────────────────────────────

// ─── ProjectRegistry ABI ─────────────────────────────────────────────────────
export const PROJECT_REGISTRY_ABI = [
  // Constructor
  { "inputs": [{ "internalType": "address", "name": "defaultAdmin", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" },

  // Role constants
  { "inputs": [], "name": "FINANCE_MINISTRY_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "TREASURY_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "CITY_CORPORATION_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "BUILDER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "VERSION", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "successorContract", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },

  // Role management (AccessControl)
  { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "hasRole", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" },

  // Write functions
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
      { "internalType": "address", "name": "_cityCorporation", "type": "address" }
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
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }, { "internalType": "uint256", "name": "_newBudget", "type": "uint256" }],
    "name": "updateBudget",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_successor", "type": "address" }],
    "name": "registerSuccessor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // View functions
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
  { "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }], "name": "getProjectBudget", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }], "name": "projectExists", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "getTotalProjectCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "allProjectIDs", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
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
  },

  // Events
  { "anonymous": false, "inputs": [{ "indexed": true, "name": "projectID", "type": "string" }, { "indexed": false, "name": "projectName", "type": "string" }, { "indexed": false, "name": "projectArea", "type": "string" }, { "indexed": false, "name": "allocatedBudget", "type": "uint256" }, { "indexed": true, "name": "financeMinistry", "type": "address" }, { "indexed": true, "name": "treasury", "type": "address" }, { "indexed": false, "name": "timestamp", "type": "uint256" }], "name": "ProjectCreated", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "name": "projectID", "type": "string" }, { "indexed": false, "name": "oldBudget", "type": "uint256" }, { "indexed": false, "name": "newBudget", "type": "uint256" }, { "indexed": true, "name": "updatedBy", "type": "address" }, { "indexed": false, "name": "timestamp", "type": "uint256" }], "name": "BudgetAllocated", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "name": "projectID", "type": "string" }, { "indexed": true, "name": "cityCorporation", "type": "address" }, { "indexed": true, "name": "assignedBy", "type": "address" }, { "indexed": false, "name": "timestamp", "type": "uint256" }], "name": "CityCorporationAssigned", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "name": "projectID", "type": "string" }, { "indexed": true, "name": "builder", "type": "address" }, { "indexed": true, "name": "assignedBy", "type": "address" }, { "indexed": false, "name": "timestamp", "type": "uint256" }], "name": "BuilderAssigned", "type": "event" }
];

// ─── FundTransferManager ABI ──────────────────────────────────────────────────
export const FUND_TRANSFER_MANAGER_ABI = [
  { "inputs": [{ "internalType": "address", "name": "_registry", "type": "address" }, { "internalType": "address", "name": "_defaultAdmin", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" },
  { "inputs": [], "name": "TREASURY_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "CITY_CORPORATION_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "MAX_INSTALLMENTS", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "VERSION", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "registry", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "hasRole", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
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
  { "inputs": [{ "internalType": "address", "name": "_successor", "type": "address" }], "name": "registerSuccessor", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
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
  },
  { "inputs": [{ "internalType": "string", "name": "", "type": "string" }], "name": "treasuryToCityCorporation", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "string", "name": "", "type": "string" }], "name": "cityCorporationToBuilder", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "string", "name": "", "type": "string" }], "name": "installmentCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "anonymous": false, "inputs": [{ "indexed": true, "name": "projectID", "type": "string" }, { "indexed": true, "name": "treasury", "type": "address" }, { "indexed": true, "name": "cityCorporation", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "installmentNumber", "type": "uint256" }, { "indexed": false, "name": "timestamp", "type": "uint256" }], "name": "InstallmentReleased", "type": "event" },
  { "anonymous": false, "inputs": [{ "indexed": true, "name": "projectID", "type": "string" }, { "indexed": true, "name": "cityCorporation", "type": "address" }, { "indexed": true, "name": "builder", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "timestamp", "type": "uint256" }], "name": "FundsTransferred", "type": "event" }
];

// ─── TransparencyPortal ABI ───────────────────────────────────────────────────
export const TRANSPARENCY_PORTAL_ABI = [
  { "inputs": [{ "internalType": "address", "name": "_registry", "type": "address" }, { "internalType": "address", "name": "_fundManager", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" },
  { "inputs": [], "name": "registry", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "fundManager", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  {
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
    "name": "getProjectStatus",
    "outputs": [{
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
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
    "name": "getProjectProgress",
    "outputs": [{
      "components": [
        { "internalType": "string", "name": "projectID", "type": "string" },
        { "internalType": "uint256", "name": "installmentsReleased", "type": "uint256" },
        { "internalType": "uint256", "name": "maxInstallments", "type": "uint256" },
        { "internalType": "uint256", "name": "percentFunded", "type": "uint256" },
        { "internalType": "uint256", "name": "fundsReachedCC", "type": "uint256" },
        { "internalType": "uint256", "name": "fundsReachedBuilder", "type": "uint256" }
      ],
      "internalType": "struct TransparencyPortal.ProjectProgress",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
    "name": "getFundFlow",
    "outputs": [{
      "components": [
        { "internalType": "string", "name": "projectID", "type": "string" },
        { "internalType": "uint256", "name": "allocatedBudget", "type": "uint256" },
        { "internalType": "uint256", "name": "releasedToCC", "type": "uint256" },
        { "internalType": "uint256", "name": "forwardedToBuilder", "type": "uint256" },
        { "internalType": "uint256", "name": "pendingAtCC", "type": "uint256" },
        { "internalType": "uint256", "name": "unreleasedBudget", "type": "uint256" }
      ],
      "internalType": "struct TransparencyPortal.FundFlow",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
    "name": "getProjectFinancialSummary",
    "outputs": [{
      "components": [
        { "internalType": "string", "name": "projectID", "type": "string" },
        { "internalType": "string", "name": "projectName", "type": "string" },
        { "internalType": "uint256", "name": "allocatedBudget", "type": "uint256" },
        { "internalType": "uint256", "name": "totalDisbursed", "type": "uint256" },
        { "internalType": "uint256", "name": "totalUtilized", "type": "uint256" },
        { "internalType": "uint256", "name": "utilizationRate", "type": "uint256" }
      ],
      "internalType": "struct TransparencyPortal.ProjectFinancialSummary",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_id", "type": "string" }],
    "name": "getProjectParticipants",
    "outputs": [{
      "components": [
        { "internalType": "string", "name": "projectID", "type": "string" },
        { "internalType": "address", "name": "financeMinistry", "type": "address" },
        { "internalType": "address", "name": "treasury", "type": "address" },
        { "internalType": "address", "name": "cityCorporation", "type": "address" },
        { "internalType": "address", "name": "builder", "type": "address" }
      ],
      "internalType": "struct TransparencyPortal.ProjectParticipants",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllProjectSummaries",
    "outputs": [{
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
    }],
    "stateMutability": "view",
    "type": "function"
  }
];

// ─── Contract Addresses ───────────────────────────────────────────────────────
// Replace these after each `truffle migrate` run.
export const CONTRACT_ADDRESSES = {
  PROJECT_REGISTRY:      "YOUR_PROJECT_REGISTRY_ADDRESS",
  FUND_TRANSFER_MANAGER: "YOUR_FUND_TRANSFER_MANAGER_ADDRESS",
  TRANSPARENCY_PORTAL:   "YOUR_TRANSPARENCY_PORTAL_ADDRESS",
};

// ─── Legacy export (backward compat with existing components) ─────────────────
// Remove after all components are migrated to the new contracts.
export const YOUR_CONTRACT_ABI     = PROJECT_REGISTRY_ABI;
export const YOUR_CONTRACT_ADDRESS = CONTRACT_ADDRESSES.PROJECT_REGISTRY;
