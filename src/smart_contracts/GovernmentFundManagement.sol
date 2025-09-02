// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract GovernmentFundManagement {
    // Struct to store project details
    struct ProjectDetails {
        uint256 allocatedBudget;
        address financeMinistry;
        address treasury;
        address cityCorporation;
        address builder;
        string projectID;
        string projectName;
        string projectArea;
        uint256 installmentNumber;
    }

    // Mapping to store project details using project ID
    mapping(string => ProjectDetails) public projects;

    // List to store all project IDs
    string[] public allProjectIDs;

    // Mapping to keep track of fund transfers for each project
    mapping(string => uint256) public treasuryToCityCorporation;
    mapping(string => uint256) public cityCorporationToBuilder;

    // Function to allocate budget for a project
    function allocateBudget(
        uint256 _budget,
        string memory _id,
        string memory _name,
        string memory _area,
        address _treasury
    ) external {
        // Storing project details in the projects mapping
        projects[_id] = ProjectDetails({
            allocatedBudget: _budget,
            financeMinistry: msg.sender,
            treasury: _treasury,
            cityCorporation: address(0),
            builder: address(0),
            projectID: _id,
            projectName: _name,
            projectArea: _area,
            installmentNumber: 0
        });

        // Pushing the project ID to the list of all project IDs
        allProjectIDs.push(_id);
    }

    // Function to set the city corporation address for a project
    function setCityCorporation(string memory _id, address _cityCorporation) external {
        // Only the finance ministry can call this function
        require(projects[_id].financeMinistry == msg.sender, "Only finance ministry can call this function");

        projects[_id].cityCorporation = _cityCorporation;
    }

    // Function to set the builder address for a project
    function setBuilder(string memory _id, address _builder) external {
        // Only the finance ministry can call this function
        require(projects[_id].financeMinistry == msg.sender, "Only finance ministry can call this function");

        projects[_id].builder = _builder;
    }

    // Function to send installment from treasury to city corporation
    function sendInstallment(string memory _id, uint256 _amount) external payable  {
        // Only the treasury can call this function
        require(projects[_id].treasury == msg.sender, "Only treasury can call this function");
        // Checking if the allocated budget is not exceeded
        require(projects[_id].allocatedBudget >= _amount, "Exceeds allocated budget");
        // Checking if the total installments for the project is less than 3
        require(projects[_id].installmentNumber < 3, "Exceeds maximum installments");

        // Updating the installment number
        projects[_id].installmentNumber++;

        // Convert non-payable address to payable
        address payable cityCorporationPayable = payable(projects[_id].cityCorporation);

        // Transfer funds from treasury to city corporation
        cityCorporationPayable.transfer(_amount);

        // Tracking the fund transfer from treasury to city corporation
        treasuryToCityCorporation[_id] += _amount;
    }

    // Function to send funds from city corporation to builder
    function sendFundsToBuilder(string memory _id, uint256 _amount) external payable {
        // Only the city corporation can call this function
        require(projects[_id].cityCorporation == msg.sender, "Only city corporation can call this function");

        // Convert non-payable address to payable
        address payable builderPayable = payable(projects[_id].builder);

        // Transfer funds from city corporation to builder
        builderPayable.transfer(_amount);

        // Tracking the fund transfer from city corporation to builder
        cityCorporationToBuilder[_id] += _amount;
    }

    // Function to get the list of all projects, their allocated budget, and funds sent to their city corporations
    function getAllProjectDetails() public view returns (string[] memory, uint256[] memory, uint256[] memory) {
        uint256 length = allProjectIDs.length;

        string[] memory projectIDs = new string[](length);
        uint256[] memory allAllocatedBudgets = new uint256[](length);
        uint256[] memory allFundsSent = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            string memory projectId = allProjectIDs[i];
            projectIDs[i] = projects[projectId].projectID;
            allAllocatedBudgets[i] = projects[projectId].allocatedBudget;
            allFundsSent[i] = treasuryToCityCorporation[projectId];
        }
        return (projectIDs, allAllocatedBudgets, allFundsSent);
    }

}
