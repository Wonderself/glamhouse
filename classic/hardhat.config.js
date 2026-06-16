/**
 * GLAMHOUSE — Hardhat Configuration
 *
 * Pour deployer les smart contracts sur Polygon Amoy (testnet) ou Polygon mainnet.
 *
 * INSTALLATION :
 *   npm init -y
 *   npm install hardhat @nomicfoundation/hardhat-toolbox dotenv
 *   npx hardhat compile
 *   npx hardhat run scripts/deploy.js --network amoy
 *
 * CONFIGURATION :
 *   Creer un fichier .env avec :
 *     PRIVATE_KEY=votre_cle_privee_metamask
 *     ALCHEMY_API_KEY=votre_cle_alchemy (ou Infura)
 *     POLYGONSCAN_API_KEY=votre_cle_polygonscan (pour verification)
 */

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";
const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY || "";
const POLYGONSCAN_KEY = process.env.POLYGONSCAN_API_KEY || "";

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },

  networks: {
    // Reseau local Hardhat (pour tests)
    hardhat: {
      chainId: 31337
    },

    // Polygon Amoy Testnet
    amoy: {
      url: ALCHEMY_KEY
        ? `https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_KEY}`
        : "https://rpc-amoy.polygon.technology/",
      accounts: [PRIVATE_KEY],
      chainId: 80002,
      gasPrice: 30000000000 // 30 gwei
    },

    // Polygon Mainnet (PRODUCTION)
    polygon: {
      url: ALCHEMY_KEY
        ? `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
        : "https://polygon-rpc.com/",
      accounts: [PRIVATE_KEY],
      chainId: 137,
      gasPrice: 50000000000 // 50 gwei
    }
  },

  // Verification des contrats sur Polygonscan
  etherscan: {
    apiKey: {
      polygon: POLYGONSCAN_KEY,
      polygonAmoy: POLYGONSCAN_KEY
    }
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
