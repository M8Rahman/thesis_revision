// contractConfig.js
export const YOUR_CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "allProjectIDs",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_budget",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_area",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_treasury",
				"type": "address"
			}
		],
		"name": "allocateBudget",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "cityCorporationToBuilder",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllProjectDetails",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "projectID",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "financeMinistry",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "treasury",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "cityCorporation",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "builder",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "projectName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "projectArea",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "allocatedBudget",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "fundsSentToCityCorporation",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "fundsSentToBuilder",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "installmentNumber",
						"type": "uint256"
					}
				],
				"internalType": "struct GovernmentFundManagement.ProjectSummary[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "projects",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "allocatedBudget",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "financeMinistry",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "treasury",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "cityCorporation",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "builder",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "projectID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "projectName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "projectArea",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "installmentNumber",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "sendFundsToBuilder",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "sendInstallment",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_builder",
				"type": "address"
			}
		],
		"name": "setBuilder",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "_cityCorporation",
				"type": "address"
			}
		],
		"name": "setCityCorporation",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "treasuryToCityCorporation",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
  
  export const YOUR_CONTRACT_ADDRESS = '0x67b7A967AA6B8B9C41069Cd945e55660C8730769'; // Your contract address
  
  