# Prompts — LA 30 (deux niveaux + terrasse rooftop)

Mode d'emploi (dans Gemini ou Flow) :
1. **Joindre les 2 images** `references/la30-hero-exterieur.png` et
   `references/la30-coupe-transversale.png` à chaque prompt.
2. Générer d'abord les **images maîtres** (prompts A et B). Itérer jusqu'à ce que
   la checklist QC en bas de page soit 100 % verte.
3. Seulement ensuite, animer l'image validée avec le **prompt vidéo** (C ou D) en
   mode *image-to-video* (l'image validée = première frame / ingredient).

Les prompts sont en anglais (les modèles vidéo y répondent mieux). Ne pas traduire.

---

## A — Image maître EXTÉRIEUR (à générer et valider en premier)

> Photorealistic architectural visualization, vertical 9:16 composition.
> Use the attached reference photo and the attached cross-section drawing as the
> exact geometry: reproduce THIS house, do not invent another one.
>
> A very compact two-storey tiny house in a misty pine-forest clearing at dusk.
> Charred-black vertical timber cladding, flat roofs. Footprint exactly 4 m × 5 m —
> barely longer than a parked car.
>
> GROUND FLOOR (20 m²): open living room with double-height ceiling (4.2 m),
> full-height corner glass wall glowing warm from inside, small black linear
> kitchen visible at the back.
>
> UPPER LEVEL — CRITICAL: the upper box covers only HALF of the footprint
> (2.5 m × 4 m). It contains one 10 m² bedroom with a full-height sliding glass
> door. The other half of the ground-floor roof is a 10 m² open ROOFTOP TERRACE
> at the same level, DIRECTLY IN FRONT of the bedroom, so the bedroom opens onto
> it. Thin black cable railing around the terrace, two grey lounge chairs and
> potted plants on it.
>
> A slim black steel exterior staircase climbs along the right side wall up to the
> rooftop terrace. At ground level, a low teak deck terrace with a few steps, an
> armchair and warm lanterns in front of the living-room glazing.
>
> Dusk mood, light fog between the pines, warm interior light, small path lights
> in the grass. High-end archviz render quality.

**Negative / à interdire** (ajouter si le modèle dérive) :
> Not a large house. No full second storey covering the whole footprint. Only one
> bedroom, one bathroom. No garage, no corridor, no balcony on posts. No text, no
> labels, no dimension lines, no floating floor plan in this image.

## B — Image maître CUTAWAY (maquette coupée, vue aérienne ¾)

> Photorealistic aerial dollhouse cutaway view, vertical 9:16, camera looking down
> at 45° from a front-side angle. Use the attached cross-section as exact geometry.
>
> The same compact black-timber tiny house (4 m × 5 m footprint) with the roof and
> front walls removed to reveal the furnished interior like an architectural model,
> standing in a misty meadow-forest clearing.
>
> VISIBLE ON THE GROUND FLOOR (20 m²): lounge with beige L-sofa and low table in a
> double-height space, black linear kitchen along the back wall, straight interior
> staircase with LED-lit steps, compact bathroom (walk-in shower, WC, basin) in the
> rear corner.
>
> VISIBLE ON THE UPPER LEVEL: one 10 m² bedroom (double bed, warm bedside lights)
> occupying only HALF of the footprint, and in front of it the 10 m² open rooftop
> terrace with thin black cable railing, grey lounge chairs and plants — the
> bedroom's glass door faces the terrace.
>
> Outside: teak ground deck with lanterns, slim black exterior stair to the rooftop.
> Warm interior lighting, dusk, soft fog. Ultra-detailed archviz miniature look.

**Negative** : idem prompt A + « do not show a single-level house; both levels must
be visible in the cutaway ».

## C — Vidéo 1 : « Blueprint reveal » (à partir de l'image A validée)

*Image jointe = image maître A. Le prompt ne décrit que le mouvement.*

> Animate from this exact starting image. 10 seconds, vertical 9:16, 24 fps.
> A glowing white architectural wireframe of THE SAME two-storey volume (half-width
> upper box + rooftop terrace) materializes floating in the sky above the house,
> perfectly aligned with it, gently rotating. Thin light lines trace the walls,
> the interior stair and the cable railing. The wireframe then sinks down and
> merges onto the real house as the camera slowly pushes in toward the glowing
> living-room glazing. Mist drifts between the pines. No text, no labels.
> The house itself does not change, move or morph.

## D — Vidéo 2 : « Dollhouse » (à partir de l'image B validée)

> Animate from this exact starting image. 10 seconds, vertical 9:16, 24 fps.
> Slow cinematic aerial orbit (about 30°) around the open dollhouse cutaway,
> with a gentle downward tilt revealing first the rooftop terrace and the bedroom,
> then the double-height living room below. Warm lights flicker subtly, fog drifts
> in the background. The geometry, furniture and walls stay perfectly rigid and
> unchanged. No text, no labels, no morphing.

---

## Checklist QC — à cocher AVANT d'animer (sinon régénérer l'image)

- [ ] **Deux niveaux**, et le volume haut ne couvre que la **moitié** de l'emprise
- [ ] **Terrasse rooftop en face de la chambre**, au même niveau, garde-corps câble fin
- [ ] Baie/porte vitrée de la chambre ouvrant sur cette terrasse
- [ ] Salon en **double hauteur** avec baie d'angle toute hauteur
- [ ] **Escalier extérieur** noir fin vers le rooftop + **deck bois au sol**
- [ ] Maison compacte : ~aussi longue qu'une voiture, ~6 m de haut maximum
- [ ] 1 seule chambre, 1 seule SDB, pas de couloir/garage/pièces en trop
- [ ] Bardage bois **noir vertical**, toits plats, ambiance forêt + brume + lumière chaude
- [ ] **Aucun texte/cote/label** dans l'image (les "30m2" flottants des anciens rendus = interdits)
- [ ] Format vertical 9:16
