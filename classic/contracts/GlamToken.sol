// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GlamToken (GLAM)
 * @notice Security Token ERC-20 pour MyGlamHouse - Immobilier ecologique tokenise
 * @dev Token conforme STO avec KYC obligatoire, IPFS, et distribution de dividendes
 *
 * FONCTIONNALITES :
 * - ERC-20 standard (transferable entre adresses KYC)
 * - Whitelist KYC/AML obligatoire
 * - Pause d'urgence
 * - Documents IPFS on-chain
 * - Events pour tracking complet
 */

// ============================================================
//                    INTERFACES ERC-20
// ============================================================

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// ============================================================
//                    CONTRAT PRINCIPAL
// ============================================================

contract GlamToken is IERC20 {

    // --- Token Metadata ---
    string public constant name = "GlamHouse Token";
    string public constant symbol = "GLAM";
    uint8 public constant decimals = 18;

    // --- State ---
    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    // --- Ownership ---
    address public owner;

    // --- KYC/AML Whitelist ---
    mapping(address => bool) public kycApproved;
    mapping(address => uint256) public kycTimestamp;
    mapping(address => string) public kycLevel; // "basic", "verified", "accredited"
    address[] public kycList;

    // --- Pause ---
    bool public paused;

    // --- IPFS Documents ---
    struct Document {
        string ipfsHash;
        string docType;     // "titre", "expertise", "bail", "dpe", "audit"
        string description;
        uint256 timestamp;
        address uploadedBy;
    }
    Document[] public documents;

    // --- Holder tracking (pour dividendes) ---
    address[] public holders;
    mapping(address => bool) private isHolder;

    // --- Events ---
    event KYCApproved(address indexed account, string level, uint256 timestamp);
    event KYCRevoked(address indexed account, uint256 timestamp);
    event DocumentAdded(uint256 indexed docId, string ipfsHash, string docType, uint256 timestamp);
    event Paused(address account);
    event Unpaused(address account);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // --- Modifiers ---
    modifier onlyOwner() {
        require(msg.sender == owner, "GlamToken: pas le proprietaire");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "GlamToken: contrat en pause");
        _;
    }

    modifier onlyKYC(address account) {
        require(kycApproved[account], "GlamToken: KYC requis");
        _;
    }

    // ============================================================
    //                      CONSTRUCTOR
    // ============================================================

    /**
     * @notice Deploie le token GLAM
     * @param initialSupply Nombre total de tokens (en unites entieres, sera multiplie par 10^18)
     */
    constructor(uint256 initialSupply) {
        owner = msg.sender;

        // Approuver le deployer pour KYC
        kycApproved[msg.sender] = true;
        kycTimestamp[msg.sender] = block.timestamp;
        kycLevel[msg.sender] = "accredited";
        kycList.push(msg.sender);

        // Mint initial supply to owner
        _totalSupply = initialSupply * 10**decimals;
        _balances[msg.sender] = _totalSupply;

        holders.push(msg.sender);
        isHolder[msg.sender] = true;

        emit Transfer(address(0), msg.sender, _totalSupply);
        emit KYCApproved(msg.sender, "accredited", block.timestamp);
    }

    // ============================================================
    //                    ERC-20 STANDARD
    // ============================================================

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) external override whenNotPaused returns (bool) {
        require(kycApproved[msg.sender], "GlamToken: expediteur non KYC");
        require(kycApproved[to], "GlamToken: destinataire non KYC");
        _transfer(msg.sender, to, amount);
        return true;
    }

    function allowance(address tokenOwner, address spender) external view override returns (uint256) {
        return _allowances[tokenOwner][spender];
    }

    function approve(address spender, uint256 amount) external override whenNotPaused returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external override whenNotPaused returns (bool) {
        require(kycApproved[from], "GlamToken: expediteur non KYC");
        require(kycApproved[to], "GlamToken: destinataire non KYC");

        uint256 currentAllowance = _allowances[from][msg.sender];
        require(currentAllowance >= amount, "GlamToken: montant depasse l'autorisation");
        _allowances[from][msg.sender] = currentAllowance - amount;

        _transfer(from, to, amount);
        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "GlamToken: transfert depuis adresse zero");
        require(to != address(0), "GlamToken: transfert vers adresse zero");
        require(_balances[from] >= amount, "GlamToken: solde insuffisant");

        _balances[from] -= amount;
        _balances[to] += amount;

        // Track holders
        if (!isHolder[to] && _balances[to] > 0) {
            holders.push(to);
            isHolder[to] = true;
        }

        emit Transfer(from, to, amount);
    }

    // ============================================================
    //                    KYC / AML
    // ============================================================

    /**
     * @notice Approuve un compte pour le KYC
     * @param account Adresse a approuver
     * @param level Niveau KYC ("basic", "verified", "accredited")
     */
    function approveKYC(address account, string calldata level) external onlyOwner {
        require(!kycApproved[account], "GlamToken: deja approuve");
        kycApproved[account] = true;
        kycTimestamp[account] = block.timestamp;
        kycLevel[account] = level;
        kycList.push(account);
        emit KYCApproved(account, level, block.timestamp);
    }

    /**
     * @notice Revoque le KYC d'un compte
     */
    function revokeKYC(address account) external onlyOwner {
        require(kycApproved[account], "GlamToken: pas approuve");
        kycApproved[account] = false;
        emit KYCRevoked(account, block.timestamp);
    }

    /**
     * @notice Approuve plusieurs comptes en batch
     */
    function batchApproveKYC(address[] calldata accounts, string calldata level) external onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            if (!kycApproved[accounts[i]]) {
                kycApproved[accounts[i]] = true;
                kycTimestamp[accounts[i]] = block.timestamp;
                kycLevel[accounts[i]] = level;
                kycList.push(accounts[i]);
                emit KYCApproved(accounts[i], level, block.timestamp);
            }
        }
    }

    /**
     * @notice Retourne le nombre total de comptes KYC
     */
    function getKYCCount() external view returns (uint256) {
        return kycList.length;
    }

    // ============================================================
    //                    DOCUMENTS IPFS
    // ============================================================

    /**
     * @notice Ajoute un document hashe sur IPFS
     * @param ipfsHash Hash IPFS du document (ex: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco")
     * @param docType Type de document ("titre", "expertise", "bail", "dpe", "audit")
     * @param description Description du document
     */
    function addDocument(
        string calldata ipfsHash,
        string calldata docType,
        string calldata description
    ) external onlyOwner {
        uint256 docId = documents.length;
        documents.push(Document({
            ipfsHash: ipfsHash,
            docType: docType,
            description: description,
            timestamp: block.timestamp,
            uploadedBy: msg.sender
        }));
        emit DocumentAdded(docId, ipfsHash, docType, block.timestamp);
    }

    /**
     * @notice Retourne le nombre de documents
     */
    function getDocumentCount() external view returns (uint256) {
        return documents.length;
    }

    /**
     * @notice Retourne un document par son ID
     */
    function getDocument(uint256 docId) external view returns (
        string memory ipfsHash,
        string memory docType,
        string memory description,
        uint256 timestamp,
        address uploadedBy
    ) {
        require(docId < documents.length, "GlamToken: document inexistant");
        Document storage doc = documents[docId];
        return (doc.ipfsHash, doc.docType, doc.description, doc.timestamp, doc.uploadedBy);
    }

    // ============================================================
    //                    HOLDER TRACKING
    // ============================================================

    /**
     * @notice Retourne la liste de tous les holders
     */
    function getHolders() external view returns (address[] memory) {
        return holders;
    }

    /**
     * @notice Retourne le nombre de holders
     */
    function getHolderCount() external view returns (uint256) {
        return holders.length;
    }

    // ============================================================
    //                    ADMIN FUNCTIONS
    // ============================================================

    function pause() external onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "GlamToken: nouveau proprietaire = adresse zero");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    /**
     * @notice Mint de nouveaux tokens (pour nouvelles tranches)
     */
    function mint(address to, uint256 amount) external onlyOwner onlyKYC(to) {
        _totalSupply += amount;
        _balances[to] += amount;

        if (!isHolder[to]) {
            holders.push(to);
            isHolder[to] = true;
        }

        emit Transfer(address(0), to, amount);
    }
}
