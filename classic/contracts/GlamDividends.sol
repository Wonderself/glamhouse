// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GlamDividends
 * @notice Distribution automatique des loyers/dividendes aux detenteurs de GLAM
 * @dev Dividendes proportionnels au nombre de tokens detenus
 *
 * FONCTIONNALITES :
 * - Depot de loyers par le proprietaire
 * - Distribution proportionnelle automatique
 * - Claim individuel par les holders
 * - Historique complet des distributions
 * - Multi-projet (dividendes par projet)
 */

interface IGlamTokenDividends {
    function balanceOf(address account) external view returns (uint256);
    function totalSupply() external view returns (uint256);
    function getHolders() external view returns (address[] memory);
    function getHolderCount() external view returns (uint256);
}

contract GlamDividends {

    // ============================================================
    //                    STRUCTURES
    // ============================================================

    struct Distribution {
        uint256 totalAmount;     // Montant total distribue
        uint256 timestamp;       // Date de distribution
        uint256 snapshotSupply;  // Total supply au moment de la distribution
        string description;      // "Loyers T1 2026 - Residence Normandie"
        uint256 projectId;       // ID du projet concerne
        bool executed;           // Distribution executee
    }

    struct ClaimInfo {
        uint256 distributionId;
        uint256 amount;
        uint256 timestamp;
    }

    // ============================================================
    //                    STATE
    // ============================================================

    address public owner;
    IGlamTokenDividends public glamToken;

    Distribution[] public distributions;

    // distributionId => holder => montant reclame
    mapping(uint256 => mapping(address => uint256)) public claimed;
    // distributionId => holder => a reclame ?
    mapping(uint256 => mapping(address => bool)) public hasClaimed;

    // holder => liste de ses claims
    mapping(address => ClaimInfo[]) public claimHistory;

    // holder => total des dividendes recus (lifetime)
    mapping(address => uint256) public totalDividendsReceived;

    // Stats globales
    uint256 public totalDistributed;
    uint256 public totalClaimed;

    // ============================================================
    //                    EVENTS
    // ============================================================

    event DividendDeposited(uint256 indexed distributionId, uint256 amount, string description, uint256 timestamp);
    event DividendClaimed(uint256 indexed distributionId, address indexed holder, uint256 amount, uint256 timestamp);
    event DividendDistributed(uint256 indexed distributionId, uint256 holdersCount, uint256 totalAmount);

    // ============================================================
    //                    MODIFIERS
    // ============================================================

    modifier onlyOwner() {
        require(msg.sender == owner, "Dividends: pas le proprietaire");
        _;
    }

    // ============================================================
    //                    CONSTRUCTOR
    // ============================================================

    constructor(address _glamToken) {
        owner = msg.sender;
        glamToken = IGlamTokenDividends(_glamToken);
    }

    // ============================================================
    //                DEPOT DE DIVIDENDES
    // ============================================================

    /**
     * @notice Depose des dividendes pour distribution
     * @param description Description (ex: "Loyers T1 2026 - Residence Normandie")
     * @param projectId ID du projet concerne
     */
    function depositDividend(
        string calldata description,
        uint256 projectId
    ) external payable onlyOwner {
        require(msg.value > 0, "Dividends: montant nul");

        uint256 distId = distributions.length;
        uint256 currentSupply = glamToken.totalSupply();
        require(currentSupply > 0, "Dividends: aucun token en circulation");

        distributions.push(Distribution({
            totalAmount: msg.value,
            timestamp: block.timestamp,
            snapshotSupply: currentSupply,
            description: description,
            projectId: projectId,
            executed: true
        }));

        totalDistributed += msg.value;

        emit DividendDeposited(distId, msg.value, description, block.timestamp);
    }

    // ============================================================
    //                CLAIM DIVIDENDES
    // ============================================================

    /**
     * @notice Reclame ses dividendes pour une distribution donnee
     * @param distributionId ID de la distribution
     */
    function claimDividend(uint256 distributionId) external {
        require(distributionId < distributions.length, "Dividends: distribution inexistante");
        require(!hasClaimed[distributionId][msg.sender], "Dividends: deja reclame");

        Distribution storage dist = distributions[distributionId];
        require(dist.executed, "Dividends: pas encore executee");

        // Calculer la part proportionnelle
        uint256 holderBalance = glamToken.balanceOf(msg.sender);
        require(holderBalance > 0, "Dividends: aucun token detenu");

        uint256 share = (dist.totalAmount * holderBalance) / dist.snapshotSupply;
        require(share > 0, "Dividends: part nulle");

        // Marquer comme reclame
        hasClaimed[distributionId][msg.sender] = true;
        claimed[distributionId][msg.sender] = share;
        totalClaimed += share;
        totalDividendsReceived[msg.sender] += share;

        // Enregistrer dans l'historique
        claimHistory[msg.sender].push(ClaimInfo({
            distributionId: distributionId,
            amount: share,
            timestamp: block.timestamp
        }));

        // Envoyer les fonds
        (bool sent, ) = payable(msg.sender).call{value: share}("");
        require(sent, "Dividends: echec envoi");

        emit DividendClaimed(distributionId, msg.sender, share, block.timestamp);
    }

    /**
     * @notice Reclame tous les dividendes non reclames
     */
    function claimAllDividends() external {
        uint256 totalToClaim = 0;

        for (uint256 i = 0; i < distributions.length; i++) {
            if (!hasClaimed[i][msg.sender] && distributions[i].executed) {
                uint256 holderBalance = glamToken.balanceOf(msg.sender);
                if (holderBalance > 0) {
                    uint256 share = (distributions[i].totalAmount * holderBalance) / distributions[i].snapshotSupply;
                    if (share > 0) {
                        hasClaimed[i][msg.sender] = true;
                        claimed[i][msg.sender] = share;
                        totalToClaim += share;

                        claimHistory[msg.sender].push(ClaimInfo({
                            distributionId: i,
                            amount: share,
                            timestamp: block.timestamp
                        }));

                        emit DividendClaimed(i, msg.sender, share, block.timestamp);
                    }
                }
            }
        }

        require(totalToClaim > 0, "Dividends: rien a reclamer");

        totalClaimed += totalToClaim;
        totalDividendsReceived[msg.sender] += totalToClaim;

        (bool sent, ) = payable(msg.sender).call{value: totalToClaim}("");
        require(sent, "Dividends: echec envoi");
    }

    // ============================================================
    //                    VIEW FUNCTIONS
    // ============================================================

    /**
     * @notice Calcule les dividendes non reclames pour un holder
     */
    function getUnclaimedDividends(address holder) external view returns (uint256 total) {
        for (uint256 i = 0; i < distributions.length; i++) {
            if (!hasClaimed[i][holder] && distributions[i].executed) {
                uint256 holderBalance = glamToken.balanceOf(holder);
                if (holderBalance > 0) {
                    uint256 share = (distributions[i].totalAmount * holderBalance) / distributions[i].snapshotSupply;
                    total += share;
                }
            }
        }
    }

    /**
     * @notice Retourne le nombre de distributions
     */
    function getDistributionCount() external view returns (uint256) {
        return distributions.length;
    }

    /**
     * @notice Retourne l'historique des claims d'un holder
     */
    function getClaimHistory(address holder) external view returns (ClaimInfo[] memory) {
        return claimHistory[holder];
    }

    /**
     * @notice Retourne les stats pour un holder
     */
    function getHolderStats(address holder) external view returns (
        uint256 totalReceived,
        uint256 pendingAmount,
        uint256 claimCount
    ) {
        totalReceived = totalDividendsReceived[holder];
        claimCount = claimHistory[holder].length;

        for (uint256 i = 0; i < distributions.length; i++) {
            if (!hasClaimed[i][holder] && distributions[i].executed) {
                uint256 holderBalance = glamToken.balanceOf(holder);
                if (holderBalance > 0) {
                    pendingAmount += (distributions[i].totalAmount * holderBalance) / distributions[i].snapshotSupply;
                }
            }
        }
    }

    // ============================================================
    //                    ADMIN
    // ============================================================

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Dividends: adresse zero");
        owner = newOwner;
    }

    // Recevoir des ETH
    receive() external payable {}
}
