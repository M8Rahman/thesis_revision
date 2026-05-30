// migrations/2_deploy_contracts.js
// Deploy order: ProjectRegistry → FundTransferManager → TransparencyPortal
// Run with: truffle migrate --network development

const ProjectRegistry     = artifacts.require("ProjectRegistry");
const FundTransferManager = artifacts.require("FundTransferManager");
const TransparencyPortal  = artifacts.require("TransparencyPortal");

module.exports = async function (deployer, network, accounts) {
  const deployerAccount = accounts[0]; // Finance Ministry / Default Admin

  // 1. Deploy ProjectRegistry — deployer becomes DEFAULT_ADMIN + FINANCE_MINISTRY
  await deployer.deploy(ProjectRegistry, deployerAccount);
  const registry = await ProjectRegistry.deployed();
  console.log("✅ ProjectRegistry deployed at:", registry.address);

  // 2. Deploy FundTransferManager — pass registry address
  await deployer.deploy(FundTransferManager, registry.address, deployerAccount);
  const fundManager = await FundTransferManager.deployed();
  console.log("✅ FundTransferManager deployed at:", fundManager.address);

  // 3. Deploy TransparencyPortal — pass both addresses
  await deployer.deploy(TransparencyPortal, registry.address, fundManager.address);
  const portal = await TransparencyPortal.deployed();
  console.log("✅ TransparencyPortal deployed at:", portal.address);

  // ── Print addresses for config.js update ──
  console.log("\n═══════════════════════════════════════════════════════");
  console.log("  UPDATE src/config.js with these CONTRACT_ADDRESSES:");
  console.log("  PROJECT_REGISTRY:      \"" + registry.address + "\"");
  console.log("  FUND_TRANSFER_MANAGER: \"" + fundManager.address + "\"");
  console.log("  TRANSPARENCY_PORTAL:   \"" + portal.address + "\"");
  console.log("═══════════════════════════════════════════════════════\n");
};
