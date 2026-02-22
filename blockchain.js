/**
 * ============================================================
 *  GLAMHOUSE BLOCKCHAIN ENGINE
 *  Mode dual : Simulation (localStorage) + Real (ethers.js + MetaMask)
 * ============================================================
 *
 *  Ce fichier gere TOUTE la logique blockchain du site :
 *  - Connexion wallet (MetaMask)
 *  - KYC verification
 *  - Achat de tokens
 *  - Portfolio & soldes
 *  - Distribution de dividendes
 *  - Documents IPFS
 *  - Historique des transactions
 *
 *  En mode SIMULATION : tout fonctionne via localStorage (demo)
 *  En mode REEL : interagit avec les smart contracts sur Polygon
 * ============================================================
 */

(function() {
    'use strict';

    // ============================================================
    //                  CONFIGURATION
    // ============================================================

    const CONFIG = {
        // Mode : 'simulation' ou 'real'
        mode: 'simulation',

        // Reseau cible (Polygon Amoy testnet)
        chainId: '0x13882',  // 80002
        chainName: 'Polygon Amoy Testnet',
        rpcUrl: 'https://rpc-amoy.polygon.technology/',
        blockExplorer: 'https://amoy.polygonscan.com/',
        currency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },

        // Adresses des contrats (a remplir apres deploiement)
        contracts: {
            glamToken: '0x0000000000000000000000000000000000000000',
            glamSTO: '0x0000000000000000000000000000000000000000',
            glamDividends: '0x0000000000000000000000000000000000000000'
        },

        // Projets disponibles
        projects: [
            {
                id: 0,
                name: 'Residence Senior Normandie',
                symbol: 'GLAM-SN',
                pricePerToken: 1780,
                totalTokens: 500,
                description: '8-12 maisons · Colocation retraites',
                rendement: '5-7%',
                image: 'assets/maison1.jpg'
            },
            {
                id: 1,
                name: 'EcoVillage Moderne',
                symbol: 'GLAM-EV',
                pricePerToken: 1400,
                totalTokens: 2000,
                description: '15-25 maisons · Village autonome',
                rendement: '6-8%',
                image: 'assets/maison2.jpg'
            },
            {
                id: 2,
                name: 'Capital MyGlamHouse',
                symbol: 'GLAM-EQ',
                pricePerToken: 500,
                totalTokens: 1000,
                description: '20% du capital · Equity tokens',
                rendement: 'Variable',
                image: 'assets/logo.jpg'
            }
        ]
    };

    // ============================================================
    //               SIMULATION STATE (localStorage)
    // ============================================================

    const STORAGE_KEY = 'glamhouse_blockchain';

    function getState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return JSON.parse(saved);
        } catch(e) {}
        return createDefaultState();
    }

    function saveState(state) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch(e) {
            console.warn('Blockchain: localStorage plein');
        }
    }

    function createDefaultState() {
        return {
            wallet: null,
            walletConnected: false,
            kycStatus: 'none',  // none, pending, verified, rejected
            kycData: null,
            kycTimestamp: null,
            balance: 0,  // MATIC balance (simulated)
            tokens: {
                0: 0,  // Normandie
                1: 0,  // EcoVillage
                2: 0   // Capital
            },
            projects: {
                0: { sold: 175, raised: 311500, investors: 47 },
                1: { sold: 240, raised: 336000, investors: 83 },
                2: { sold: 80, raised: 40000, investors: 62 }
            },
            transactions: [],
            dividends: {
                available: 0,
                claimed: 0,
                history: []
            },
            documents: [
                { hash: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco', type: 'titre', name: 'Titre de propriete - Terrain Normandie', date: '2025-11-15' },
                { hash: 'QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX', type: 'expertise', name: 'Expertise immobiliere independante', date: '2025-12-01' },
                { hash: 'QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB', type: 'dpe', name: 'Diagnostic energetique - DPE Classe A', date: '2026-01-10' },
                { hash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG', type: 'audit', name: 'Audit Smart Contract - CertiK', date: '2026-02-01' },
                { hash: 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn', type: 'bail', name: 'Modele bail locatif senior', date: '2026-02-15' }
            ],
            ipfsUploads: []
        };
    }

    // ============================================================
    //               WALLET CONNECTION
    // ============================================================

    async function connectWallet() {
        const state = getState();

        if (CONFIG.mode === 'simulation') {
            // Generer une adresse simulee
            const addr = '0x' + Array.from({length: 40}, () =>
                '0123456789abcdef'[Math.floor(Math.random() * 16)]
            ).join('');

            state.wallet = addr;
            state.walletConnected = true;
            state.balance = 2.5;  // 2.5 MATIC de test
            saveState(state);

            updateWalletUI(state);
            showNotification('Wallet connecte (mode demo)', 'success');
            return addr;
        }

        // Mode reel : MetaMask
        if (typeof window.ethereum === 'undefined') {
            showNotification('MetaMask non detecte ! Installez MetaMask pour continuer.', 'error');
            window.open('https://metamask.io/download/', '_blank');
            return null;
        }

        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length === 0) {
                showNotification('Aucun compte MetaMask disponible', 'error');
                return null;
            }

            // Verifier le reseau
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId !== CONFIG.chainId) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: CONFIG.chainId }]
                    });
                } catch (switchError) {
                    // Si le reseau n'existe pas, l'ajouter
                    if (switchError.code === 4902) {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: CONFIG.chainId,
                                chainName: CONFIG.chainName,
                                rpcUrls: [CONFIG.rpcUrl],
                                blockExplorerUrls: [CONFIG.blockExplorer],
                                nativeCurrency: CONFIG.currency
                            }]
                        });
                    }
                }
            }

            state.wallet = accounts[0];
            state.walletConnected = true;
            saveState(state);

            updateWalletUI(state);
            showNotification('Wallet connecte : ' + accounts[0].slice(0,6) + '...' + accounts[0].slice(-4), 'success');
            return accounts[0];

        } catch (error) {
            showNotification('Connexion refusee : ' + error.message, 'error');
            return null;
        }
    }

    function disconnectWallet() {
        const state = getState();
        state.wallet = null;
        state.walletConnected = false;
        saveState(state);
        updateWalletUI(state);
        showNotification('Wallet deconnecte', 'info');
    }

    // ============================================================
    //               KYC VERIFICATION
    // ============================================================

    function submitKYC(formData) {
        const state = getState();

        if (!state.walletConnected) {
            showNotification('Connectez votre wallet d\'abord', 'error');
            return false;
        }

        // Valider les champs obligatoires
        const required = ['firstName', 'lastName', 'email', 'birthDate', 'nationality', 'address', 'idType'];
        for (const field of required) {
            if (!formData[field] || formData[field].trim() === '') {
                showNotification('Champ obligatoire manquant : ' + field, 'error');
                return false;
            }
        }

        // Verifier age >= 18
        const birth = new Date(formData.birthDate);
        const age = (Date.now() - birth.getTime()) / (365.25 * 24 * 3600 * 1000);
        if (age < 18) {
            showNotification('Vous devez avoir au moins 18 ans', 'error');
            return false;
        }

        state.kycData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            birthDate: formData.birthDate,
            nationality: formData.nationality,
            address: formData.address,
            city: formData.city || '',
            postalCode: formData.postalCode || '',
            country: formData.country || 'France',
            idType: formData.idType,
            idNumber: formData.idNumber || '',
            idDocument: formData.idDocument || null,
            proofOfAddress: formData.proofOfAddress || null,
            investorType: formData.investorType || 'particulier',
            submittedAt: new Date().toISOString()
        };

        state.kycStatus = 'pending';
        state.kycTimestamp = Date.now();
        saveState(state);

        // En mode simulation : approuver automatiquement apres 3 secondes
        if (CONFIG.mode === 'simulation') {
            setTimeout(() => {
                const s = getState();
                if (s.kycStatus === 'pending') {
                    s.kycStatus = 'verified';
                    saveState(s);
                    updateKYCUI(s);
                    showNotification('KYC approuve ! Vous pouvez maintenant acheter des tokens.', 'success');
                }
            }, 3000);
        }

        updateKYCUI(state);
        showNotification('Dossier KYC soumis. Verification en cours...', 'info');

        // Enregistrer la transaction
        addTransaction(state, 'kyc', 'Soumission dossier KYC', 0, 'pending');

        return true;
    }

    // ============================================================
    //               ACHAT DE TOKENS
    // ============================================================

    function buyTokens(projectId, quantity) {
        const state = getState();

        if (!state.walletConnected) {
            showNotification('Connectez votre wallet d\'abord', 'error');
            return false;
        }

        if (state.kycStatus !== 'verified') {
            showNotification('KYC requis avant d\'acheter des tokens', 'error');
            return false;
        }

        const project = CONFIG.projects[projectId];
        if (!project) {
            showNotification('Projet introuvable', 'error');
            return false;
        }

        quantity = parseInt(quantity);
        if (isNaN(quantity) || quantity < 1) {
            showNotification('Quantite invalide', 'error');
            return false;
        }

        const totalCost = project.pricePerToken * quantity;
        const projectState = state.projects[projectId];
        const remaining = project.totalTokens - projectState.sold;

        if (quantity > remaining) {
            showNotification('Seulement ' + remaining + ' tokens disponibles', 'error');
            return false;
        }

        // En mode simulation, tout passe
        if (CONFIG.mode === 'simulation') {
            // Mettre a jour les soldes
            state.tokens[projectId] = (state.tokens[projectId] || 0) + quantity;
            projectState.sold += quantity;
            projectState.raised += totalCost;
            projectState.investors += 1;

            // Generer des dividendes simules
            const quarterlyDiv = totalCost * 0.015; // ~6% annuel / 4 trimestres
            state.dividends.available += quarterlyDiv;

            saveState(state);

            // Transaction
            addTransaction(state, 'purchase', 'Achat ' + quantity + ' ' + project.symbol, totalCost, 'confirmed');

            updatePortfolioUI(state);
            updateProjectsUI(state);
            showNotification(
                quantity + ' tokens ' + project.symbol + ' achetes pour ' + totalCost.toLocaleString('fr-FR') + ' EUR !',
                'success'
            );
            return true;
        }

        // Mode reel : interaction smart contract
        // (necessite ethers.js et contrats deployes)
        showNotification('Mode reel non encore active. Deployer les contrats d\'abord.', 'error');
        return false;
    }

    // ============================================================
    //               DIVIDENDES
    // ============================================================

    function claimDividends() {
        const state = getState();

        if (!state.walletConnected) {
            showNotification('Connectez votre wallet', 'error');
            return false;
        }

        if (state.dividends.available <= 0) {
            showNotification('Aucun dividende a reclamer', 'info');
            return false;
        }

        const amount = state.dividends.available;

        if (CONFIG.mode === 'simulation') {
            state.dividends.claimed += amount;
            state.dividends.available = 0;
            state.dividends.history.push({
                amount: amount,
                date: new Date().toISOString(),
                type: 'claim',
                description: 'Reclamation dividendes - ' + new Date().toLocaleDateString('fr-FR')
            });

            saveState(state);
            addTransaction(state, 'dividend', 'Dividendes reclames', amount, 'confirmed');
            updateDividendsUI(state);
            showNotification(
                'Dividendes de ' + amount.toFixed(2) + ' EUR reclames avec succes !',
                'success'
            );
            return true;
        }

        return false;
    }

    function simulateQuarterlyDividends() {
        const state = getState();
        let totalTokenValue = 0;

        CONFIG.projects.forEach((project, id) => {
            const held = state.tokens[id] || 0;
            totalTokenValue += held * project.pricePerToken;
        });

        if (totalTokenValue > 0) {
            // ~6% annuel = 1.5% par trimestre
            const dividend = totalTokenValue * 0.015;
            state.dividends.available += dividend;
            state.dividends.history.push({
                amount: dividend,
                date: new Date().toISOString(),
                type: 'distribution',
                description: 'Loyers trimestriels - ' + new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
            });
            saveState(state);
            updateDividendsUI(state);
            showNotification('Nouveaux dividendes disponibles : ' + dividend.toFixed(2) + ' EUR', 'success');
        }
    }

    // ============================================================
    //               IPFS DOCUMENTS
    // ============================================================

    function uploadToIPFS(file, docType, description) {
        const state = getState();

        if (!state.walletConnected) {
            showNotification('Connectez votre wallet', 'error');
            return;
        }

        if (CONFIG.mode === 'simulation') {
            // Simuler un hash IPFS
            const fakeHash = 'Qm' + Array.from({length: 44}, () =>
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[
                    Math.floor(Math.random() * 62)
                ]
            ).join('');

            const doc = {
                hash: fakeHash,
                type: docType,
                name: description || file.name,
                date: new Date().toISOString().split('T')[0],
                size: file.size,
                uploadedBy: state.wallet.slice(0, 10) + '...'
            };

            state.documents.push(doc);
            state.ipfsUploads.push(doc);
            saveState(state);

            addTransaction(state, 'ipfs', 'Document uploade sur IPFS: ' + doc.name, 0, 'confirmed');
            updateDocumentsUI(state);
            showNotification('Document hashe sur IPFS : ' + fakeHash.slice(0, 12) + '...', 'success');
            return fakeHash;
        }

        // Mode reel : utiliser Pinata ou nft.storage
        showNotification('IPFS reel necessite une cle API Pinata/nft.storage', 'info');
        return null;
    }

    function verifyIPFSHash(hash) {
        const state = getState();
        const doc = state.documents.find(d => d.hash === hash);
        if (doc) {
            showNotification('Document verifie : ' + doc.name + ' (hash valide)', 'success');
            return doc;
        } else {
            showNotification('Hash non trouve dans le registre', 'error');
            return null;
        }
    }

    // ============================================================
    //               TRANSACTIONS
    // ============================================================

    function addTransaction(state, type, description, amount, status) {
        const tx = {
            id: 'tx_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
            type: type,
            description: description,
            amount: amount,
            status: status,
            timestamp: new Date().toISOString(),
            hash: CONFIG.mode === 'simulation'
                ? '0x' + Array.from({length: 64}, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')
                : null,
            from: state.wallet,
            blockNumber: CONFIG.mode === 'simulation' ? Math.floor(Math.random() * 10000000) + 50000000 : null
        };

        state.transactions.unshift(tx);
        if (state.transactions.length > 100) state.transactions = state.transactions.slice(0, 100);
        saveState(state);
        updateTransactionsUI(state);
        return tx;
    }

    // ============================================================
    //               MARKETPLACE P2P
    // ============================================================

    function getMarketplaceListings() {
        // Listings simules pour le marche secondaire
        return [
            { seller: '0x7a3f...8b2e', project: 0, tokens: 3, price: 1850, date: '2026-02-20' },
            { seller: '0x4c9d...1f7a', project: 0, tokens: 1, price: 1780, date: '2026-02-19' },
            { seller: '0x2e8b...5d3c', project: 1, tokens: 5, price: 1450, date: '2026-02-21' },
            { seller: '0x9f1a...7e4b', project: 1, tokens: 2, price: 1400, date: '2026-02-18' },
            { seller: '0x6b5c...3a9d', project: 2, tokens: 10, price: 520, date: '2026-02-22' },
            { seller: '0x1d7e...8c6f', project: 2, tokens: 4, price: 500, date: '2026-02-17' }
        ];
    }

    // ============================================================
    //               UI UPDATE FUNCTIONS
    // ============================================================

    function updateWalletUI(state) {
        const btn = document.getElementById('connectWalletBtn');
        const info = document.getElementById('walletInfo');
        const addr = document.getElementById('walletAddress');
        const bal = document.getElementById('walletBalance');
        const status = document.getElementById('walletStatus');
        const sections = document.querySelectorAll('.requires-wallet');

        if (state.walletConnected && state.wallet) {
            if (btn) {
                btn.innerHTML = '<i class="fas fa-check-circle"></i> Connecte';
                btn.classList.add('connected');
                btn.onclick = disconnectWallet;
            }
            if (info) info.style.display = 'block';
            if (addr) addr.textContent = state.wallet.slice(0, 6) + '...' + state.wallet.slice(-4);
            if (bal) bal.textContent = (state.balance || 0).toFixed(4) + ' MATIC';
            if (status) { status.textContent = 'Connecte'; status.className = 'status-badge status-active'; }
            sections.forEach(s => s.style.display = 'block');
        } else {
            if (btn) {
                btn.innerHTML = '<i class="fab fa-ethereum"></i> Connecter Wallet';
                btn.classList.remove('connected');
                btn.onclick = connectWallet;
            }
            if (info) info.style.display = 'none';
            if (status) { status.textContent = 'Deconnecte'; status.className = 'status-badge status-inactive'; }
            sections.forEach(s => s.style.display = 'none');
        }

        updateKYCUI(state);
        updatePortfolioUI(state);
        updateDividendsUI(state);
        updateDocumentsUI(state);
        updateTransactionsUI(state);
        updateProjectsUI(state);
    }

    function updateKYCUI(state) {
        const statusEl = document.getElementById('kycStatus');
        const formEl = document.getElementById('kycForm');
        const verifiedEl = document.getElementById('kycVerified');
        const pendingEl = document.getElementById('kycPending');

        if (!statusEl) return;

        if (state.kycStatus === 'verified') {
            statusEl.innerHTML = '<i class="fas fa-check-circle" style="color:#4caf50"></i> KYC Verifie';
            statusEl.className = 'kyc-status kyc-verified';
            if (formEl) formEl.style.display = 'none';
            if (verifiedEl) verifiedEl.style.display = 'block';
            if (pendingEl) pendingEl.style.display = 'none';
        } else if (state.kycStatus === 'pending') {
            statusEl.innerHTML = '<i class="fas fa-hourglass-half" style="color:#ff9800"></i> Verification en cours...';
            statusEl.className = 'kyc-status kyc-pending';
            if (formEl) formEl.style.display = 'none';
            if (verifiedEl) verifiedEl.style.display = 'none';
            if (pendingEl) pendingEl.style.display = 'block';
        } else {
            statusEl.innerHTML = '<i class="fas fa-times-circle" style="color:#e53e3e"></i> KYC Non verifie';
            statusEl.className = 'kyc-status kyc-none';
            if (formEl) formEl.style.display = 'block';
            if (verifiedEl) verifiedEl.style.display = 'none';
            if (pendingEl) pendingEl.style.display = 'none';
        }
    }

    function updatePortfolioUI(state) {
        const container = document.getElementById('portfolioCards');
        if (!container) return;

        let totalValue = 0;
        let html = '';

        CONFIG.projects.forEach((project, id) => {
            const held = state.tokens[id] || 0;
            const value = held * project.pricePerToken;
            totalValue += value;

            if (held > 0) {
                html += '<div class="portfolio-card">' +
                    '<div class="portfolio-header">' +
                        '<h4>' + project.symbol + '</h4>' +
                        '<span class="portfolio-badge">' + held + ' tokens</span>' +
                    '</div>' +
                    '<p class="portfolio-project">' + project.name + '</p>' +
                    '<div class="portfolio-value">' + value.toLocaleString('fr-FR') + ' EUR</div>' +
                    '<div class="portfolio-rendement"><i class="fas fa-chart-line"></i> Rendement : ' + project.rendement + '/an</div>' +
                '</div>';
            }
        });

        if (html === '') {
            html = '<div class="empty-state"><i class="fas fa-coins" style="font-size:2rem;color:#ccc"></i><p>Aucun token detenu. Achetez vos premiers tokens ci-dessous !</p></div>';
        }

        container.innerHTML = html;

        const totalEl = document.getElementById('portfolioTotal');
        if (totalEl) totalEl.textContent = totalValue.toLocaleString('fr-FR') + ' EUR';

        const countEl = document.getElementById('portfolioTokenCount');
        if (countEl) {
            const total = Object.values(state.tokens).reduce((a, b) => a + b, 0);
            countEl.textContent = total;
        }
    }

    function updateDividendsUI(state) {
        const availableEl = document.getElementById('dividendsAvailable');
        const claimedEl = document.getElementById('dividendsClaimed');
        const historyEl = document.getElementById('dividendsHistory');
        const claimBtn = document.getElementById('claimDividendsBtn');

        if (availableEl) availableEl.textContent = (state.dividends.available || 0).toFixed(2) + ' EUR';
        if (claimedEl) claimedEl.textContent = (state.dividends.claimed || 0).toFixed(2) + ' EUR';
        if (claimBtn) claimBtn.disabled = (state.dividends.available || 0) <= 0;

        if (historyEl && state.dividends.history.length > 0) {
            let html = '';
            state.dividends.history.slice(0, 10).forEach(d => {
                const icon = d.type === 'claim' ? 'fa-download' : 'fa-coins';
                const color = d.type === 'claim' ? '#4caf50' : '#ff9800';
                html += '<div class="dividend-row">' +
                    '<i class="fas ' + icon + '" style="color:' + color + '"></i>' +
                    '<span>' + d.description + '</span>' +
                    '<span class="dividend-amount">' + d.amount.toFixed(2) + ' EUR</span>' +
                    '<span class="dividend-date">' + new Date(d.date).toLocaleDateString('fr-FR') + '</span>' +
                '</div>';
            });
            historyEl.innerHTML = html;
        } else if (historyEl) {
            historyEl.innerHTML = '<p style="color:#888;text-align:center;padding:20px">Aucun historique de dividendes</p>';
        }
    }

    function updateDocumentsUI(state) {
        const container = document.getElementById('ipfsDocuments');
        if (!container) return;

        let html = '';
        state.documents.forEach(doc => {
            const typeIcon = {
                'titre': 'fa-file-signature',
                'expertise': 'fa-search-dollar',
                'bail': 'fa-file-contract',
                'dpe': 'fa-leaf',
                'audit': 'fa-shield-alt'
            }[doc.type] || 'fa-file-pdf';

            html += '<div class="ipfs-doc">' +
                '<i class="fas ' + typeIcon + '"></i>' +
                '<div class="ipfs-doc-info">' +
                    '<strong>' + doc.name + '</strong>' +
                    '<span class="ipfs-hash" title="' + doc.hash + '">' + doc.hash.slice(0, 16) + '...</span>' +
                    '<span class="ipfs-date">' + doc.date + '</span>' +
                '</div>' +
                '<button class="btn-verify" onclick="glamBlockchain.verifyIPFS(\'' + doc.hash + '\')">' +
                    '<i class="fas fa-check-double"></i> Verifier' +
                '</button>' +
            '</div>';
        });

        container.innerHTML = html;
    }

    function updateTransactionsUI(state) {
        const container = document.getElementById('transactionHistory');
        if (!container) return;

        if (state.transactions.length === 0) {
            container.innerHTML = '<p style="color:#888;text-align:center;padding:20px">Aucune transaction</p>';
            return;
        }

        let html = '';
        state.transactions.slice(0, 20).forEach(tx => {
            const typeConfig = {
                'purchase': { icon: 'fa-shopping-cart', color: '#2196f3', label: 'Achat' },
                'dividend': { icon: 'fa-coins', color: '#4caf50', label: 'Dividende' },
                'kyc': { icon: 'fa-user-check', color: '#ff9800', label: 'KYC' },
                'ipfs': { icon: 'fa-cloud-upload-alt', color: '#9c27b0', label: 'IPFS' },
                'transfer': { icon: 'fa-exchange-alt', color: '#607d8b', label: 'Transfert' }
            }[tx.type] || { icon: 'fa-circle', color: '#888', label: tx.type };

            const statusBadge = tx.status === 'confirmed'
                ? '<span class="tx-status tx-confirmed">Confirme</span>'
                : '<span class="tx-status tx-pending">En cours</span>';

            html += '<div class="tx-row">' +
                '<div class="tx-icon" style="background:' + typeConfig.color + '20;color:' + typeConfig.color + '">' +
                    '<i class="fas ' + typeConfig.icon + '"></i>' +
                '</div>' +
                '<div class="tx-details">' +
                    '<div class="tx-desc">' + tx.description + '</div>' +
                    '<div class="tx-hash">' + (tx.hash ? tx.hash.slice(0, 18) + '...' : '') + '</div>' +
                '</div>' +
                '<div class="tx-right">' +
                    (tx.amount > 0 ? '<div class="tx-amount">' + tx.amount.toLocaleString('fr-FR') + ' EUR</div>' : '') +
                    '<div class="tx-date">' + new Date(tx.timestamp).toLocaleString('fr-FR') + '</div>' +
                    statusBadge +
                '</div>' +
            '</div>';
        });

        container.innerHTML = html;
    }

    function updateProjectsUI(state) {
        CONFIG.projects.forEach((project, id) => {
            const ps = state.projects[id];
            if (!ps) return;

            const pctFunded = ((ps.sold / project.totalTokens) * 100).toFixed(1);
            const remaining = project.totalTokens - ps.sold;

            const bar = document.getElementById('projectBar-' + id);
            const pctLabel = document.getElementById('projectPct-' + id);
            const raisedLabel = document.getElementById('projectRaised-' + id);
            const investorsLabel = document.getElementById('projectInvestors-' + id);
            const remainingLabel = document.getElementById('projectRemaining-' + id);

            if (bar) bar.style.width = pctFunded + '%';
            if (pctLabel) pctLabel.textContent = pctFunded + '% finance';
            if (raisedLabel) raisedLabel.textContent = ps.raised.toLocaleString('fr-FR') + ' EUR';
            if (investorsLabel) investorsLabel.textContent = ps.investors;
            if (remainingLabel) remainingLabel.textContent = remaining + ' tokens restants';
        });
    }

    // ============================================================
    //               NOTIFICATION SYSTEM
    // ============================================================

    function showNotification(message, type) {
        // Supprimer les anciennes
        document.querySelectorAll('.glam-notification').forEach(n => n.remove());

        const colors = {
            success: { bg: '#e8f5e9', border: '#4caf50', icon: 'fa-check-circle', color: '#2e7d32' },
            error: { bg: '#ffebee', border: '#e53e3e', icon: 'fa-exclamation-circle', color: '#c62828' },
            info: { bg: '#e3f2fd', border: '#2196f3', icon: 'fa-info-circle', color: '#1565c0' },
            warning: { bg: '#fff3e0', border: '#ff9800', icon: 'fa-exclamation-triangle', color: '#e65100' }
        }[type] || { bg: '#f5f5f5', border: '#888', icon: 'fa-bell', color: '#333' };

        const notif = document.createElement('div');
        notif.className = 'glam-notification';
        notif.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10000;padding:16px 24px;border-radius:12px;' +
            'background:' + colors.bg + ';border:2px solid ' + colors.border + ';color:' + colors.color + ';' +
            'font-size:0.9rem;font-weight:600;display:flex;align-items:center;gap:12px;' +
            'box-shadow:0 8px 32px rgba(0,0,0,0.15);animation:slideInRight 0.3s ease;max-width:420px';
        notif.innerHTML = '<i class="fas ' + colors.icon + '" style="font-size:1.2rem"></i><span>' + message + '</span>' +
            '<button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;font-size:1.1rem;color:inherit;margin-left:8px">&times;</button>';

        document.body.appendChild(notif);
        setTimeout(() => { if (notif.parentElement) notif.remove(); }, 5000);
    }

    // ============================================================
    //               GAMIFICATION
    // ============================================================

    function getInvestorLevel(state) {
        const totalTokens = Object.values(state.tokens).reduce((a, b) => a + b, 0);

        if (totalTokens >= 50) return { level: 'Diamant', icon: 'fa-gem', color: '#e91e63', next: null, progress: 100 };
        if (totalTokens >= 20) return { level: 'Or', icon: 'fa-crown', color: '#ffd700', next: 'Diamant (50)', progress: (totalTokens / 50) * 100 };
        if (totalTokens >= 10) return { level: 'Argent', icon: 'fa-medal', color: '#90a4ae', next: 'Or (20)', progress: (totalTokens / 20) * 100 };
        if (totalTokens >= 1)  return { level: 'Bronze', icon: 'fa-award', color: '#cd7f32', next: 'Argent (10)', progress: (totalTokens / 10) * 100 };
        return { level: 'Debutant', icon: 'fa-seedling', color: '#8bc34a', next: 'Bronze (1)', progress: 0 };
    }

    function getAchievements(state) {
        const achievements = [];
        const totalTokens = Object.values(state.tokens).reduce((a, b) => a + b, 0);

        if (state.kycStatus === 'verified') achievements.push({ name: 'Identite Verifiee', icon: 'fa-user-check', color: '#4caf50' });
        if (totalTokens >= 1) achievements.push({ name: 'Premier Token', icon: 'fa-rocket', color: '#2196f3' });
        if (totalTokens >= 10) achievements.push({ name: 'Investisseur Confirme', icon: 'fa-chart-line', color: '#ff9800' });
        if (Object.values(state.tokens).filter(v => v > 0).length >= 2) achievements.push({ name: 'Diversifie', icon: 'fa-th', color: '#9c27b0' });
        if (state.dividends.claimed > 0) achievements.push({ name: 'Premier Dividende', icon: 'fa-coins', color: '#ffd700' });
        if (state.documents.length > 5) achievements.push({ name: 'Archiviste', icon: 'fa-archive', color: '#607d8b' });

        return achievements;
    }

    // ============================================================
    //               LIVE STATS (simulated)
    // ============================================================

    function getLiveStats() {
        const state = getState();
        let totalRaised = 0;
        let totalInvestors = 0;
        let totalTokensSold = 0;

        Object.values(state.projects).forEach(p => {
            totalRaised += p.raised;
            totalInvestors += p.investors;
            totalTokensSold += p.sold;
        });

        return {
            totalRaised: totalRaised,
            totalInvestors: totalInvestors,
            totalTokensSold: totalTokensSold,
            contractsDeployed: CONFIG.mode === 'real' ? 3 : 0,
            networkTPS: (Math.random() * 50 + 100).toFixed(0),
            gasPrice: (Math.random() * 30 + 10).toFixed(1),
            blockNumber: Math.floor(Date.now() / 1000) % 100000000
        };
    }

    // ============================================================
    //               GLOBAL API
    // ============================================================

    window.glamBlockchain = {
        // Config
        config: CONFIG,
        getState: getState,

        // Wallet
        connect: connectWallet,
        disconnect: disconnectWallet,

        // KYC
        submitKYC: submitKYC,

        // Tokens
        buyTokens: buyTokens,

        // Dividendes
        claimDividends: claimDividends,
        simulateDividends: simulateQuarterlyDividends,

        // IPFS
        uploadIPFS: uploadToIPFS,
        verifyIPFS: verifyIPFSHash,

        // Marketplace
        getListings: getMarketplaceListings,

        // Gamification
        getLevel: function() { return getInvestorLevel(getState()); },
        getAchievements: function() { return getAchievements(getState()); },

        // Stats
        getLiveStats: getLiveStats,

        // Notifications
        notify: showNotification,

        // Reset
        reset: function() {
            localStorage.removeItem(STORAGE_KEY);
            showNotification('Blockchain reinitialise', 'info');
            setTimeout(() => location.reload(), 500);
        },

        // Init
        init: function() {
            const state = getState();
            saveState(state); // Assurer que l'etat existe

            // Si la page a le dashboard blockchain
            if (document.getElementById('connectWalletBtn')) {
                document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
                updateWalletUI(state);
            }

            // Mettre a jour la barre de progression des projets (fonctionne aussi sur l'ancienne page)
            updateProjectsUI(state);

            // Mode indicator
            const modeEl = document.getElementById('blockchainMode');
            if (modeEl) {
                modeEl.textContent = CONFIG.mode === 'simulation' ? 'MODE DEMO' : 'MAINNET';
                modeEl.className = CONFIG.mode === 'simulation' ? 'mode-badge mode-demo' : 'mode-badge mode-live';
            }

            console.log('%c[GlamBlockchain] Engine initialise (' + CONFIG.mode + ')', 'color: #d4a59a; font-weight: bold; font-size: 14px');
        }
    };

    // Auto-init quand le DOM est pret
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.glamBlockchain.init);
    } else {
        window.glamBlockchain.init();
    }

    // CSS Animations
    const style = document.createElement('style');
    style.textContent = '@keyframes slideInRight{from{transform:translateX(100px);opacity:0}to{transform:translateX(0);opacity:1}}';
    document.head.appendChild(style);

})();
