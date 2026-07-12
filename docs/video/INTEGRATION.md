# Intégration des vidéos finales dans le site

À exécuter (session C) une fois les mp4 générés et validés contre les checklists QC.
Instruction type à donner à Claude : *« Applique docs/video/INTEGRATION.md avec les
fichiers joints la-20.mp4 / la-30.mp4 »*.

---

## 1. Spécifications techniques cibles

Identiques aux vidéos actuellement servies par le site :

| Propriété | Valeur |
|---|---|
| Résolution | **720 × 1280** (vertical 9:16) |
| Durée | 8–10 s, pensée pour boucler |
| Codec / conteneur | H.264 (profil high), MP4, `-movflags +faststart` |
| Framerate | 24 fps |
| Audio | **aucun** (piste supprimée) |
| Poids | **< 4,5 Mo** par fichier |
| Nommage | `assets/videos/la-20.mp4` et `assets/videos/la-30.mp4` |

Commande de conversion (depuis un mp4 source quelconque, ex. 1080×1920) :

```bash
ffmpeg -i source.mp4 -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,fps=24" \
  -an -c:v libx264 -profile:v high -crf 26 -preset slow -movflags +faststart assets/videos/la-30.mp4
# Si > 4,5 Mo : monter -crf à 28.
```

## 2. Contrôle qualité avant intégration

Vérifier chaque mp4 contre la checklist de `PROMPTS-LA30.md` / `PROMPTS-LA20.md`
(extraire des frames : `ffmpeg -i la-30.mp4 -vf fps=1 frame-%02d.jpg`). Refuser tout
clip où l'étage/terrasse rooftop manque (La 30) ou apparaît (La 20).

## 3. Points de branchement dans le code

### motion-ultra.html (bande de films, ~lignes 398–404)
- `figure.film` avec tag **« Tiny House · 20 m² »** → remplacer
  `assets/videos/tiny-20.mp4` par `assets/videos/la-20.mp4`.
- `figure.film` avec tag **« Patio verre · deux niveaux »** → remplacer
  `assets/videos/triplex.mp4` par `assets/videos/la-30.mp4` et renommer le tag en
  **« La 30 · deux niveaux + rooftop »**.

### motion-lumiere.html (showcase « La 20 / La 30 », ~lignes 376–379)
Les `<figure><img planche…></figure>` du showcase peuvent devenir des vidéos :

```html
<figure class="active"><video autoplay muted loop playsinline preload="metadata"
  poster="assets/planche-house-20.png"><source src="assets/videos/la-20.mp4" type="video/mp4"></video></figure>
<figure><video autoplay muted loop playsinline preload="metadata"
  poster="assets/planche-house-30.png"><source src="assets/videos/la-30.mp4" type="video/mp4"></video></figure>
```
(garder `object-fit` cohérent avec le CSS existant des figures ; tester le pin scroll.)

### motion-noir.html (dossier horizontal, panels M20 / M30, ~lignes 299 et 313)
Même substitution optionnelle `img → video` dans `.panel-media`, avec la planche en
`poster`. À faire seulement si le scroll horizontal reste fluide sur mobile.

### index.html (hero, ~ligne 104)
`assets/maison.mp4` peut être remplacé par `la-30.mp4` (la maison signature) —
optionnel, décision utilisateur.

### Nettoyage
Une fois les remplacements faits et vérifiés : supprimer `assets/videos/tiny-20.mp4`
et `assets/videos/triplex.mp4` (rendus incohérents), et vérifier qu'aucune page ne
les référence encore (`grep -r "tiny-20\|triplex" *.html`).

## 4. Bug planche — à corriger dans la même passe

`assets/planche-house-20.png` est un **duplicata byte-à-byte** de
`planche-house-30.png`. Deux options :
1. **Option rapide** : générer une image fixe « fiche » de La 20 à partir de l'image
   maître A de `PROMPTS-LA20.md` (même cadrage/format 1024×1536 que la planche 30)
   et remplacer le fichier.
2. Option complète : recomposer une vraie planche (hero + plan + caractéristiques)
   au même gabarit graphique que la 30 — plus long, à faire dans une session dédiée.

Les pages qui référencent la planche 20 : `motion-lumiere.html:377`,
`motion-noir.html:299`, `motion-ultra.html` (peek `la20`).

## 5. Commit / déploiement

- Vérifier que le `Dockerfile` copie bien `assets/` en entier (c'est le cas — pas de
  liste de fichiers vidéo à jour à maintenir).
- Commit sur la branche de travail, push, puis test visuel des 3 versions
  (`motion-lumiere`, `motion-noir`, `motion-ultra`) sur mobile ET desktop.
