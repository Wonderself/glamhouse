# Roadmap

État : proposition — à valider/prioriser avec le porteur du projet. Les items cochés sont faits.

## ✅ Fait (juillet 2026)

- [x] Exploration 3 univers (Lumière / Noir / Ultra) + page de sélection.
- [x] **Décision design** : Lumière retenue, dynamisme d'Ultra intégré en thème clair (« Lumière Kinétique »).
- [x] `versions.html` convertie en page d'archives.
- [x] Documentation complète (`README.md`, `CHANGELOG.md`, `docs/`).

## 🎯 Court terme

- [ ] **Réponses Remotion/Motion** : trancher les 6 questions de [REMOTION-ET-MOTION.md](REMOTION-ET-MOTION.md) et consigner les décisions.
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
