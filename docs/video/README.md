# Kit vidéo GLAMHOUSE — Stratégie & plan d'exécution

**Objectif** : produire 2 vidéos de présentation (une par maison — *La 20* et *La 30*)
dans le style des vidéos "plan qui flotte → maquette coupée vue de haut" (blueprint
reveal → dollhouse cutaway), mais **géométriquement exactes** par rapport aux mesures
du site, au bon format (vertical 720×1280, 8–10 s, boucle muette).

---

## 1. Diagnostic — pourquoi les rendus précédents étaient "nuls"

Analyse des 2 vidéos Gemini fournies + des 2 vidéos déjà dans le site
(`assets/videos/tiny-20.mp4`, `assets/videos/triplex.mp4`) :

| Problème constaté | Réalité attendue |
|---|---|
| Grande maison de plain-pied, 3 chambres, 2 SDB | La 30 = **2 niveaux**, 1 chambre, 1 SDB |
| Plan flottant fantaisiste, cotes illisibles ("30m2" écrit partout) | Plan = celui de la planche du site (4×5 m) |
| Aucun étage, aucune terrasse rooftop | Chambre 10 m² à l'étage + terrasse rooftop 10 m² **en face** |
| Volume ~2× trop grand par rapport à la voiture | Emprise 4×5 m : à peine plus longue qu'une voiture |

**Cause racine** : les prompts étaient en *text-to-video* pur. Sans image de contrainte,
Veo/Gemini invente une maison générique "modulaire" et ignore les mesures.

Bug annexe découvert : `assets/planche-house-20.png` et `assets/planche-house-30.png`
sont **le même fichier** (MD5 identique). Le site montre la planche de la 30 pour les
deux maisons. À corriger (voir `INTEGRATION.md` §4).

## 2. La solution — pipeline "image d'abord" (image-to-video)

La géométrie ne se verrouille pas par le texte, elle se verrouille par **l'image de
départ**. Pipeline en 3 étapes :

```
ÉTAPE 1 — Image fixe exacte          ÉTAPE 2 — Animation           ÉTAPE 3 — Post-prod
(Gemini / Nano Banana / Imagen)      (Veo 3 image-to-video         (recadrage 9:16,
 prompt géométrique                   ou Flow "ingredients")        compression <5 Mo,
 + crops de référence en PJ    ──►    prompt = mouvement     ──►    intégration site)
 itérer jusqu'à checklist OK          caméra uniquement
```

1. **Générer d'abord une IMAGE** (pas une vidéo) dans Gemini en joignant les
   références de `references/` (surtout `la30-coupe-transversale.png` et
   `la30-hero-exterieur.png`) avec le prompt "image maître" de `PROMPTS-LA30.md`.
   Régénérer jusqu'à ce que la **checklist QC** du fichier de prompts soit 100 % verte.
2. **Animer cette image validée** avec Veo en mode *image-to-video* (dans Gemini :
   joindre l'image puis demander la vidéo ; dans Flow : l'utiliser comme *ingredient*
   ou première frame). Le prompt vidéo ne décrit alors **que le mouvement de caméra** —
   la maison, elle, est déjà correcte.
3. Post-production et intégration dans les 3 versions du site : voir `INTEGRATION.md`.

## 3. Fichiers du kit

| Fichier | Rôle |
|---|---|
| `GEOMETRIE.md` | **Source de vérité** des mesures des 2 maisons (à ne jamais contredire) |
| `PROMPTS-LA30.md` | Prompts prêts à coller (image maître, cutaway, vidéo) + checklist QC — La 30 |
| `PROMPTS-LA20.md` | Idem pour La 20 (plain-pied) |
| `INTEGRATION.md` | Où et comment brancher les mp4 finaux dans le site + specs techniques |
| `references/la30-hero-exterieur.png` | Photo de référence extérieure (à joindre aux prompts) |
| `references/la30-coupe-transversale.png` | Coupe cotée — la contrainte géométrique la plus forte |
| `references/la30-plans-3niveaux.png` | Plans RDC / étage / rooftop cotés |

## 4. Découpage en sessions

- **Session A (faite — cette session)** : diagnostic, source de vérité géométrique,
  extraction des références, rédaction des prompts, plan d'intégration.
- **Session B (vous, dans Gemini/Flow)** : générer les images maîtres puis les vidéos
  avec les prompts fournis. Compter 3–6 itérations d'image par maison ; ne lancer la
  vidéo qu'une fois l'image validée. Rapporter les mp4 (720×1280 ou plus).
- **Session C (Claude, nouvelle session)** : donner les mp4 en pièce jointe et demander :
  *« Applique docs/video/INTEGRATION.md avec ces fichiers »* → contrôle qualité contre
  `GEOMETRIE.md`, compression, remplacement de `tiny-20.mp4`/`triplex.mp4`, fix de la
  planche 20, commit + push.

Chaque fichier MD est autonome : une session peut être exécutée sans relire les autres
conversations.
