# Changelog

Historique des évolutions notables du site MyGlamHouse. Format libre, du plus récent au plus ancien.

## 2026-07-22 — Accueil : vidéo en tête, deux maisons à prix affichés, fond crème

- **Hero vidéo restauré en tout premier écran** : le bloc Sequoia scroll-reveal (animation pilotée par le scroll) est supprimé de `index.html` (HTML + CSS + JS) — retour client : « pas beau ». L'iso-cube CSS est conservé car réutilisé par `collection.html`.
- **Nouvelle section « Deux maisons, prêtes à vivre »** juste sous le hero : **La 20 à 25 000 €** et **La 30 à 37 000 €**, chacune avec sa vidéo générée via fal.ai (`assets/videos/tiny-20.mp4` / `triplex.mp4`), ses specs et un CTA contact. Amélioration des visuels fal.ai prévue en session suivante.
- **Crypto retirée de l'accueil** : section « Investissement et Finance » (tokenisation / blockchain / crypto) supprimée ; plus aucun lien Tokenisation dans la nav, le footer ou le formulaire ; prix d'appel aligné (« Dès 25 000 € »).
- **Fond crème très léger** : `--white` passe de `#FFFFFF` à `#FBF8F2` et les surfaces blanches (cartes, footer, champs) à `#FEFCF7` via `--cream-card` — s'applique à tout le site classique (`style.css`), palette pastel inchangée.
- **Touches éditoriales discrètes** (esprit grand magazine de mode, sans référence reconnaissable) : ligne masthead sous le hero (« GLAMHOUSE · L'ÉDITION MAISONS · ÉTÉ 2026 · PARIS »), hero et titres de sections en serif Fraunces avec italiques terracotta, kickers en petites capitales espacées, prix en serif italique.

## 2026-07-18 (quinquies) — Showcase réaliste : photos + cartouche plan

- Suite au retour client (« rendu beaucoup plus réaliste et beau, inspiré des photos »), le showcase combine désormais **photo réaliste plein cadre** (références client recadrées : `assets/ref-la20.jpg`, `ref-la30.jpg`, + `ref-la20-nuit.jpg` en réserve) et **cartouche plan SVG coté animé** (4 × 5 m ; étage chambre/terrasse) — l'émotion par la photo, la précision par le plan.
- ⚠️ **Droits des photos à confirmer** avant mise en production (sources : page Facebook Glam House.LA et render Pinterest).

## 2026-07-18 (quater) — Planches SVG animées du showcase (style références client)

- Le showcase La 20 / La 30 affiche désormais **deux planches SVG animées** (élévation + plans, tracé progressif à l'activation du chapitre) dans le style des références fournies : bois clair claire-voie, grandes baies, terrasse à garde-corps bois.
- Dimensions strictement conformes aux décisions : La 20 = plain-pied 4 × 5 m ; La 30 = 4 × 5 m au sol + chambre 10 m² à l'étage face à sa terrasse de 10 m², hauteur ≈ 4,2 m, 30 m² habitables / 40 m² vécus.

## 2026-07-18 (ter) — Chantier Motion n°1 : hero en timeline

- **Motion v12 vendorée** dans `assets/js/motion.min.mjs` (bundle ESM autonome, zéro CDN).
- Le hero de `motion-lumiere.html` est désormais orchestré en **timeline à ressorts** (eyebrow → titre en stagger → texte/CTA → chips → fil de scroll), avec fallback automatique vers les keyframes CSS d'origine si le module ne démarre pas sous 2 s, et respect de `prefers-reduced-motion`.

## 2026-07-18 (bis) — Fond blanc + plan La 20 corrigé (décisions client)

- **Fond blanc généralisé** (`--paper: #FFFFFF`) sur `motion-lumiere.html` et `versions.html` — directive client : tout le site en fond blanc.
- **Plan d'architecte animé corrigé** : l'ancienne géométrie 6,66 × 3 m (héritée de Sequoia/Ultra) était invalide. Nouveau plan **La 20 = 4 × 5 m plain-pied**, fidèle à la planche produit sans l'escalier : séjour au canapé-lit (salon/chambre), cuisine linéaire, salle d'eau complète, coin repas.
- **Showcase corrigé** : textes exacts (La 20 plain-pied 4×5 ; La 30 = 20 m² au sol + chambre 10 m² à l'étage face à sa terrasse de 10 m², 30 m² habitables / 40 m² vécus) et visuels différenciés — les deux planches étaient le même fichier ; `maison4.jpg` sert de provisoire pour La 20 en attendant les images de référence client.
- **Décisions Remotion/Motion consignées** dans `docs/REMOTION-ET-MOTION.md` : Motion en adoption progressive (hero en timeline d'abord), Remotion en rendu local (teaser plan + clips sociaux, logo + CTA final).

## 2026-07-18 — Lumière Kinétique + documentation

- **Décision design actée** : la version fond clair (Lumière) est retenue ; Noir et Ultra passent en archives.
- **Refonte de `motion-lumiere.html`** : la base éditoriale fond clair intègre le langage de mouvement d'Ultra, adapté au thème clair :
  - plan d'architecte SVG animé (tracé progressif, scan, réticule, cotes) déclenché au scroll ;
  - curseur personnalisé (point + anneau) et boutons magnétiques (desktop uniquement) ;
  - barre de progression de lecture, grain photographique, blobs d'ambiance réactifs au pointeur ;
  - grands marquees éditoriaux (dont un inversé sur fond terracotta) avec skew lié à la vélocité du scroll ;
  - compteurs animés au format français (virgule décimale) : 20 m², 1,5 mois, 59 k€, 65 000 € ;
  - bande vidéo plein écran (`maison.mp4`) + section « Films » 9/16 avec tilt 3D au survol ;
  - effet scramble sur le kicker final, texte à dégradé animé, lignes de séparation qui se dessinent ;
  - marquee géant en pied de page (texte outline + dégradé) ;
  - lecture vidéo uniquement à l'écran (IntersectionObserver), respect de `prefers-reduced-motion` partout.
- **`versions.html`** : le sélecteur d'univers devient la page « Archives design » (Lumière = version retenue, Noir/Ultra = archives consultables).
- **Documentation créée** : `README.md`, `CHANGELOG.md` et le dossier `docs/` complet (architecture, pages, design system, motion, guide Remotion/Motion, déploiement, contenu, blockchain legacy, roadmap).

## 2026 (antérieur) — Exploration 3 univers

- Ajout des 6 pages motion au Dockerfile de déploiement.
- Logo GLAMHOUSE (sans « MY ») + nouveau titre sur la page de sélection.
- Menu mobile (burger) sur les 3 versions + pages Designer.
- Responsive des 3 versions corrigé (iPhone 11 → grands écrans).
- Ajout de la 3ᵉ version Ultra (cinétique) + page de garde des 3 univers.
- Retrait de la tokenisation du discours, renforcement des arguments, ajout de la page Designer.
- Repositionnement du discours : extension chez soi, pas cabane en forêt.
- Ajout des 2 versions haut de gamme : Lumière (éditorial) et Noir (futuriste).

## Historique initial

- Remplacement du plan Sequoia par un vrai plan d'architecte (SVG).
- Sequoia : plan corrigé (3 × 6,66 m) + planche statique + hero scroll-reveal.
- Plans 3D interactifs + swap images + messaging tokens simplifié.
- Responsive mobile réécrit de zéro (téléphone / tablette).
- Commit initial : site MyGlamHouse complet + DApp blockchain.
