# Roadmap

État : proposition — à valider/prioriser avec le porteur du projet. Les items cochés sont faits.

## ✅ Fait (juillet 2026)

- [x] Exploration 3 univers (Lumière / Noir / Ultra) + page de sélection.
- [x] **Décision design** : Lumière retenue, dynamisme d'Ultra intégré en thème clair (« Lumière Kinétique »).
- [x] `versions.html` convertie en page d'archives.
- [x] Documentation complète (`README.md`, `CHANGELOG.md`, `docs/`).

## 🎯 Court terme

- [x] **Réponses Remotion/Motion** : décisions consignées dans [REMOTION-ET-MOTION.md](REMOTION-ET-MOTION.md) (adoption progressive de Motion — hero en timeline d'abord ; Remotion en rendu local — teaser plan + clips sociaux).
- [x] **Fond blanc** : directive appliquée (`--paper: #FFFFFF`) sur Lumière et versions.html.
- [x] **Plan La 20 corrigé** : 4 × 5 m, disposition planche sans escalier (canapé-lit, cuisine, SDB, repas).
- [x] **Images de référence client** reçues (bois clair claire-voie, grandes baies, terrasse à garde-corps) → showcase remplacé par **deux planches SVG animées** dans ce style, aux dimensions validées (La 20 : 4×5 plain-pied ; La 30 : +chambre 10 m² face terrasse 10 m², ≈4,2 m).
- [x] **Chantier Motion n°1** : hero en timeline avec ressorts — Motion v12 vendorée (`assets/js/motion.min.mjs`), fallback CSS automatique (voir [MOTION.md](MOTION.md)).
- [ ] **Chantier Motion n°2 (proposé)** : showcase épinglé en scrubbing continu avec `scroll()`.
- [ ] **Visuels IA définitifs** : dès réception de la clé API Replicate/fal → générer les renders La 20 / La 30 et remplacer les photos provisoires sans droits (voir [VISUELS-IA.md](VISUELS-IA.md)).
- [ ] **Teaser Remotion** : initialiser `video/` (composition 9/16, plan 4×5 animé, fond blanc, logo + CTA final) une fois le plan validé visuellement par le client.
- [x] **Visuels La 20 / La 30 distincts** : planches SVG animées inline dans le showcase (les PNG identiques ne sont plus utilisés là ; `planche-house-*.png` restent dans `assets/` pour d'autres usages).
- [ ] **Harmoniser le site classique** avec la direction Lumière : `index.html` (point d'entrée réel) a encore l'ancien look — soit le rhabiller aux couleurs Lumière, soit faire de `motion-lumiere.html` la vraie page d'accueil (MAJ `nginx.conf` `index` + liens).
- [ ] Page « Le Designer » (`motion-lumiere-siboni.html`) : la passer au niveau de finition de la nouvelle Lumière (mêmes composants/motion).
- [ ] Formulaire de contact réel (aujourd'hui les CTA pointent vers `index.html#contact`).
- [ ] Favicon + balises Open Graph/Twitter (partage réseaux sociaux) sur toutes les pages actives.

## 🧭 Moyen terme

- [ ] Extraire un `lumiere.css`/`lumiere.js` partagés si d'autres pages adoptent le design system (voir [ARCHITECTURE.md](ARCHITECTURE.md)).
- [ ] Optimisation médias : poids des `.jpg/.png` (WebP/AVIF), `loading="lazy"` hors hero, poster vidéo dédié.
- [ ] Vraie page 404 (aujourd'hui fallback silencieux vers `index.html`).
- [ ] Accessibilité : audit contrastes (texte sur photos), navigation clavier du menu burger.
- [ ] Analytics respectueux (Plausible/Matomo) si besoin de mesure.

## 🌅 Long terme / à trancher

- [ ] Sort des pages legacy : `investir.html`, `artiste.html`, `admin.html`, `tokenisation.html` (voir [BLOCKCHAIN.md](BLOCKCHAIN.md)).
- [ ] Production vidéo Remotion (si décidée) : teaser plan animé → fiches maisons multi-formats.
- [ ] Migration des effets scroll vers Motion (si décidée) : showcase épinglé en scrubbing d'abord.
- [ ] Versions EN du site si marché export.
