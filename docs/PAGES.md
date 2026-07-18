# Inventaire des pages

Statuts : ⭐ **Référence** · ✅ Active · 🗄️ Archive (consultable, non mise en avant) · ⚠️ Legacy (à trancher)

## Pages motion (direction design actuelle)

| Page | Statut | Rôle | Particularités |
|---|---|---|---|
| `motion-lumiere.html` | ⭐ Référence | Vitrine principale — « Lumière Kinétique » : fond clair éditorial + dynamisme cinétique | CSS/JS inline, plan SVG animé, vidéos, curseur custom — voir [MOTION.md](MOTION.md) |
| `motion-lumiere-siboni.html` | ✅ Active | Page « Le Designer » (Daniel Siboni), thème Lumière | Liée depuis la nav et le footer de Lumière |
| `versions.html` | ✅ Active | Page « Archives design » (ex-sélecteur des 3 univers) | Présente Lumière comme retenue, Noir/Ultra comme archives |
| `motion-noir.html` | 🗄️ Archive | Univers Noir (futuriste noir & ambre, HUD) | Non retenu |
| `motion-noir-siboni.html` | 🗄️ Archive | Page Designer, thème Noir | Encore référencée par `motion-noir.html` et `motion-ultra.html` |
| `motion-ultra.html` | 🗄️ Archive | Univers Ultra (cinétique sombre) | Source du langage de mouvement repris dans Lumière |

## Site classique (historique)

| Page | Statut | Rôle |
|---|---|---|
| `index.html` | ✅ Active (entrée Nginx) | Site vitrine historique, contient l'ancre `#contact` utilisée par tous les CTA |
| `collection.html` | ✅ Active | Catalogue des modèles de maisons |
| `construction.html` | ✅ Active | Méthode constructive (ossature bois, chanvre) |
| `projets.html` | ✅ Active | Réalisations / projets |
| `aides.html` | ✅ Active | Simulateur d'aides de l'État (jusqu'à 65 000 €) |
| `investir.html` | ⚠️ Legacy | Page investissement — à revalider avec le repositionnement |
| `artiste.html` | ⚠️ Legacy | Page artiste |
| `admin.html` | ⚠️ Legacy | Back-office de démonstration |
| `tokenisation.html` | ⚠️ Legacy | Tokenisation immobilière — **retirée du discours** (voir [BLOCKCHAIN.md](BLOCKCHAIN.md)) |

## Dépendances de fichiers

| Fichier | Utilisé par |
|---|---|
| `style.css`, `script.js` | Site classique uniquement (pas les pages motion) |
| `blockchain.js` | `tokenisation.html`, `admin.html`, `investir.html` (DApp legacy) |
| `assets/sequoia-hero.jpg` | Hero de Lumière |
| `assets/planche-house-20/30.png` | Showcase épinglé (Lumière), peek (Ultra) |
| `assets/maison.mp4` | Bande vidéo (Lumière, Ultra) |
| `assets/videos/tiny-20.mp4`, `triplex.mp4` | Section Films (Lumière, Ultra) |
| `assets/videos/motion-aurora.mp4` | Manifeste (Ultra uniquement) |

## Liens entrants importants

- Tous les CTA « Démarrer un projet » pointent vers `index.html#contact`.
- Le footer de Lumière pointe vers `versions.html` (« Archives design »).
- ⚠️ Si une page est renommée/supprimée : vérifier `versions.html`, les navs des pages motion, le footer de chaque page **et** le `Dockerfile`.
