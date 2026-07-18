# Architecture technique

## Stack

| Couche | Choix | Pourquoi |
|---|---|---|
| Front | HTML/CSS/JS **pur** (ES5-compatible) | Zéro build, zéro dépendance, performance maximale, maintenance triviale |
| Polices | Google Fonts (Fraunces, Outfit, Space Mono) | Chargées avec `preconnect` |
| Serveur | Nginx (alpine) | Statique + gzip + cache headers |
| Conteneur | Docker | Déploiement reproductible |
| Legacy | Hardhat + Solidity (`contracts/`) | DApp historique, non branchée au discours actuel |

Il n'y a **ni `package.json`, ni bundler, ni framework**. C'est un choix délibéré : le site est un ensemble de pages statiques autonomes.

Unique dépendance front (vendorée, servie localement) : **Motion v12** dans `assets/js/motion.min.mjs`, utilisée par le hero de `motion-lumiere.html` avec fallback CSS automatique — voir [MOTION.md](MOTION.md).

## Deux familles de pages

### 1. Le site « classique » (historique)
`index.html`, `collection.html`, `construction.html`, `projets.html`, `aides.html`, `investir.html`, `artiste.html`, `admin.html`, `tokenisation.html`
→ partagent `style.css` et `script.js` (+ `blockchain.js` pour les pages DApp).

### 2. Les pages « motion » (direction design actuelle)
`motion-lumiere.html` (⭐ référence), `motion-lumiere-siboni.html`, `motion-noir.html`, `motion-noir-siboni.html`, `motion-ultra.html`, `versions.html`
→ **totalement autonomes** : CSS et JS inline dans chaque fichier. Aucune ne dépend de `style.css`/`script.js`.

**Pourquoi inline ?** Chaque univers avait sa propre identité pendant l'exploration ; l'autonomie permettait d'itérer sans effet de bord. Maintenant qu'une seule version est retenue, une extraction vers des fichiers partagés est envisageable (voir [ROADMAP.md](ROADMAP.md)) mais pas obligatoire : la page se suffit à elle-même et se met en cache très bien.

## Conventions de code

- **Langue** : tout en français (contenu, commentaires, commits).
- **JS** : IIFE unique en bas de page, `'use strict'`, pas de dépendance externe.
  Helpers standards : `$` / `$$` (querySelector), `reduced` (prefers-reduced-motion), `coarse` (pointer coarse).
- **Animations au scroll** : `IntersectionObserver` (jamais de listener scroll pour les reveals) ; les effets continus passent par un seul `requestAnimationFrame` central (`frameFx`).
- **Vidéos** : `autoplay muted loop playsinline` + lecture/pause via IntersectionObserver (économie batterie/CPU).
- **Responsive** : breakpoints principaux `1000px` (plan), `900px` (nav burger, grilles), `760px` (films), `640px` (rythme vertical resserré).
- **Accessibilité** : décor en `aria-hidden`, alternatives `prefers-reduced-motion`, curseur custom uniquement `pointer: fine`.

## Flux de navigation

```
index.html (entrée Nginx, site classique)
   └── versions.html (archives design)
          ├── motion-lumiere.html  ⭐ référence design
          │      └── motion-lumiere-siboni.html (Designer)
          ├── motion-noir.html (archive) ── motion-noir-siboni.html
          └── motion-ultra.html (archive)

motion-lumiere.html → collection / construction / projets / aides / index#contact
```

## Où vivent les choses

| Besoin | Emplacement |
|---|---|
| Images & vidéos | `assets/` (vidéos dans `assets/videos/`) |
| Plans de maisons | `assets/planche-house-20.png`, `assets/planche-house-30.png` + SVG inline dans les pages |
| Config serveur | `nginx.conf` (voir [DEPLOYMENT.md](DEPLOYMENT.md)) |
| Contrats Solidity | `contracts/` (legacy, voir [BLOCKCHAIN.md](BLOCKCHAIN.md)) |
| Documentation | `docs/` + `README.md` + `CHANGELOG.md` |

## Pièges connus

- **Nouvelle page = MAJ Dockerfile** : le `Dockerfile` copie les fichiers un par un ; une page non listée ne sera pas déployée.
- **`nginx.conf` fait un fallback SPA** vers `index.html` : une URL de page inexistante n'affiche pas de 404 mais le site classique.
- **`bpscan` (plan animé)** : la valeur `translateX(437px)` est calibrée sur le viewBox 620×600 du SVG ; si le plan change de géométrie, recalculer (largeur intérieure − largeur du trait).
