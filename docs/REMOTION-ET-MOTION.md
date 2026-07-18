# Guide — Remotion & Motion

Deux outils, deux usages **très différents**. Ce document explique ce que chacun apporterait à MyGlamHouse, comment l'intégrer à un site statique, et les questions à trancher avant de se lancer.

## En une phrase

| Outil | C'est quoi | Produit quoi | Vit où |
|---|---|---|---|
| **Remotion** | Framework React pour **fabriquer des vidéos par le code** | Des fichiers `.mp4`/`.webm` rendus hors ligne | Un projet Node séparé (`video/`), jamais dans les pages du site |
| **Motion** (ex-Framer Motion, [motion.dev](https://motion.dev)) | Librairie JS d'**animation dans le navigateur** | Des animations plus riches directement dans les pages | Dans le site, via un simple `<script>` (version vanilla) |

⚠️ À ne pas confondre : Remotion ne s'exécute **pas** sur le site — il génère des vidéos qu'on dépose ensuite dans `assets/videos/`. Motion, lui, remplace/complète notre JS d'animation maison.

---

## Remotion — vidéos programmatiques

### Ce que ça permettrait concrètement

1. **Films produit paramétriques** : une seule composition « fiche maison » qui rend la vidéo de La 20 *et* de La 30 en changeant des props (surface, prix, plan) — cohérence parfaite avec le design system (mêmes couleurs, mêmes polices).
2. **Déclinaisons réseaux sociaux** : le même contenu rendu en 9/16 (Reels/TikTok), 1/1 (feed), 16/9 (YouTube) automatiquement.
3. **Animation du plan d'architecte en vidéo** : le SVG animé du site peut être porté quasi tel quel dans Remotion (c'est du React + SVG) pour un teaser partageable.
4. **Vidéos de fond maîtrisées** : remplacer/compléter `maison.mp4` par des séquences typographiques de marque, légères et re-générables.

### Prérequis & coût d'entrée

- Node.js ≥ 18, connaissances React de base.
- Projet séparé : `npx create-video@latest` → dossier `video/` dans le repo (avec son propre `package.json` — le site reste zéro-build).
- Rendu : `npx remotion render` en local, ou GitHub Actions / Remotion Lambda pour automatiser.
- **Licence** : gratuit pour les particuliers et petites structures (≤ 3 personnes) ; au-delà, licence entreprise payante. À vérifier selon la structure de MyGlamHouse.

### Plan d'adoption proposé (incrémental)

1. `video/` avec une composition « Teaser plan 20 m² » (portage du SVG animé) — 1080×1920, 12 s.
2. Rendu local → `assets/videos/teaser-plan.mp4` → intégré dans la section Films.
3. Si concluant : composition « fiche maison » paramétrique + preset multi-formats.
4. Automatisation du rendu en CI (optionnel).

---

## Motion — animations web modernes

### Pourquoi (alors que notre JS maison marche)

Notre stack actuelle (IntersectionObserver + rAF + transitions CSS) couvre déjà beaucoup. Motion apporterait :

- **Animations au scroll pilotées** (`scroll()`) : le showcase épinglé et la galerie deviendraient des timelines *scrubbing* fluides (progression continue) au lieu de bascules à mi-course ;
- **Springs physiques** : magnétisme des boutons et curseur avec inertie naturelle, sans lerp manuel ;
- **Timelines séquencées** : orchestration propre du hero (eyebrow → titre → chips) déclarée en une fois ;
- **Layout animations** : transitions douces si on ajoute des filtres/tri dans la collection ;
- Moins de code impératif à maintenir (notre IIFE fait ~150 lignes d'animation).

### Comment l'intégrer sans rien casser

Motion existe en **version vanilla JS** (~18 Ko min+gzip, ou ~2,5 Ko pour le noyau `animate`) — pas besoin de React :

```html
<script type="module">
  import { animate, scroll, inView } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";
  // Exemple : scrubbing du showcase épinglé
  scroll(animate(".showcase-media figure:nth-child(2)", { opacity: [0, 1] }),
         { target: document.querySelector("#showcasePin") });
</script>
```

Adoption progressive : on garde le JS maison et on migre **un effet à la fois** (commencer par le showcase épinglé, le plus gagnant). Le fallback `prefers-reduced-motion` reste géré par notre CSS.

⚠️ Contrainte actuelle : le site n'a aucune dépendance externe JS (hors Google Fonts). Introduire Motion via CDN ajoute un point de dépendance réseau — alternative : vendorer le fichier dans `assets/js/motion.min.js`.

---

## Questions à trancher (avec le porteur du projet)

Ces questions sont posées dans la conversation projet ; les réponses seront consignées ici.

### Remotion
1. **Objectif n°1 de la vidéo ?** (a) clips réseaux sociaux 9/16, (b) film produit pour le site, (c) teaser du plan animé, (d) pas de besoin vidéo pour l'instant.
2. **Qui produira/rendra les vidéos ?** Local ponctuel vs pipeline automatisé (CI/Lambda).
3. **Contrainte de licence** : taille de la structure (≤ 3 personnes → gratuit).

### Motion
4. **Ambition d'animation du site** : rester en JS maison (zéro dépendance) vs adopter Motion pour le scrubbing/springs.
5. Si adoption : **CDN ou fichier vendoré** dans `assets/` ?
6. **Premier chantier** : showcase épinglé (scrubbing) ? hero (timeline) ? curseur/magnétisme (springs) ?

### Décisions consignées

| Date | Question | Décision |
|---|---|---|
| — | — | *(en attente des réponses)* |
