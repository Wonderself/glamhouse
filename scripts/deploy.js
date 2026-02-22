/**
 * GLAMHOUSE — Script de deploiement
 *
 * Deploie les 3 smart contracts dans l'ordre :
 *   1. GlamToken (ERC-20 Security Token)
 *   2. GlamSTO (Security Token Offering)
 *   3. GlamDividends (Distribution des dividendes)
 *
 * Usage :
 *   npx hardhat run scripts/deploy.js --network amoy     (testnet)
 *   npx hardhat run scripts/deploy.js --network polygon   (mainnet)
 *
 * Apres deploiement, copier les adresses dans blockchain.js CONFIG.contracts
 */

const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("=".repeat(60));
    console.log("  GLAMHOUSE — Deploiement Smart Contracts");
    console.log("=".repeat(60));
    console.log("  Deployer :", deployer.address);
    console.log("  Reseau   :", hre.network.name);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("  Solde    :", hre.ethers.formatEther(balance), "MATIC");
    console.log("=".repeat(60));
    console.log("");

    // ============================================================
    //  1. DEPLOYER GlamToken
    // ============================================================
    console.log("[1/3] Deploiement GlamToken...");
    const GlamToken = await hre.ethers.getContractFactory("GlamToken");

    // 10 000 tokens initiaux (supply totale)
    const glamToken = await GlamToken.deploy(10000);
    await glamToken.waitForDeployment();
    const glamTokenAddress = await glamToken.getAddress();

    console.log("  GlamToken deploye :", glamTokenAddress);
    console.log("");

    // ============================================================
    //  2. DEPLOYER GlamSTO
    // ============================================================
    console.log("[2/3] Deploiement GlamSTO...");
    const GlamSTO = await hre.ethers.getContractFactory("GlamSTO");
    const glamSTO = await GlamSTO.deploy(glamTokenAddress);
    await glamSTO.waitForDeployment();
    const glamSTOAddress = await glamSTO.getAddress();

    console.log("  GlamSTO deploye :", glamSTOAddress);
    console.log("");

    // ============================================================
    //  3. DEPLOYER GlamDividends
    // ============================================================
    console.log("[3/3] Deploiement GlamDividends...");
    const GlamDividends = await hre.ethers.getContractFactory("GlamDividends");
    const glamDividends = await GlamDividends.deploy(glamTokenAddress);
    await glamDividends.waitForDeployment();
    const glamDividendsAddress = await glamDividends.getAddress();

    console.log("  GlamDividends deploye :", glamDividendsAddress);
    console.log("");

    // ============================================================
    //  4. CONFIGURATION INITIALE
    // ============================================================
    console.log("[Config] Approbation du contrat STO pour transferer des tokens...");

    // Approuver le STO pour transferer les tokens du deployer
    const totalSupply = await glamToken.totalSupply();
    const approveTx = await glamToken.approve(glamSTOAddress, totalSupply);
    await approveTx.wait();
    console.log("  STO approuve pour", hre.ethers.formatEther(totalSupply), "GLAM");

    // Creer les 3 projets sur le STO
    console.log("[Config] Creation des projets...");

    // Projet 0 : Residence Senior Normandie
    await (await glamSTO.createProject(
        "Residence Senior Normandie",
        "8-12 maisons modulaires pour colocation seniors",
        hre.ethers.parseEther("0.5"),    // 0.5 MATIC par token (~1780 EUR)
        500,                               // 500 tokens
        hre.ethers.parseEther("50"),       // Soft cap: 50 MATIC
        hre.ethers.parseEther("250"),      // Hard cap: 250 MATIC
        180 * 24 * 3600,                   // 180 jours
        30,                                // 30 jours early-bird
        10,                                // 10% bonus
        "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"  // IPFS hash
    )).wait();
    console.log("  Projet 0 (Normandie) cree");

    // Projet 1 : EcoVillage Moderne
    await (await glamSTO.createProject(
        "EcoVillage Moderne",
        "15-25 maisons autonomes en ecovillage",
        hre.ethers.parseEther("0.4"),
        2000,
        hre.ethers.parseEther("200"),
        hre.ethers.parseEther("800"),
        365 * 24 * 3600,
        60,
        15,
        "QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX"
    )).wait();
    console.log("  Projet 1 (EcoVillage) cree");

    // Projet 2 : Capital MyGlamHouse
    await (await glamSTO.createProject(
        "Capital MyGlamHouse",
        "20% du capital de l'entreprise en equity tokens",
        hre.ethers.parseEther("0.15"),
        1000,
        hre.ethers.parseEther("30"),
        hre.ethers.parseEther("150"),
        365 * 24 * 3600,
        90,
        5,
        "QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB"
    )).wait();
    console.log("  Projet 2 (Capital) cree");

    // ============================================================
    //  5. RESUME
    // ============================================================
    console.log("");
    console.log("=".repeat(60));
    console.log("  DEPLOIEMENT TERMINE AVEC SUCCES !");
    console.log("=".repeat(60));
    console.log("");
    console.log("  Adresses des contrats :");
    console.log("  ───────────────────────────────────────────");
    console.log("  GlamToken     :", glamTokenAddress);
    console.log("  GlamSTO       :", glamSTOAddress);
    console.log("  GlamDividends :", glamDividendsAddress);
    console.log("  ───────────────────────────────────────────");
    console.log("");
    console.log("  PROCHAINES ETAPES :");
    console.log("  1. Copier ces adresses dans blockchain.js (CONFIG.contracts)");
    console.log("  2. Changer CONFIG.mode = 'real' dans blockchain.js");
    console.log("  3. Verifier les contrats sur Polygonscan :");
    console.log("     npx hardhat verify --network amoy", glamTokenAddress, "10000");
    console.log("     npx hardhat verify --network amoy", glamSTOAddress, glamTokenAddress);
    console.log("     npx hardhat verify --network amoy", glamDividendsAddress, glamTokenAddress);
    console.log("");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Erreur de deploiement :", error);
        process.exit(1);
    });
