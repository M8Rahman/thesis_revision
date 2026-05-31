// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./ProjectRegistry.sol";

/**
 * @title FundTransferManager
 * @notice Manages all fund movements for registered government projects.
 *         Treasury sends installments to City Corporation.
 *         City Corporation forwards funds to Builder.
 * @dev Part of the modular three-contract architecture (Thesis Revision v2).
 *      Addresses Reviewer Concerns 2, 3, 4.
 */
contract FundTransferManager is AccessControl {

    // ─────────────────────────────────────────────────
    //  Role definitions (mirror registry roles)
    // ─────────────────────────────────────────────────
    bytes32 public constant TREASURY_ROLE         = keccak256("TREASURY_ROLE");
    bytes32 public constant CITY_CORPORATION_ROLE = keccak256("CITY_CORPORATION_ROLE");
    uint256 public constant MAX_INSTALLMENTS = 3;
    uint256 public constant VERSION          = 2;
    address public successorContract;

    // ─────────────────────────────────────────────────
    //  Reference to ProjectRegistry
    // ─────────────────────────────────────────────────
    ProjectRegistry public immutable registry;

    // ─────────────────────────────────────────────────
    //  Fund tracking storage
    // ─────────────────────────────────────────────────
    mapping(string => uint256) public treasuryToCityCorporation;
    mapping(string => uint256) public cityCorporationToBuilder;
    mapping(string => uint256) public installmentCount;

    // ─────────────────────────────────────────────────
    //  Events
    // ─────────────────────────────────────────────────

    /**
     * @dev Emitted each time Treasury releases an installment to City Corporation.
     *      Citizens can verify that approved funds are actually moving.
     */
    event InstallmentReleased(
        string indexed projectID,
        address indexed treasury,
        address indexed cityCorporation,
        uint256 amount,
        uint256 installmentNumber,
        uint256 timestamp
    );

    /**
     * @dev Emitted each time City Corporation transfers funds to Builder.
     *      Provides the final leg of fund-flow transparency.
     */
    event FundsTransferred(
        string indexed projectID,
        address indexed cityCorporation,
        address indexed builder,
        uint256 amount,
        uint256 timestamp
    );

    /**
     * @dev Emitted when this contract is superseded.
     */
    event SuccessorRegistered(address indexed successor, uint256 timestamp);

    // ─────────────────────────────────────────────────
    //  Constructor
    // ─────────────────────────────────────────────────
    constructor(address _registry, address _defaultAdmin) {
        require(_registry != address(0), "Registry address required");
        registry = ProjectRegistry(_registry);
        _grantRole(DEFAULT_ADMIN_ROLE, _defaultAdmin);
    }

    // ─────────────────────────────────────────────────
    //  Write functions
    // ─────────────────────────────────────────────────

    /**
     * @notice Treasury sends an ETH installment to the assigned City Corporation.
     * @dev Caller must hold TREASURY_ROLE AND be the registered treasury for this project.
     *      msg.value is the amount transferred; _amount is used for the budget check.
     *      The two are kept separate so future gas-only calls can be differentiated.
     */
    function sendInstallment(string memory _id)
        external
        payable
        onlyRole(TREASURY_ROLE)
    {
        require(registry.projectExists(_id), "Project does not exist");

        (address treasury, address cityCorporation, ) = registry.getProjectActors(_id);

        require(msg.sender == treasury,          "Caller is not the registered treasury for this project");
        require(cityCorporation != address(0),   "City Corporation not yet assigned");
        require(msg.value > 0,                   "Must send ETH");

        uint256 budget      = registry.getProjectBudget(_id);
        uint256 totalSoFar  = treasuryToCityCorporation[_id] + msg.value;
        require(totalSoFar <= budget,             "Would exceed allocated budget");

        uint256 currentCount = installmentCount[_id];
        require(currentCount < MAX_INSTALLMENTS,  "Maximum installments reached");

        // Update state before transfer (checks-effects-interactions pattern)
        installmentCount[_id]++;
        treasuryToCityCorporation[_id] += msg.value;

        // Transfer ETH to City Corporation
        (bool success, ) = payable(cityCorporation).call{value: msg.value}("");
        require(success, "ETH transfer to City Corporation failed");

        emit InstallmentReleased(
            _id,
            msg.sender,
            cityCorporation,
            msg.value,
            installmentCount[_id],
            block.timestamp
        );
    }

    /**
     * @notice City Corporation forwards funds to the registered Builder.
     * @dev Caller must hold CITY_CORPORATION_ROLE AND be the registered CC for this project.
     */
    function sendFundsToBuilder(string memory _id)
        external
        payable
        onlyRole(CITY_CORPORATION_ROLE)
    {
        require(registry.projectExists(_id), "Project does not exist");

        (, address cityCorporation, address builder) = registry.getProjectActors(_id);

        require(msg.sender == cityCorporation, "Caller is not the registered City Corporation for this project");
        require(builder != address(0),         "Builder not yet assigned");
        require(msg.value > 0,                 "Must send ETH");

        // Checks-effects-interactions
        cityCorporationToBuilder[_id] += msg.value;

        (bool success, ) = payable(builder).call{value: msg.value}("");
        require(success, "ETH transfer to Builder failed");

        emit FundsTransferred(
            _id,
            msg.sender,
            builder,
            msg.value,
            block.timestamp
        );
    }

    // ─────────────────────────────────────────────────
    //  Upgradeability helper (Reviewer Concern 5)
    // ─────────────────────────────────────────────────

    /**
     * @notice Register the upgraded successor contract address.
     */
    function registerSuccessor(address _successor) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_successor != address(0), "Invalid successor");
        successorContract = _successor;
        emit SuccessorRegistered(_successor, block.timestamp);
    }

    // ─────────────────────────────────────────────────
    //  Read helpers (used by TransparencyPortal)
    // ─────────────────────────────────────────────────

    function getFundData(string memory _id)
        external view
        returns (
            uint256 toCC,
            uint256 toBuilder,
            uint256 numInstallments
        )
    {
        return (
            treasuryToCityCorporation[_id],
            cityCorporationToBuilder[_id],
            installmentCount[_id]
        );
    }
}
