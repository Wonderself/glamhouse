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
- [ ] **Images de référence client** pour le showcase La 20 / La 30 (le client doit les fournir ; visuel provisoire `maison4.jpg` en place pour La 20).
- [ ] **Chantier Motion n°1** : hero en timeline avec ressorts (vendorer `assets/js/motion` + bascule progressive).
- [ ] **Teaser Remotion** : initialiser `video/` (composition 9/16, plan 4×5 animé, fond blanc, logo + CTA final) une fois le plan validé visuellement par le client.
- [ ] **Vraie planche/plan pour La 30 distincte de La 20** (les deux fichiers actuels sont identiques).
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
