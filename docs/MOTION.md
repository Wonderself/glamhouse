# Motion — Inventaire des animations & règles

Référence : `motion-lumiere.html` (Lumière Kinétique). Ce document liste **chaque effet**, son déclencheur et sa dégradation.

## Règles d'or

1. **`prefers-reduced-motion: reduce`** ⇒ tout devient statique (reveals visibles, marquees arrêtés, compteurs affichés à leur valeur finale, plan dessiné d'emblée).
2. **`pointer: coarse`** (mobile/tablette) ⇒ pas de curseur custom, pas de magnétisme, pas de tilt, pas de parallaxe pointeur.
3. **Un seul `requestAnimationFrame`** central (`frameFx`) pour les effets continus (nav, progression, skew, showcase, galerie). Les entrées de sections passent par `IntersectionObserver`.
4. Les vidéos ne jouent **que visibles à l'écran** (IntersectionObserver play/pause).
5. Jamais d'animation de `width`/`height`/`top` : uniquement `transform` et `opacity`.

## Inventaire

### Hero (timeline Motion — librairie vendorée)

Depuis 2026-07-18, l'entrée du hero est orchestrée par **Motion v12** (`assets/js/motion.min.mjs`, bundle ESM autonome, aucune requête externe) : eyebrow → lignes du titre (ressorts, stagger) → paragraphe/CTA → chips → fil de scroll.

Mécanisme de sécurité : un script inline pose `html.mlib` avant le premier rendu (sauf reduced-motion) pour neutraliser les keyframes CSS ; si le module ne démarre pas sous 2 s (ou échoue), la classe est retirée et **les animations CSS d'origine reprennent la main**. Ne pas supprimer les keyframes CSS du hero : elles sont le fallback.

### Entrées (déclencheur : IntersectionObserver, une seule fois)

| Effet | Classe/attribut | Description |
|---|---|---|
| Reveal | `.rv` (+ `.rv-d1`→`d4`) | Fade + translateY(34px), délais en cascade |
| Masque de ligne | `.line-mask` | Le texte monte depuis un overflow caché (hero, titres) |
| Séparateur | `.divline` | Filet qui se remplit en dégradé terra (1,3 s) |
| Plan d'architecte | `#bp` + `.draw`/`[data-fade]` | Murs tracés (`stroke-dashoffset`), puis cloisons, fenêtres, portes, mobilier, labels en 4 vagues |
| Compteurs | `[data-count]` (+ `data-dec`, `data-suffix`) | Ease-out cubic 1,5 s, **format français** (virgule) — chips héro, stats, aides |
| Scramble | `[data-scramble]` | Lettres aléatoires qui se verrouillent une à une (kicker final) |

### Boucles (permanentes, coupées par reduced-motion)

| Effet | Où | Description |
|---|---|---|
| Dérive du hero | `.hero-media img` | Zoom lent 1.14 → 1.02 sur 22 s |
| Marquees | `.marq-track`, `.foot-marq .t` | Défilement infini 22–28 s ; terra inversé |
| Dégradé animé | `.grad` | Balayage terra→sand→sage sur 8 s (titres, footer) |
| Scan du plan | `.bp-scan` | Ligne terra qui balaie le plan (4,5 s) |
| Réticule | `.bp-cross` | Croix qui parcourt les pièces (10 s) |
| Pulsation | `.bp-live i`, `.hero-scroll::after` | Points « live » et fil de scroll |

### Réactions au scroll (frame loop)

| Effet | Où | Description |
|---|---|---|
| Barre de progression | `.progress` | Largeur = % de lecture, dégradé terra |
| Nav | `.nav.scrolled` | Verre dépoli + compactage après 40 px |
| **Skew de vélocité** | marquees | `skewX(±8°)` proportionnel à la vitesse de scroll (signature Ultra) |
| Showcase épinglé | `#showcasePin` | 320 vh, bascule chapitre/planche à mi-course |
| Galerie | `#galleryStrip` | Translation horizontale liée à la progression dans le viewport |

### Réactions au pointeur (desktop uniquement)

| Effet | Où | Description |
|---|---|---|
| Curseur custom | `.cursor` + `.cursor-ring` | Point ink instantané + anneau terra avec lerp (0.18) ; anneau grossit sur les interactifs |
| Magnétisme | `[data-magnetic]` | Les boutons suivent le pointeur (×0.3/×0.4) |
| Tilt 3D | `.film` | `rotateX/Y` max 7–8° sur les films 9/16 |
| Blobs | `[data-blobs]` | 3 taches floues (terra/sand/sage) en parallaxe pointeur |
| Hovers | cartes, liens | Filet dégradé, lift, flèches qui glissent, zoom images |

### Texture

| Effet | Où | Description |
|---|---|---|
| Grain | `.fx-grain` | SVG turbulence, opacité 0.05, `mix-blend-mode: multiply` (version claire du grain Ultra) |

## Checklist pour ajouter une animation

- [ ] Elle sert le contenu (pas de mouvement gratuit).
- [ ] `transform`/`opacity` uniquement ; `will-change` seulement si mesuré utile.
- [ ] Fallback `prefers-reduced-motion` écrit **dans le CSS** (pas seulement en JS).
- [ ] Comportement défini sur `pointer: coarse`.
- [ ] Déclencheur : IntersectionObserver (entrée) ou frame loop existante (continu) — pas de nouveau listener scroll.
- [ ] Testée à 640 px, 900 px et grand écran.
- [ ] Documentée dans ce fichier.

## Aller plus loin

Pour l'adoption éventuelle d'une librairie (Motion) ou la production de vidéos (Remotion), voir [REMOTION-ET-MOTION.md](REMOTION-ET-MOTION.md).
