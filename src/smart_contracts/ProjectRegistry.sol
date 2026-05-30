// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ProjectRegistry
 * @notice Stores all government infrastructure project records.
 *         Only Finance Ministry role may create projects and assign actors.
 * @dev Part of the modular three-contract architecture (Thesis Revision v2).
 *      Addresses Reviewer Concerns 1, 2, 3, 5.
 */
contract ProjectRegistry is AccessControl {

    // ─────────────────────────────────────────────────
    //  Role definitions (Reviewer Concern 3)
    // ─────────────────────────────────────────────────
    bytes32 public constant FINANCE_MINISTRY_ROLE = keccak256("FINANCE_MINISTRY_ROLE");
    bytes32 public constant TREASURY_ROLE         = keccak256("TREASURY_ROLE");
    bytes32 public constant CITY_CORPORATION_ROLE = keccak256("CITY_CORPORATION_ROLE");
    bytes32 public constant BUILDER_ROLE          = keccak256("BUILDER_ROLE");

    // ─────────────────────────────────────────────────
    //  Contract version (Reviewer Concern 5)
    // ─────────────────────────────────────────────────
    uint256 public constant VERSION = 2;
    address public successorContract;   // set when contract is superseded

    // ─────────────────────────────────────────────────
    //  Data structures
    // ─────────────────────────────────────────────────
    struct ProjectDetails {
        string  projectID;
        string  projectName;
        string  projectArea;
        uint256 allocatedBudget;
        address financeMinistry;
        address treasury;
        address cityCorporation;
        address builder;
        uint256 createdAt;       // block timestamp
        bool    isActive;
    }

    mapping(string => ProjectDetails) public projects;
    string[] public allProjectIDs;

    // ─────────────────────────────────────────────────
    //  Events (Reviewer Concern 4 + 5)
    // ─────────────────────────────────────────────────

    /**
     * @dev Emitted when Finance Ministry registers a new project.
     *      Citizens and auditors can monitor this to track new spending commitments.
     */
    event ProjectCreated(
        string indexed projectID,
        string projectName,
        string projectArea,
        uint256 allocatedBudget,
        address indexed financeMinistry,
        address indexed treasury,
        uint256 timestamp
    );

    /**
     * @dev Emitted when budget is updated for an existing project.
     */
    event BudgetAllocated(
        string indexed projectID,
        uint256 oldBudget,
        uint256 newBudget,
        address indexed updatedBy,
        uint256 timestamp
    );

    /**
     * @dev Emitted when a City Corporation is formally assigned to a project.
     *      Marks the start of the implementation phase on-chain.
     */
    event CityCorporationAssigned(
        string indexed projectID,
        address indexed cityCorporation,
        address indexed assignedBy,
        uint256 timestamp
    );

    /**
     * @dev Emitted when a Builder is formally assigned to a project.
     *      Citizens can verify contractor identity before construction begins.
     */
    event BuilderAssigned(
        string indexed projectID,
        address indexed builder,
        address indexed assignedBy,
        uint256 timestamp
    );

    /**
     * @dev Emitted when this contract is superseded by a successor.
     */
    event SuccessorRegistered(address indexed successor, uint256 timestamp);

    // ─────────────────────────────────────────────────
    //  Constructor
    // ─────────────────────────────────────────────────
    constructor(address defaultAdmin) {
        // DEFAULT_ADMIN_ROLE can grant/revoke all other roles
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        // The deployer (Finance Ministry) gets the FM role automatically
        _grantRole(FINANCE_MINISTRY_ROLE, defaultAdmin);
    }

    // ─────────────────────────────────────────────────
    //  Write functions
    // ─────────────────────────────────────────────────

    /**
     * @notice Create a new project and allocate its approved budget.
     * @dev Only Finance Ministry may call. Replaces old ad-hoc `msg.sender` check.
     *      Reviewer Concern 1: Off-chain tender selection produces the _treasury
     *      address, which is then formally registered on-chain here — creating a
     *      clear documented boundary between off-chain and on-chain responsibilities.
     */
    function createProject(
        string memory _id,
        string memory _name,
        string memory _area,
        uint256 _budget,
        address _treasury
    ) external onlyRole(FINANCE_MINISTRY_ROLE) {
        require(bytes(_id).length > 0,              "Project ID required");
        require(bytes(projects[_id].projectID).length == 0, "Project ID already exists");
        require(_budget > 0,                        "Budget must be positive");
        require(_treasury != address(0),            "Invalid treasury address");

        projects[_id] = ProjectDetails({
            projectID:       _id,
            projectName:     _name,
            projectArea:     _area,
            allocatedBudget: _budget,
            financeMinistry: msg.sender,
            treasury:        _treasury,
            cityCorporation: address(0),
            builder:         address(0),
            createdAt:       block.timestamp,
            isActive:        true
        });

        allProjectIDs.push(_id);

        // Grant TREASURY_ROLE to the assigned treasury address
        _grantRole(TREASURY_ROLE, _treasury);

        emit ProjectCreated(_id, _name, _area, _budget, msg.sender, _treasury, block.timestamp);
    }

    /**
     * @notice Assign a City Corporation to an existing project.
     * @dev Only Finance Ministry may call.
     */
    function assignCityCorporation(
        string memory _id,
        address _cityCorporation
    ) external onlyRole(FINANCE_MINISTRY_ROLE) {
        require(bytes(projects[_id].projectID).length > 0, "Project does not exist");
        require(_cityCorporation != address(0), "Invalid address");
        require(projects[_id].isActive, "Project is not active");

        projects[_id].cityCorporation = _cityCorporation;

        // Grant CITY_CORPORATION_ROLE to the assigned address
        _grantRole(CITY_CORPORATION_ROLE, _cityCorporation);

        emit CityCorporationAssigned(_id, _cityCorporation, msg.sender, block.timestamp);
    }

    /**
     * @notice Assign a Builder to an existing project.
     * @dev Only Finance Ministry may call.
     *      Off-chain tender evaluation determines which builder wins;
     *      this function records that decision immutably on-chain.
     */
    function assignBuilder(
        string memory _id,
        address _builder
    ) external onlyRole(FINANCE_MINISTRY_ROLE) {
        require(bytes(projects[_id].projectID).length > 0, "Project does not exist");
        require(_builder != address(0), "Invalid address");
        require(projects[_id].isActive, "Project is not active");

        projects[_id].builder = _builder;

        // Grant BUILDER_ROLE to the assigned address
        _grantRole(BUILDER_ROLE, _builder);

        emit BuilderAssigned(_id, _builder, msg.sender, block.timestamp);
    }

    /**
     * @notice Update an existing project's budget (e.g., approved revision).
     * @dev Only Finance Ministry may call.
     */
    function updateBudget(
        string memory _id,
        uint256 _newBudget
    ) external onlyRole(FINANCE_MINISTRY_ROLE) {
        require(bytes(projects[_id].projectID).length > 0, "Project does not exist");
        require(_newBudget > 0, "Budget must be positive");

        uint256 oldBudget = projects[_id].allocatedBudget;
        projects[_id].allocatedBudget = _newBudget;

        emit BudgetAllocated(_id, oldBudget, _newBudget, msg.sender, block.timestamp);
    }

    /**
     * @notice Register the address of the upgraded successor contract.
     * @dev Only DEFAULT_ADMIN_ROLE. Part of lightweight versioning strategy.
     */
    function registerSuccessor(address _successor) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_successor != address(0), "Invalid successor");
        successorContract = _successor;
        emit SuccessorRegistered(_successor, block.timestamp);
    }

    // ─────────────────────────────────────────────────
    //  Read helpers (used by FundTransferManager)
    // ─────────────────────────────────────────────────

    function getProjectActors(string memory _id)
        external view
        returns (address treasury, address cityCorporation, address builder)
    {
        ProjectDetails storage p = projects[_id];
        return (p.treasury, p.cityCorporation, p.builder);
    }

    function getProjectBudget(string memory _id) external view returns (uint256) {
        return projects[_id].allocatedBudget;
    }

    function projectExists(string memory _id) external view returns (bool) {
        return bytes(projects[_id].projectID).length > 0;
    }

    function getTotalProjectCount() external view returns (uint256) {
        return allProjectIDs.length;
    }
}
