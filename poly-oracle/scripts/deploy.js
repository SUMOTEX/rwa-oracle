const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners(); // Get deployer address

  console.log(`Deploying contract with account: ${await deployer.getAddress()}`);

  const RealEstateOracle = await hre.ethers.getContractFactory("RealEstateOracle");
  const oracle = await RealEstateOracle.deploy(deployer.address, {
    value: hre.ethers.parseEther("1.0"),
  });

  await oracle.waitForDeployment();

  console.log(`✅ RealEstateOracle deployed to: ${await oracle.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
