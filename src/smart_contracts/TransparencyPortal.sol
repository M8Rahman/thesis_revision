// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ProjectRegistry.sol";
import "./FundTransferManager.sol";

/**
 * @title TransparencyPortal
 * @notice Read-only public façade for citizens, auditors, and journalists.
 *         All functions are `view` — zero gas cost when called off-chain.
 *         No state changes. Can be redeployed freely to reference new
 *         registry/fund manager versions without migrating data.
 * @dev Addresses Reviewer Concern 4 (public transparency functions).
 */
contract TransparencyPortal {

    ProjectRegistry     public immutable registry;
    FundTransferManager public immutable fundManager;

    // ─────────────────────────────────────────────────
    //  Return structs for rich, readable outputs
    // ─────────────────────────────────────────────────

    struct ProjectStatus {
        string  projectID;
        string  projectName;
        string  projectArea;
        bool    isActive;
        bool    hasCityCorporation;
        bool    hasBuilder;
        string  phase;          // "Planned" | "Assigned" | "In Progress" | "Complete"
        uint256 createdAt;
    }

    struct ProjectProgress {
        string  projectID;
        uint256 installmentsReleased;
        uint256 maxInstallments;
        uint256 percentFunded;      // 0–100
        uint256 fundsReachedCC;     // total ETH sent treasury→CC
        uint256 fundsReachedBuilder;// total ETH sent CC→builder
    }

    struct FundFlow {
        string  projectID;
        uint256 allocatedBudget;
        uint256 releasedToCC;
        uint256 forwardedToBuilder;
        uint256 pendingAtCC;        // releasedToCC - forwardedToBuilder
        uint256 unreleasedBudget;   // allocatedBudget - releasedToCC
    }

    struct ProjectFinancialSummary {
        string  projectID;
        string  projectName;
        uint256 allocatedBudget;
        uint256 totalDisbursed;     // releasedToCC
        uint256 totalUtilized;      // forwardedToBuilder
        uint256 utilizationRate;    // totalUtilized * 100 / allocatedBudget
    }

    struct ProjectParticipants {
        string  projectID;
        address financeMinistry;
        address treasury;
        address cityCorporation;
        address builder;
    }

    // ─────────────────────────────────────────────────
    //  Constructor
    // ─────────────────────────────────────────────────

    constructor(address _registry, address _fundManager) {
        require(_registry   != address(0), "Registry required");
        require(_fundManager != address(0), "FundManager required");
        registry    = ProjectRegistry(_registry);
        fundManager = FundTransferManager(_fundManager);
    }

    // ─────────────────────────────────────────────────
    //  Transparency Functions (Reviewer Concern 4)
    // ─────────────────────────────────────────────────

    /**
     * @notice Returns a human-readable status summary for a project.
     * @dev Gas-free when called via eth_call. Suitable for citizen monitoring portals.
     */
    function getProjectStatus(string memory _id)
        external view
        returns (ProjectStatus memory)
    {
        (string memory pid, string memory name, string memory area, ) = _loadProjectInfo(_id);
        (,, address cc, address builder, uint256 createdAt, bool isActive) = _loadProjectActors(_id);

        string memory phase = _derivePhase(cc, builder);

        return ProjectStatus({
            projectID:          pid,
            projectName:        name,
            projectArea:        area,
            isActive:           isActive,
            hasCityCorporation: cc != address(0),
            hasBuilder:         builder != address(0),
            phase:              phase,
            createdAt:          createdAt
        });
    }

    /**
     * @notice Returns installment progress and funding percentages.
     */
    function getProjectProgress(string memory _id)
        external view
        returns (ProjectProgress memory)
    {
        require(registry.projectExists(_id), "Project not found");

        uint256 budget                     = registry.getProjectBudget(_id);
        (uint256 toCC, uint256 toBuilder, uint256 numInst) = fundManager.getFundData(_id);

        uint256 pct = budget > 0 ? (toCC * 100) / budget : 0;

        return ProjectProgress({
            projectID:              _id,
            installmentsReleased:   numInst,
            maxInstallments:        fundManager.MAX_INSTALLMENTS(),
            percentFunded:          pct,
            fundsReachedCC:         toCC,
            fundsReachedBuilder:    toBuilder
        });
    }

    /**
     * @notice Returns a full fund-flow breakdown for auditors.
     */
    function getFundFlow(string memory _id)
        external view
        returns (FundFlow memory)
    {
        require(registry.projectExists(_id), "Project not found");

        uint256 budget = registry.getProjectBudget(_id);
        (uint256 toCC, uint256 toBuilder, ) = fundManager.getFundData(_id);

        return FundFlow({
            projectID:          _id,
            allocatedBudget:    budget,
            releasedToCC:       toCC,
            forwardedToBuilder: toBuilder,
            pendingAtCC:        toCC > toBuilder ? toCC - toBuilder : 0,
            unreleasedBudget:   budget > toCC    ? budget - toCC    : 0
        });
    }

    /**
     * @notice Returns a financial summary suitable for dashboard tables.
     */
    function getProjectFinancialSummary(string memory _id)
        external view
        returns (ProjectFinancialSummary memory)
    {
        (string memory pid, string memory name, , uint256 budget) = _loadProjectInfo(_id);

        (uint256 toCC, uint256 toBuilder, ) = fundManager.getFundData(_id);

        uint256 utilRate = budget > 0 ? (toBuilder * 100) / budget : 0;

        return ProjectFinancialSummary({
            projectID:       pid,
            projectName:     name,
            allocatedBudget: budget,
            totalDisbursed:  toCC,
            totalUtilized:   toBuilder,
            utilizationRate: utilRate
        });
    }

    /**
     * @notice Returns all actor addresses for a project (for public accountability).
     */
    function getProjectParticipants(string memory _id)
        external view
        returns (ProjectParticipants memory)
    {
        (string memory pid,,,) = _loadProjectInfo(_id);
        (address fm, address treasury, address cc, address builder,,) = _loadProjectActors(_id);

        return ProjectParticipants({
            projectID:      pid,
            financeMinistry: fm,
            treasury:        treasury,
            cityCorporation: cc,
            builder:         builder
        });
    }

    /**
     * @notice Returns summaries for ALL projects — useful for public dashboards.
     * @dev Gas costs scale with number of projects; use pagination for large sets.
     */
    function getAllProjectSummaries()
        external view
        returns (ProjectFinancialSummary[] memory)
    {
        uint256 count = registry.getTotalProjectCount();
        ProjectFinancialSummary[] memory results = new ProjectFinancialSummary[](count);

        for (uint256 i = 0; i < count; i++) {
            string memory pid = registry.allProjectIDs(i);
            uint256 budget    = registry.getProjectBudget(pid);
            (uint256 toCC, uint256 toBuilder, ) = fundManager.getFundData(pid);

            // Load name from registry
            (, string memory name,,) = _loadProjectInfo(pid);

            uint256 utilRate = budget > 0 ? (toBuilder * 100) / budget : 0;

            results[i] = ProjectFinancialSummary({
                projectID:       pid,
                projectName:     name,
                allocatedBudget: budget,
                totalDisbursed:  toCC,
                totalUtilized:   toBuilder,
                utilizationRate: utilRate
            });
        }
        return results;
    }

    // ─────────────────────────────────────────────────
    //  Internal helpers
    // ─────────────────────────────────────────────────

    /// @dev Returns the scalar/text fields of a project to avoid stack-too-deep.
    function _loadProjectInfo(string memory _id)
        internal view
        returns (
            string memory projectID,
            string memory projectName,
            string memory projectArea,
            uint256 allocatedBudget
        )
    {
        require(registry.projectExists(_id), "Project not found");
        (
            string memory _pid,
            string memory _name,
            string memory _area,
            uint256 _budget,
            ,
            ,
            ,
            ,
            ,

        ) = registry.projects(_id);
        return (_pid, _name, _area, _budget);
    }

    /// @dev Returns the address/timestamp fields of a project to avoid stack-too-deep.
    function _loadProjectActors(string memory _id)
        internal view
        returns (
            address financeMinistry,
            address treasury,
            address cityCorporation,
            address builder,
            uint256 createdAt,
            bool    isActive
        )
    {
        require(registry.projectExists(_id), "Project not found");
        (
            ,
            ,
            ,
            ,
            address _fm,
            address _treasury,
            address _cc,
            address _builder,
            uint256 _createdAt,
            bool    _isActive
        ) = registry.projects(_id);
        return (_fm, _treasury, _cc, _builder, _createdAt, _isActive);
    }

    function _derivePhase(address cc, address builder)
        internal pure
        returns (string memory)
    {
        if (cc == address(0)) return "Planned";
        if (builder == address(0)) return "Assigned";
        return "In Progress";
    }
}
