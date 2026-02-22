// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GlamSTO - Security Token Offering
 * @notice Contrat de vente de tokens GLAM pour MyGlamHouse
 * @dev Gere les achats de tokens, les paliers de prix, le refund si objectif non atteint
 *
 * FONCTIONNALITES :
 * - Achat de tokens avec ETH/MATIC
 * - Prix par token configurable
 * - Objectif minimum de financement (soft cap)
 * - Plafond maximum (hard cap)
 * - Remboursement automatique si soft cap non atteint
 * - Bonus early-bird
 * - Verification KYC via GlamToken
 * - Plusieurs projets (Normandie, EcoVillage, Capital)
 */

interface IGlamToken {
    function kycApproved(address account) external view returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract GlamSTO {

    // ============================================================
    //                    STRUCTURES
    // ============================================================

    struct Project {
        string name;            // "Residence Senior Normandie"
        string description;
        uint256 pricePerToken;  // Prix en wei (ex: 0.5 ETH = 500000000000000000)
        uint256 totalTokens;    // Nombre total de tokens pour ce projet
        uint256 tokensSold;     // Tokens vendus
        uint256 softCap;        // Objectif minimum en wei
        uint256 hardCap;        // Plafond maximum en wei
        uint256 raisedAmount;   // Montant leve en wei
        uint256 startTime;      // Debut de la vente
        uint256 endTime;        // Fin de la vente
        uint256 earlyBirdEnd;   // Fin du bonus early-bird
        uint8 earlyBirdBonus;   // Bonus en % (ex: 10 = 10%)
        bool active;            // Vente active
        bool finalized;         // Vente finalisee
        string ipfsHash;        // Hash IPFS du dossier projet
    }

    struct Purchase {
        address buyer;
        uint256 projectId;
        uint256 amount;         // Montant en wei
        uint256 tokens;         // Nombre de tokens
        uint256 timestamp;
        bool refunded;
    }

    // ============================================================
    //                    STATE
    // ============================================================

    address public owner;
    IGlamToken public glamToken;

    Project[] public projects;
    Purchase[] public purchases;

    // projectId => buyer => montant investi
    mapping(uint256 => mapping(address => uint256)) public investments;
    // projectId => buyer => tokens achetes
    mapping(uint256 => mapping(address => uint256)) public tokensPurchased;
    // projectId => liste des investisseurs
    mapping(uint256 => address[]) public projectInvestors;

    bool public paused;

    // ============================================================
    //                    EVENTS
    // ============================================================

    event ProjectCreated(uint256 indexed projectId, string name, uint256 pricePerToken, uint256 totalTokens);
    event TokensPurchased(uint256 indexed projectId, address indexed buyer, uint256 amount, uint256 tokens, uint256 timestamp);
    event ProjectFinalized(uint256 indexed projectId, uint256 totalRaised, bool success);
    event Refunded(uint256 indexed projectId, address indexed buyer, uint256 amount);
    event EarlyBirdApplied(uint256 indexed projectId, address indexed buyer, uint256 bonusTokens);

    // ============================================================
    //                    MODIFIERS
    // ============================================================

    modifier onlyOwner() {
        require(msg.sender == owner, "STO: pas le proprietaire");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "STO: contrat en pause");
        _;
    }

    // ============================================================
    //                    CONSTRUCTOR
    // ============================================================

    constructor(address _glamToken) {
        owner = msg.sender;
        glamToken = IGlamToken(_glamToken);
    }

    // ============================================================
    //                    GESTION PROJETS
    // ============================================================

    /**
     * @notice Cree un nouveau projet de tokenisation
     */
    function createProject(
        string calldata _name,
        string calldata _description,
        uint256 _pricePerToken,
        uint256 _totalTokens,
        uint256 _softCap,
        uint256 _hardCap,
        uint256 _duration,       // Duree en secondes
        uint256 _earlyBirdDays,  // Jours de bonus early-bird
        uint8 _earlyBirdBonus,   // Bonus en %
        string calldata _ipfsHash
    ) external onlyOwner {
        uint256 projectId = projects.length;

        projects.push(Project({
            name: _name,
            description: _description,
            pricePerToken: _pricePerToken,
            totalTokens: _totalTokens,
            tokensSold: 0,
            softCap: _softCap,
            hardCap: _hardCap,
            raisedAmount: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration,
            earlyBirdEnd: block.timestamp + (_earlyBirdDays * 1 days),
            earlyBirdBonus: _earlyBirdBonus,
            active: true,
            finalized: false,
            ipfsHash: _ipfsHash
        }));

        emit ProjectCreated(projectId, _name, _pricePerToken, _totalTokens);
    }

    // ============================================================
    //                    ACHAT DE TOKENS
    // ============================================================

    /**
     * @notice Achete des tokens pour un projet donne
     * @param projectId ID du projet
     */
    function buyTokens(uint256 projectId) external payable whenNotPaused {
        require(projectId < projects.length, "STO: projet inexistant");
        Project storage project = projects[projectId];

        require(project.active, "STO: vente inactive");
        require(!project.finalized, "STO: vente finalisee");
        require(block.timestamp >= project.startTime, "STO: vente pas encore commencee");
        require(block.timestamp <= project.endTime, "STO: vente terminee");
        require(msg.value > 0, "STO: montant nul");
        require(project.raisedAmount + msg.value <= project.hardCap, "STO: hard cap atteint");

        // Verification KYC via le contrat GlamToken
        require(glamToken.kycApproved(msg.sender), "STO: KYC requis - verifiez votre identite");

        // Calculer le nombre de tokens
        uint256 tokenAmount = (msg.value * 1e18) / project.pricePerToken;
        require(project.tokensSold + tokenAmount <= project.totalTokens * 1e18, "STO: plus assez de tokens");

        // Bonus early-bird
        uint256 bonusTokens = 0;
        if (block.timestamp <= project.earlyBirdEnd && project.earlyBirdBonus > 0) {
            bonusTokens = (tokenAmount * project.earlyBirdBonus) / 100;
            tokenAmount += bonusTokens;
            emit EarlyBirdApplied(projectId, msg.sender, bonusTokens);
        }

        // Mettre a jour le projet
        project.tokensSold += tokenAmount;
        project.raisedAmount += msg.value;

        // Enregistrer l'investissement
        if (investments[projectId][msg.sender] == 0) {
            projectInvestors[projectId].push(msg.sender);
        }
        investments[projectId][msg.sender] += msg.value;
        tokensPurchased[projectId][msg.sender] += tokenAmount;

        // Enregistrer l'achat
        purchases.push(Purchase({
            buyer: msg.sender,
            projectId: projectId,
            amount: msg.value,
            tokens: tokenAmount,
            timestamp: block.timestamp,
            refunded: false
        }));

        // Transferer les tokens
        require(glamToken.transfer(msg.sender, tokenAmount), "STO: transfert tokens echoue");

        emit TokensPurchased(projectId, msg.sender, msg.value, tokenAmount, block.timestamp);
    }

    // ============================================================
    //                    FINALISATION
    // ============================================================

    /**
     * @notice Finalise un projet (apres la date de fin)
     * @dev Si soft cap atteint : fonds envoyes au owner. Sinon : remboursement possible.
     */
    function finalizeProject(uint256 projectId) external onlyOwner {
        require(projectId < projects.length, "STO: projet inexistant");
        Project storage project = projects[projectId];
        require(!project.finalized, "STO: deja finalise");

        project.finalized = true;
        project.active = false;

        bool success = project.raisedAmount >= project.softCap;

        if (success) {
            // Soft cap atteint : envoyer les fonds au proprietaire
            (bool sent, ) = payable(owner).call{value: project.raisedAmount}("");
            require(sent, "STO: echec envoi fonds");
        }

        emit ProjectFinalized(projectId, project.raisedAmount, success);
    }

    /**
     * @notice Demande un remboursement si le soft cap n'est pas atteint
     */
    function claimRefund(uint256 projectId) external {
        require(projectId < projects.length, "STO: projet inexistant");
        Project storage project = projects[projectId];
        require(project.finalized, "STO: pas encore finalise");
        require(project.raisedAmount < project.softCap, "STO: soft cap atteint, pas de refund");

        uint256 invested = investments[projectId][msg.sender];
        require(invested > 0, "STO: aucun investissement");

        investments[projectId][msg.sender] = 0;

        (bool sent, ) = payable(msg.sender).call{value: invested}("");
        require(sent, "STO: echec remboursement");

        emit Refunded(projectId, msg.sender, invested);
    }

    // ============================================================
    //                    VIEW FUNCTIONS
    // ============================================================

    function getProjectCount() external view returns (uint256) {
        return projects.length;
    }

    function getProjectInvestors(uint256 projectId) external view returns (address[] memory) {
        return projectInvestors[projectId];
    }

    function getPurchaseCount() external view returns (uint256) {
        return purchases.length;
    }

    /**
     * @notice Retourne le prix effectif (avec bonus early-bird si applicable)
     */
    function getEffectivePrice(uint256 projectId) external view returns (uint256 price, bool earlyBird, uint8 bonus) {
        require(projectId < projects.length, "STO: projet inexistant");
        Project storage project = projects[projectId];

        earlyBird = block.timestamp <= project.earlyBirdEnd;
        bonus = earlyBird ? project.earlyBirdBonus : 0;

        if (earlyBird && project.earlyBirdBonus > 0) {
            // Prix effectif reduit grace au bonus
            price = (project.pricePerToken * 100) / (100 + project.earlyBirdBonus);
        } else {
            price = project.pricePerToken;
        }
    }

    /**
     * @notice Retourne les stats d'un projet
     */
    function getProjectStats(uint256 projectId) external view returns (
        uint256 tokensSold,
        uint256 raisedAmount,
        uint256 investorCount,
        uint256 percentFunded,
        bool isActive,
        uint256 timeRemaining
    ) {
        require(projectId < projects.length, "STO: projet inexistant");
        Project storage project = projects[projectId];

        tokensSold = project.tokensSold;
        raisedAmount = project.raisedAmount;
        investorCount = projectInvestors[projectId].length;
        percentFunded = project.hardCap > 0 ? (project.raisedAmount * 100) / project.hardCap : 0;
        isActive = project.active && !project.finalized && block.timestamp <= project.endTime;
        timeRemaining = block.timestamp < project.endTime ? project.endTime - block.timestamp : 0;
    }

    // ============================================================
    //                    ADMIN
    // ============================================================

    function pause() external onlyOwner { paused = true; }
    function unpause() external onlyOwner { paused = false; }

    function updateProjectPrice(uint256 projectId, uint256 newPrice) external onlyOwner {
        require(projectId < projects.length, "STO: projet inexistant");
        projects[projectId].pricePerToken = newPrice;
    }

    function toggleProject(uint256 projectId) external onlyOwner {
        require(projectId < projects.length, "STO: projet inexistant");
        projects[projectId].active = !projects[projectId].active;
    }

    // Recevoir des ETH
    receive() external payable {}
}
