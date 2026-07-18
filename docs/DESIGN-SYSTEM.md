# Design System — Lumière Kinétique

Référence : `motion-lumiere.html`. Tout nouveau développement visuel part d'ici.

## Philosophie

**Éditorial nature-luxe, en mouvement.** Le calme d'un magazine d'architecture (papier, serif, hairlines) traversé par un langage cinétique précis (marquees, compteurs, plan qui se dessine). La lumière domine ; le sombre n'existe que comme **contraste ponctuel** (showcase épinglé, bandes vidéo) — jamais comme fond global.

## Palette (tokens CSS)

> **Directive client (2026-07)** : tout le site doit être **fond blanc** — pas de fond papier crème global. Les teintes chaudes ne servent que pour les surfaces secondaires (sections alternées, cartes).

| Token | Valeur | Usage |
|---|---|---|
| `--paper` | `#FFFFFF` | Fond principal (blanc) |
| `--paper-deep` | `#F6F3ED` | Fond de section alternatif (Achat) |
| `--paper-card` | `#FBFAF7` | Cartes, hover, fond du plan |
| `--ink` | `#1E1D1A` | Texte, section sombre (showcase), murs du plan |
| `--ink-soft` | `#57544C` | Texte secondaire |
| `--terra` | `#C08A6D` | Accent principal (terracotta) |
| `--terra-deep` | `#A06B4F` | Accent foncé (hover, cloisons du plan) |
| `--sand` | `#D9B48F` | 3ᵉ teinte des dégradés |
| `--sage` | `#97A98D` | Vert nature (fenêtres du plan, blobs) |
| `--hairline` | `rgba(30,29,26,.14)` | Filets, bordures |
| `--glow` | `rgba(160,107,79,.35)` | Ombres portées des accents |

**Dégradé signature** (`.grad`, équivalent clair du « holo » d'Ultra) :
`terra-deep → terra → sand → sage`, animé (`gradShift`, 8 s). Sur texte via `background-clip: text`.

Sur photo/vidéo sombre : texte blanc + accent `#E8C7B0` (terra éclairci).

## Typographie

| Famille | Token | Rôle |
|---|---|---|
| **Fraunces** (300/400, italiques) | `--serif` | Titres, emphases italiques — voix éditoriale |
| **Outfit** (300→800) | `--sans` | Corps, boutons, marquees (700/800) |
| **Space Mono** | `--mono` | Kickers, labels, chips, cotes du plan — voix technique héritée d'Ultra |

Règles :
- Titres : serif 300, `letter-spacing: -0.015em`, tailles en `clamp()`.
- Emphase dans un titre : `<em>` italique, éventuellement `.grad`.
- Labels techniques : `.mono` uppercase, letter-spacing large (`.14em`–`.3em`).
- Numérotation des cartes : mono `/01`, `/02`… (héritage Ultra).

## Composants

| Composant | Classes | Notes |
|---|---|---|
| Bouton | `.btn` + `-solid` / `-ghost` / `-dark` | Pilule, uppercase, flèche `.arr` qui glisse au hover, `data-magnetic` |
| Chip | `.chip` | Mono, verre dépoli sur photo, compteur `data-count` possible |
| Kicker | `.kicker` | Mono terracotta + trait de 44 px |
| Carte avantage/étape | `.adv-card`, `.step` | Filet dégradé qui se déploie en bas au hover |
| Carte investissement | `.invest-card` | Radius 20, lift + ombre au hover |
| Marquee | `.marq` (+ `--terra`) | Gros texte 700 uppercase alterné serif italique, séparateur ✦ |
| Séparateur | `.divline` | Se dessine en dégradé à l'entrée dans le viewport |
| Plan d'architecte | `.bp` | Carte papier, grille 26 px, SVG animé (voir [MOTION.md](MOTION.md)) |
| Stat | `.stat` | Chiffre serif géant + label mono, compteur animé |

## Grille & espacements

- Conteneur : `.wrap` max 1360 px, gouttières `clamp(20px, 4vw, 56px)`.
- Rythme vertical des sections : `clamp(90px, 14vh, 170px)` ; resserré à 52 px sous 640 px.
- Grilles de cartes : `gap: 1px` sur fond `--hairline` (effet filet éditorial).
- Radius : 100px (pilules), 14–20 px (cartes/médias).

## Ce qui est proscrit

- Fond sombre global (c'était Ultra — archivé).
- Couleurs acid/néon (`#C6FF3D`, cyan) : remplacées par terra/sand/sage.
- Plus de 2 polices d'accent par page ; Syne n'est pas utilisée dans Lumière.
- Toute animation sans fallback `prefers-reduced-motion`.
