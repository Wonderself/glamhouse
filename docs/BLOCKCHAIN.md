# Blockchain (legacy)

## Statut : ⚠️ retiré du discours commercial

La tokenisation immobilière a été **retirée du positionnement** du site. Les fichiers restent dans le dépôt à titre de conservation, mais ne doivent plus être mis en avant ni liés depuis les pages motion.

Seule trace autorisée côté marketing : la note « paiement en cryptomonnaie (Bitcoin, Ethereum, USDT) accepté sur devis, sous réserve de conformité KYC » dans la section Achat.

## Inventaire des fichiers

| Fichier | Rôle |
|---|---|
| `contracts/GlamToken.sol` | Token du projet |
| `contracts/GlamSTO.sol` | Security Token Offering |
| `contracts/GlamDividends.sol` | Distribution de dividendes |
| `blockchain.js` | DApp front (connexion wallet, interactions contrats) — utilisé par `tokenisation.html`, `admin.html`, `investir.html` |
| `hardhat.config.js` | Config Hardhat (compilation/déploiement) |
| `scripts/deploy.js` | Script de déploiement des contrats |
| `tokenisation.html` | Page legacy de présentation de la tokenisation |

## Particularités de déploiement

- Le `Dockerfile` copie `contracts/` dans l'image et `nginx.conf` sert `/contracts/` en `text/plain` (contrats téléchargeables). À retirer du Dockerfile si l'abandon devient définitif.
- Hardhat n'a **pas** de `package.json` dans ce repo : l'outillage n'est pas installable en l'état (les dépendances n'ont jamais été commitées). Pour recompiler un jour : `npm init -y && npm i -D hardhat @nomicfoundation/hardhat-toolbox`.

## Options pour l'avenir (à trancher)

1. **Statu quo** (actuel) : fichiers conservés, non liés, non mis en avant.
2. **Archivage propre** : déplacer le tout dans `legacy/blockchain/` et retirer `contracts/` + `tokenisation.html` du Dockerfile.
3. **Suppression** : possible puisque l'historique git conserve tout.

La décision est consignée dans [ROADMAP.md](ROADMAP.md) quand elle est prise.
