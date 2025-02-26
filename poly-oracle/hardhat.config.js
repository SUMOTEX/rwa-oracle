require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.19" },  // Your contract's Solidity version
      { version: "0.8.20" },  // OpenZeppelin dependencies
      { version: "0.8.28" }   // Other contracts if needed
    ],
  },
  networks: {
    hardhat: {},
    polygon_mumbai: {
      url: process.env.POLYGON_MUMBAI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    polygon_mainnet: {
      url: process.env.POLYGON_MAINNET_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
