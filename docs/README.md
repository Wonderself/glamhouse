# 📚 Documentation MyGlamHouse

Sommaire de la documentation du projet. Chaque document est autonome ; commencez ici.

## Vue d'ensemble

| # | Document | À lire quand… |
|---|---|---|
| 1 | [ARCHITECTURE.md](ARCHITECTURE.md) | Vous découvrez le projet ou ajoutez une page |
| 2 | [PAGES.md](PAGES.md) | Vous cherchez quelle page fait quoi et son statut |
| 3 | [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) | Vous touchez au style (couleurs, typo, composants) |
| 4 | [MOTION.md](MOTION.md) | Vous ajoutez/modifiez une animation |
| 5 | [REMOTION-ET-MOTION.md](REMOTION-ET-MOTION.md) | Vous voulez produire des vidéos (Remotion) ou moderniser les animations (Motion) |
| 6 | [DEPLOYMENT.md](DEPLOYMENT.md) | Vous déployez ou modifiez Docker/Nginx |
| 7 | [CONTENT.md](CONTENT.md) | Vous rédigez ou modifiez le discours commercial |
| 8 | [BLOCKCHAIN.md](BLOCKCHAIN.md) | Vous croisez `blockchain.js`, `contracts/` ou `tokenisation.html` |
| 9 | [VISUELS-IA.md](VISUELS-IA.md) | Vous générez les visuels photoréalistes (API Flux) |
| 10 | [ROADMAP.md](ROADMAP.md) | Vous vous demandez quoi faire ensuite |

## L'essentiel en 30 secondes

- **Produit** : maisons modulaires bois/chanvre 20–30 m², passives, dès 59 000 €, design Daniel Siboni.
- **Site** : HTML/CSS/JS statique, zéro framework, servi par Nginx (Docker).
- **Design** : la version **Lumière Kinétique** (`motion-lumiere.html`) est la référence — fond clair éditorial + dynamisme cinétique. Noir et Ultra sont des archives.
- **Règle d'or motion** : toute animation respecte `prefers-reduced-motion` et dégrade proprement sur mobile.

## Décisions actées

| Date | Décision |
|---|---|
| 2026-07 | Version fond clair (Lumière) retenue ; style/dynamisme d'Ultra intégré en thème clair ; Noir & Ultra archivées |
| 2026 | Tokenisation retirée du discours commercial (pages/scripts conservés en legacy) |
| 2026 | Positionnement : « extension chez soi », pas « cabane en forêt » |
| 2026 | Logo « GLAMHOUSE » (sans « MY ») |

## Questions ouvertes

Voir [REMOTION-ET-MOTION.md](REMOTION-ET-MOTION.md) § « Questions à trancher » (production vidéo, adoption d'une librairie d'animation) et [ROADMAP.md](ROADMAP.md).
