# Prompts — LA 20 (plain-pied, l'essentiel)

Même méthode que `PROMPTS-LA30.md` : image maître d'abord, animation ensuite.
Joindre `references/la30-hero-exterieur.png` comme référence de **style et matériaux
uniquement** (préciser au modèle que La 20 n'a PAS d'étage).

---

## A — Image maître EXTÉRIEUR

> Photorealistic architectural visualization, vertical 9:16 composition.
> Use the attached photo only as a reference for materials, mood and lighting —
> but THIS house is SINGLE-STOREY.
>
> A very compact ONE-LEVEL tiny house in a misty pine-forest clearing at dusk.
> Charred-black vertical timber cladding, single flat roof, footprint exactly
> 4 m × 5 m — barely longer than a parked car, about 3 m tall in total.
>
> A full-height corner glass wall glows warm from inside, revealing a small lounge
> with a beige sofa and a black linear kitchen. In front of the glazing, a low teak
> deck terrace with an armchair and warm lanterns. Light fog between the pines,
> small path lights in the grass. High-end archviz render quality.

**Negative** :
> Strictly one storey: no upper floor, no rooftop terrace, no exterior staircase,
> no railing on the roof. Only one bedroom and one shower room inside. No garage,
> no text, no labels, no floor plan in this image.

## B — Image maître CUTAWAY

> Photorealistic aerial dollhouse cutaway, vertical 9:16, camera at 45° from a
> front-side angle. A compact SINGLE-STOREY black-timber tiny house (4 m × 5 m)
> with the flat roof removed, revealing the furnished interior like a model:
> an open lounge/kitchen across the front (beige L-sofa, black linear kitchen,
> small dining nook), one cosy bedroom with a double bed at the back corner, and
> a compact shower room (walk-in shower, WC, basin) beside it. Teak deck terrace
> outside the glazing with lanterns. Misty forest clearing, dusk, warm interior
> light. Ultra-detailed archviz miniature look.

**Negative** : idem A + « exactly three interior zones: living/kitchen, one bedroom,
one shower room — nothing else ».

## C — Vidéo 1 : « Blueprint reveal » (depuis l'image A validée)

> Animate from this exact starting image. 10 seconds, vertical 9:16, 24 fps.
> A glowing white architectural wireframe of THE SAME single-storey volume
> materializes floating above the house, aligned with it, slowly rotating, then
> sinks down and merges onto the real house while the camera pushes in gently
> toward the glowing corner glazing. Drifting mist. No text, no labels.
> The house does not change or morph.

## D — Vidéo 2 : « Dollhouse » (depuis l'image B validée)

> Animate from this exact starting image. 10 seconds, vertical 9:16, 24 fps.
> Slow cinematic aerial orbit (about 30°) around the open single-storey cutaway,
> gentle downward tilt from the deck terrace across the lounge to the bedroom.
> Warm lights, drifting fog, rigid unchanged geometry. No text, no labels.

---

## Checklist QC — avant d'animer

- [ ] **UN SEUL niveau** (le piège : le modèle recopie l'étage de l'image de référence)
- [ ] Pas d'escalier (ni intérieur ni extérieur), pas de garde-corps sur le toit
- [ ] 3 zones intérieures exactement : séjour/cuisine, 1 chambre, 1 salle d'eau
- [ ] Deck bois au sol devant la baie d'angle
- [ ] Compacte : ~5 m de long, ~3 m de haut
- [ ] Bardage noir vertical, toit plat, forêt + brume + lumière chaude
- [ ] Aucun texte/cote/label — format vertical 9:16
