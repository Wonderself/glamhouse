# Visuels IA — pipeline de génération

Décision (2026-07-19) : générer les visuels définitifs du showcase (et à terme du site) via une **API d'images photoréaliste**, pilotée depuis les sessions Claude. Les photos actuelles (`ref-la20.jpg`, `ref-la30.jpg`) sont des **maquettes provisoires sans droits confirmés** — à remplacer avant mise en production.

## Mise en route (à faire une fois, ~2 minutes)

1. Créer un compte sur **[replicate.com](https://replicate.com)** *ou* **[fal.ai](https://fal.ai)** (les deux marchent, Replicate est le plus simple).
2. Ajouter un moyen de paiement (facturation à l'image : **~0,03–0,06 € par image** avec Flux ; un pack complet de visuels du site ≈ 2–5 €).
3. Récupérer la clé API : Replicate → Account → API tokens (`r8_…`) ; fal.ai → Keys (`key_id:key_secret`).
4. La transmettre dans la conversation Claude (⚠️ **jamais dans le repo / un commit**) — elle sera utilisée comme variable d'environnement le temps de la session.

## Modèles recommandés

| Modèle | Usage | Prix indicatif |
|---|---|---|
| `black-forest-labs/flux-1.1-pro` | Rendus finaux photoréalistes | ~0,04 $/image |
| `black-forest-labs/flux-schnell` | Itérations rapides / brouillons | ~0,003 $/image |
| `black-forest-labs/flux-kontext-pro` | **Éditer une image existante** (ex : partir du render validé et changer un détail) | ~0,04 $/image |

Workflow conseillé : itérer en `schnell` (10–20 essais pour caler le style), finaliser en `1.1-pro` (2K), retoucher en `kontext`.

## Prompts de base (à affiner ensemble)

Constantes de marque à inclure : bois clair en claire-voie (vertical wood slats), grandes baies vitrées toute hauteur, terrasse en bois, ambiance jardin français, lumière douce dorée, style photo d'architecture (35 mm, f/8), **pas de personnes**.

**La 20 (plain-pied 4 × 5 m) :**
> Architectural photography of a small modern garden studio, 4 by 5 meters footprint, single story flat roof, light natural wood vertical slat cladding, one full-height glass sliding wall revealing a warm minimalist interior with a sofa bed, large wooden deck terrace in front, lush green French garden, soft golden hour light, ultra realistic, 35mm architectural photo, no people

**La 30 (deux niveaux, chambre face terrasse) :**
> Architectural photography of a modern two-level wooden garden house, 4 by 5 meters footprint, ground floor with double-height glass facade, partial upper level bedroom opening onto a rooftop wood deck terrace with wooden railing facing the bedroom, light natural wood vertical slat cladding, lush green French garden, soft golden hour light, ultra realistic, 35mm architectural photo, no people

**Déclinaisons prévues** : intérieur séjour canapé-lit (La 20), chambre étage vue terrasse (La 30), vue crépuscule fenêtres allumées (hero alternatif), détail claire-voie (textures).

## Règles d'intégration

- L'IA **ne garantit pas les cotes** : les dimensions restent portées par les cartouches plan SVG (précis) ; la photo porte l'émotion. Ne jamais annoter une image IA avec des cotes.
- Sortie : JPEG qualité ~85, largeur max 1600 px (poids < 300 Ko), nommage `assets/gen-la20-*.jpg` / `gen-la30-*.jpg`.
- Renommer le fichier à chaque remplacement (cache Nginx 30 j immutable — voir [DEPLOYMENT.md](DEPLOYMENT.md)).
- Mention légale : images génératives = pas de droits tiers, mais rester cohérent avec le produit réel (ne pas montrer ce qu'on ne vend pas).

## Direction artistique validée (2026-07-19)

- Bardage **bois clair + menuiseries noires mates** ; toit plat strict, volumes cubiques compacts (crédibles 4 × 5 m).
- Décor : **grand jardin paysager luxuriant** — lavandes, graminées, pots terre cuite, oliviers.
- Lumière : **golden hour** ; intérieurs chaleureux visibles à travers les baies ; guirlandes/appliques chaudes ; mobilier minimaliste noir ; jamais de personnes.
- La 20 : canapé-lit visible (pas de lit fixe). La 30 : terrasse rooftop à **garde-corps métal noir fin**, porte-fenêtre de la chambre ouvrant dessus.
- Angles retenus : 3/4 hauteur d'œil (principal), légère plongée drone, détail matière.
- Format série 1 : portrait 3:4 (showcase).

## Vidéo (image-to-video)

Pipeline validé le 2026-07-19 — films drone 9:16 pour les réseaux :

1. **Source** : un render validé (`gen/la*-pro-*.jpg`), recadré 9:16 (720×1280).
2. **Génération** : fal.ai `fal-ai/kling-video/v2.1/pro/image-to-video` (~0,45 €/clip de 5 s), 4 clips par maison : approche avant · dolly lent vers la baie · arc latéral ~60° · montée top-down. Prompts avec « architecture stays perfectly consistent and rigid » + negative « warping, morphing, people ».
3. **Montage** : ffmpeg local (gratuit) — rampes de vitesse ×1,8 / ×0,6 / ×1,8 / ×1 + fondu final, concat 30 fps → film ~19 s (`scratchpad/montage.sh`).

**Limite constatée et parade validée (v2)** : les plans proches restent fidèles ; le **top-down pur invente le toit** (jamais vu par le modèle). Solution appliquée : remplacer le top-down par une **vue aérienne 3/4 haute** qui garde la façade connue à l'image, et verrouiller chaque prompt avec le **mégaprompt spec produit** (à réutiliser tel quel) :

> *STRICT ARCHITECTURE, NEVER MODIFY: the house is one perfect rectangular box, 4 meters wide and 5 meters deep, flat roofs only, no pitched roof, no overhang, no extra wings. [La 20 : single story…] [La 30 : ground floor fully glazed (open kitchen, small bathroom, interior staircase); upper level covers ONLY the rear half: 10 m² bedroom; the front half of the roof is a 10 m² rooftop wooden deck terrace with a very thin matte black metal railing…] The building must keep exactly the same size, shape and proportions during the whole shot.*

- Négatif : `pitched roof, gable roof, sloped roof, roof overhang, extra wings, additional volumes, enlarged building, balcony planters, warping architecture, morphing, people, text`.
- Audit systématique : extraire les frames à 2,5 s et 4,5 s de chaque clip **avant** montage ; tout clip qui déforme le volume est régénéré ou coupé.
- v2 en production : La 20 = c1/c2/c3 d'origine + c4b régénéré ; La 30 = c1/c2 d'origine + c3b/c4b régénérés. Films web : `assets/videos/drone-la20.mp4`, `drone-la30.mp4` (section Films du site).

## Statut

- [x] Décision : API images (fal.ai + Flux) — validée par le client.
- [x] Compte fal.ai créé + clé API transmise en session (jamais dans le repo).
- [x] Série 1 générée : 8 brouillons `flux/schnell` → direction validée → 6 finaux `flux-pro v1.1`.
- [x] Showcase : `assets/gen-la20-golden.jpg` et `gen-la30-golden.jpg` en place ; les `ref-*.jpg` provisoires (droits incertains) sont **supprimés** du repo.
- [ ] Validation client des 2 rendus retenus (autres candidats pro disponibles en session).
- [ ] Déclinaisons : hero 16:9, carré 1:1 réseaux, intérieurs, détail matière.
