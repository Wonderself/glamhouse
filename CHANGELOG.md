# Changelog

Historique des évolutions notables du site MyGlamHouse. Format libre, du plus récent au plus ancien.

## 2026-09-02 (quater) — Audit de conformité + relecture de tous les textes

**Audit de conformité mesuré.** Un script compare désormais, page par page, les styles calculés de la navigation, du logo, des liens, du CTA et du pied de page contre `index.html` pris comme référence. Il a trouvé les écarts que l'œil ratait :
- `versions.html` (Archives) ne chargeait **pas** `style.css` du tout : sa barre était une barre maison (`.archbar`), liens 16 px non capitalisés, logo 52 px, sans pied de page. Elle utilise maintenant la vraie navbar et le footer commun.
- La page Designer avait une navbar 8 px plus courte : l'image du logo était en `inline`, ce qui laissait un espace fantôme de ligne de base. `.nav-logo { display: block }` règle le problème sur tout le site.
- Le pied de page de l'accueil était structurellement différent (2 colonnes avec formulaire) de celui des autres pages. Il n'y a plus qu'un seul footer, partout, avec la ligne de contact.

Les 8 pages sont désormais **conformes sur tous les points mesurés**.

**Relecture des textes.**
- **Marque unifiée** : « MyGlamHouse » (11 occurrences) → **GlamHouse**, partout, y compris les titres d'onglet, désormais au format `Page | GlamHouse`.
- **Contradiction de délai corrigée** : le site promettait « 1,5 mois » à 13 endroits alors que le calendrier détaillé de `construction.html` court jusqu'à « Semaine 8+ » (~2 mois), et que deux pages annonçaient « 1,5 à 4 mois ». Tout est aligné sur **6 à 8 semaines**, ce que dit réellement le calendrier, avec « jusqu'à 4 mois pour un projet sur mesure » là où la nuance existe.
- **Erreur factuelle** : « Transport et assemblage sur site (1,5 à 4 mois) » — l'assemblage prend des jours, pas des mois. Corrigé en « 2 à 5 jours », conforme à l'étape 4 du calendrier.
- **Archives** : le libellé « Version retenue » n'était plus exact (le site actuel n'est plus la maquette Lumière). Reformulé en « Piste retenue », et l'introduction dit maintenant que le site est *né* de cette piste.
- Formulations reprises : « un max d'aides État » → « le maximum d'aides publiques » ; « Nous Contacter » → « Configurer mon projet » (cohérent avec le CTA unique) ; « Maison Perso » → « Maison individuelle » dans le tableau comparatif ; titres en Casse De Titre repassés en casse normale (« Votre Maison, Votre Vision », « Zones Recommandées pour un Terrain Pas Cher », « Rapidité et Propreté », etc.).

## 2026-09-02 (ter) — Harmonisation en profondeur : le vrai coupable

**Le bug qui expliquait tout.** Cinq pages (`projets`, `maison-personnalisee`, `ecovillage`, `aides`, `construction`) ne chargeaient pas **Fraunces** — la serif qui porte toute la typographie éditoriale. Leurs titres retombaient silencieusement sur Georgia. Le balisage était bon, la police manquait : d'où l'impression que rien n'avait changé. Toutes les pages chargent désormais le même jeu (Fraunces avec ses italiques, Outfit, Plus Jakarta Sans).

**Page Designer, refaite pour de bon.** Elle était entièrement autonome, avec sa propre feuille de style et ses propres couleurs. Elle charge maintenant `style.css`, ses variables sont calées sur la palette du site (crème `#FBF8F2`, anthracite `#2C2C2C`, terracotta `#D4A59A`), sa navigation maison est remplacée par la navbar commune avec le logo, son ancien bloc final — qui doublonnait avec la bande CTA — est supprimé, et elle se termine sur le footer commun. Sa mise en page éditoriale, elle, est conservée : c'est sa force.

**Contrôle typographique mesuré** sur les 8 pages (police de corps, police et taille des titres, fond, largeur de conteneur). Écarts corrigés :
- `ecovillage` n'avait aucun titre de section éditorial — ajout de « L'écovillage en chiffres ».
- `versions` utilisait Outfit comme police de corps → Plus Jakarta Sans.
- La page Designer avait un conteneur de 1200 px → 1300 px comme partout.
- Les titres des bandes CTA passent en serif, comme tous les grands titres du site.

Les 8 pages partagent maintenant la même police de corps, la même serif de titres, le même fond et la même largeur de conteneur.

## 2026-09-02 (bis) — Harmonisation de toutes les pages

Le système visuel de l'accueil est désormais appliqué partout.

- **Heros de page** : les bandeaux à dégradé criard (vert, marron) sont remplacés par un `.page-hero` éditorial — fond crème, filet de séparation, kicker, titre serif avec une italique terracotta, sous-titre en serif italique et une ligne de trois repères. `construction.html`, qui n'avait pas de hero du tout, en a un.
- **Titres retravaillés** : « Choisissez Votre Projet » → « Deux façons d'habiter GlamHouse », « Toutes les Aides & Subventions » → « Toutes les aides, dispositif par dispositif », « Le Système GlamHouse » → « La précision d'usine, la chaleur du bois », « Comparer les 2 Formules » → « Laquelle des deux vous ressemble ? », etc.
- **Navigation unifiée** sur toutes les pages : mêmes entrées (Le Designer, Construction, Projets, Archives, Contact), page courante en terracotta, et le CTA « Configurer mon projet » présent partout.
- **Footer commun** (`.site-footer`) : logo sur pastille blanche, accroche, liens, mentions légales — précédé de la bande CTA sombre. Les anciennes sections CTA de `aides.html` et `construction.html`, devenues des doublons, ont été supprimées.
- **Cartes homogènes** : `.spec-card`, `.aide-card`, `.project-card`, `.glass-card`, `.calculator-box`, tableaux et onglets passent tous au rayon 8 px et à la bordure 1 px du système. Le bandeau défilant de `projets.html`, jusque-là noir, passe en sable clair.
- **Le Designer** garde sa mise en page éditoriale propre (c'est sa force) ; seules la navigation, le CTA et les liens de pied de page sont alignés sur le reste.
- **Archives** : page conservée pour montrer les versions. Elle est autonome (CSS embarqué), donc sa palette a été recalée sur celle du site et une barre de navigation lui a été ajoutée — on pouvait y entrer sans pouvoir en ressortir.
- **Configurateur visuel sur `maison-personnalisee.html`** : les deux cartes Studio / Duplex avec vue, revêtement et couleur, comme sur l'accueil. Les plans du Duplex ont été réempilés à la verticale pour remplir le cadre portrait.

## 2026-09-02 — Refonte de la présentation + allègement du site

**Allègement**
- **Résidence Senior entièrement retirée** : page `residence-senior.html` supprimée, ainsi que ses entrées de menu, sa carte sur `projets.html`, sa colonne dans le tableau comparatif, son option dans les formulaires et sa ligne dans le Dockerfile. `projets.html` compare désormais 2 formules (Maison Perso / ÉcoVillage). L'onglet « Senior / Retraité » de la page Aides est conservé : il concerne un profil d'acheteur (APA, CARSAT, ANAH), pas la formule supprimée.

**Nommage & textes**
- **La 20 → Studio** et **La 30 → Duplex** partout sur les pages actives (les identifiants techniques `la20`/`la30` et les noms de fichiers sont inchangés).
- Masthead : « Été 2026 » → « 2026 ».
- Formulaire : « Email professionnel » → « Mail ».
- Page Aides : « Le Dossier que Nous Montons pour le Maire » devient **« Ce que vous devez faire avec la mairie »**, reformulé à la deuxième personne — les démarches que *vous* menez, nous fournissant les pièces.

**Simulateurs**
- Fondations : ajout du choix **« Je ne sais pas encore — estimation standard »**.
- Situation / profil : ajout du cas **« J'ajoute une unité dans mon jardin »** sur `maison-personnalisee.html` et sur `aides.html`, avec la mention « unité ≤ 20 m² : déclaration préalable, pas de permis ».
- Le montant « Après déduction des aides » passe de 1,8 rem à 3,2 rem (c'est le chiffre que les gens viennent chercher).

**Plans**
- Les planches `planche-house-20/30.png` étant identiques, les vrais plans en ont été détourés : `assets/plan-studio.png` (plan RDC 4 × 5 m) et `assets/plan-duplex.png` (RDC + étage + rooftop).
- Le configurateur de la page d'accueil gagne une vue **Plan** à côté de Vidéo / Mix bois / Uni.

**Refonte de la présentation** (structure inspirée des landing pages de studios de jardin, palette GlamHouse conservée)
- CTA permanent « Configurer mon projet » dans la navbar, repris dans le hero, les cartes maison, le footer et une bande CTA finale.
- Nouvelles sections : bandeau de réassurance (4 atouts), **grille d'usages** (6 cartes — la section ajoutée en remplacement de Résidence Senior), parcours numéroté en 5 étapes, bande de chiffres clés, FAQ en accordéon.
- **Formulaire remplacé par un configurateur en 5 étapes** : tuiles cliquables qui font avancer d'elles-mêmes, barre de progression « Votre projet n / 5 », boutons « Continuer › » / « ‹ Retour », récapitulatif avant les coordonnées, mention de confidentialité, écran de confirmation. L'ancien formulaire du footer est remplacé par un renvoi vers le configurateur.
- Système visuel homogène : rayon 8 px, bordures 1 px (2 px pour les éléments sélectionnés), respiration verticale généreuse.

## 2026-07-28 (sexies) — Vidéo La 20 : orbite d'arrivée + entrée dans la maison

- Remplace le rallongement en image figée (quinquies, insatisfaisant) par du vrai contenu généré avec fal.ai (Veo 3) : `assets/videos/tiny-20.mp4` commence désormais par une orbite drone à 360° autour de la maison avant d'arriver face à l'entrée, et se termine par une avancée caméra à travers la porte vitrée qui révèle l'intérieur (séjour, cuisine, plafond bois). Durée totale 20,3s. Raccords vérifiés image par image aux deux points de coupe.
- `assets/videos/triplex.mp4` (La 30) revient à sa version précédente (8s, approuvée) : la première génération de l'orbite + entrée intérieure a fait apparaître un toit en pente/à pignon avec poutres apparentes, alors que la vraie La 30 a un toit plat — écart de côtes inacceptable, donc rejeté. Un deuxième essai avec un prompt renforcé (toit plat explicite) a été lancé mais le compte fal.ai s'est retrouvé à court de crédit avant la fin. À refaire dès que le compte est rechargé.

## 2026-07-28 (quater) — Accueil recentré sur les maisons

- **Nav** : le menu déroulant PROJETS (Ma Maison Perso / Résidence Senior / ÉcoVillage) est retiré — un simple lien « PROJETS » renvoie vers la page hub, qui détaille les 3 formules. Résidence Senior et ÉcoVillage ne sont plus développés que sur leurs pages dédiées.
- **Section « Bienvenue » supprimée** : elle répétait ce que les cartes La 20 / La 30 montrent déjà et mettait en avant l'investissement locatif — l'accueil enchaîne directement des maisons vers les trends.
- **Section Subventions remplacée par un bandeau discret** (une ligne + lien « Voir mes aides ») au lieu du questionnaire complet à 6 cases à cocher — le détail reste sur `aides.html`.
- **Formulaire de contact** : « Configuration sur mesure ou investissement » → « Configuration sur mesure de votre maison » ; les options « Résidence Seniors » et « ÉcoVillage » fusionnées en une seule « Projet collectif (résidence, écovillage…) ».
- Page nettement plus courte et concentrée sur les maisons (hauteur réduite d'environ 30%).

## 2026-07-28 (ter) — Logo : fin du liseré blanc sur fond crème

- Le fichier `assets/logo.jpg` a un fond blanc plat, visible en léger décalage depuis le passage du site au blanc crème (`--white: #FBF8F2`). Deux ajustements ciblés plutôt qu'une retouche fragile du logo :
  - **Barre de navigation** : fond repassé en blanc pur (`#FFFFFF`) sur toutes les pages — le logo s'y fond parfaitement, séparation nette avec le reste de la page grâce à la bordure déjà présente.
  - **Logo en pied de page** (`index.html`, `aides.html`, `projets.html`, `maison-personnalisee.html`, `residence-senior.html`, `ecovillage.html`) : enveloppé dans un petit encart blanc arrondi façon badge, au lieu de flotter directement sur le fond crème.

## 2026-07-28 (bis) — Nouvelles vidéos drone La 20 / La 30 (cotes exactes)

- **Remplacement de `assets/videos/tiny-20.mp4` et `triplex.mp4`** (utilisées sur l'accueil et les pages archives) par deux vidéos générées via fal.ai (Google Veo 3), une par modèle, au lieu de l'ancien plan générique.
- **Méthode** : image-maître 9:16 générée par édition ancrée sur les photos de référence validées (mêmes cotes que les visuels de revêtement : La 20 plain-pied 4×5 m, toit plat, garde-corps + échelle ; La 30 deux niveaux, séjour cathédrale 4,2 m, chambre + terrasse 10 m² face à face), puis animée en plan drone (orbite autour de la maison en descendant, puis avancée vers l'entrée vitrée).
- **Contrôle qualité** : la 1ʳᵉ génération de La 20 faisait apparaître une silhouette humaine fantôme dans les dernières secondes (halluciné par le modèle malgré la consigne « no people ») ; corrigé en coupant la vidéo juste avant l'artefact (6,3 s au lieu de 8 s) plutôt que de relancer une 3ᵉ génération payante. La 30 (8 s) était propre du début à la fin.
- Vidéos réencodées à un poids web raisonnable (3,8 Mo / 6,4 Mo, comparable aux fichiers d'origine).

## 2026-07-28 — Projets scindés en pages dédiées

- **`projets.html` devient une page hub** (hero + 3 cartes teaser + tableau comparatif + section croissance) : on n'y voit plus le détail complet des 3 options en même temps.
- **3 nouvelles pages dédiées** créées à partir du contenu existant : `maison-personnalisee.html`, `residence-senior.html`, `ecovillage.html` — chacune avec sa propre nav, son hero et son footer, et un lien « ← Tous les projets ». **Sur « Ma Maison Perso » on ne voit plus les sections Résidence Senior / ÉcoVillage.**
- Tous les liens internes mis à jour (`index.html`, dropdown PROJETS sur toutes les pages), Dockerfile complété, zéro lien mort vérifié sur l'ensemble du site.

## 2026-07-22 (septies) — Pages internes : textes relus, cohérence 2-modèles

- **`motion-lumiere-siboni.html` (Le Designer)** : liens de nav/logo/footer redirigés vers `index.html` (au lieu de l'ancienne vitrine archivée `motion-lumiere.html`), lede légèrement retravaillé.
- **`construction.html`** : accroche ajoutée sous le titre, retrait d'une mention non vérifiable (« approuvés par l'OCDE »), correction « loft » → « maison », carte « Bardage Extérieur » réécrite pour refléter les 2 revêtements réels (uni / mix bois) et les 3 couleurs, CTA final mis à jour.
- **`projets.html`** : simulateur de budget et badge hero mis à jour pour les 2 modèles actuels (La 20 / La 30 — les anciennes options Malibu/Palm Spring/Pacific Palissade/Venice à 59-145k€ ont disparu avec `collection.html`), valeurs par défaut du simulateur recalculées (28 000 € au lieu de 67 000 €), ton « investissement » adouci.
- **`aides.html`** : onglet renommé « Locatif & Écotourisme » pour refléter les 2 aides tourisme/écolabel ajoutées la fois précédente, intro reformulée.
- **`script.js`** : valeurs de secours des simulateurs alignées sur les nouveaux prix (20 000 € au lieu de 59 000 €).
- Vérifié : zéro lien mort, zéro erreur JS sur les 4 pages, aucune clé API dans le repo.

## 2026-07-22 (sexies) — « Mix bois » (bois + uni) + équilibre éditorial

- **Revêtement « bois » redéfini en « Mix bois »** : les 6 images concernées sont régénérées (fal.ai / nano-banana) — le volume principal reste en couleur unie et une **section accolée est habillée de tasseaux de bois verticaux espacés** (claire-voie), ton du bois accordé à la couleur (miel sur sable, naturel sur noir/sauge). Décor distinct pour chacune. L'option s'appelle désormais **« Mix bois »** dans le configurateur (les images « uni » sont inchangées).
- **Équilibre de la page d'accueil** : titres de sections « Bienvenue » et « Subventions » passés en **serif éditorial** (cohérence avec le reste), ajout de kickers (Bienvenue / Inspirations), reformulations (« Une maison, tous vos usages. », « Nos *trends* »), styles LA séparés par des points ; **cartes maisons à hauteurs égales** avec le CTA « Demander une étude » aligné en bas des deux colonnes.

## 2026-07-22 (quinquies) — Visuels IA des revêtements (fal.ai) intégrés

- **12 visuels photoréalistes générés** via fal.ai — modèle **`fal-ai/nano-banana/edit`** (Google Gemini 2.5 Flash Image) — pour le configurateur : 2 maisons × 2 revêtements (planches de bois / uni) × 3 couleurs (noir, sable, sauge), dans `assets/gen/`.
- **Méthode** : édition ancrée sur les photos de référence réelles (`ref-la20.jpg`, et un « maître » La 30 en situation dérivé de `ref-la30.jpg`) pour garantir la fidélité géométrique — cotes réinjectées dans chaque prompt (La 20 : plain-pied 4×5 m, toit plat, garde-corps + échelle ; La 30 : deux niveaux, séjour cathédrale 4,2 m, chambre 10 m² + terrasse 10 m² à l'étage). **Décor distinct pour chaque image** (dunes, cour béton/bambou, vignoble, piscine, forêt de pins, verger…) pour éviter l'effet catalogue.
- Le choix « Vidéo » reste l'aperçu par défaut ; cliquer un revêtement/couleur bascule sur l'image correspondante.
- Note : les anciennes vidéos `tiny-20.mp4` / `triplex.mp4` portaient une signature C2PA/SynthID → générées via **Google Veo** (hébergé sur fal), d'où le choix de rester dans la famille image Google pour la cohérence esthétique.

## 2026-07-22 (quater) — Configurateur revêtements, nav simplifiée, pages retirées

- **Configurateur en direct sur chaque maison** : boutons Revêtement (Vidéo / Planches de bois / Uni) + 3 couleurs (noir, sable, sauge). Le clic remplace la vidéo par un aperçu image `assets/gen/<maison>-<revêtement>-<couleur>.jpg`. **Aperçus provisoires générés localement** (à remplacer par les rendus fal.ai — voir plan ci-dessous).
- **Doublon L'Artiste / Le Designer résolu** : la page `artiste.html` est supprimée, la nav pointe désormais vers « LE DESIGNER » (`motion-lumiere-siboni.html`) sur toutes les pages.
- **Pages retirées** : `collection.html`, `investir.html`, `tokenisation.html` supprimées (+ retirées du Dockerfile). Les liens internes sont redirigés (Collection → `index.html#maisons`, Investir/Tokenisation → contact ou supprimés).
- **`projets.html` décrypté** : tous les blocs tokenisation/blockchain remplacés par « Le Projet en Chiffres » (rendement, livraison, aides), bandeau et tableau comparatif nettoyés, prix « À partir de 20 000€ / Sur devis ». Plus aucune mention crypto ni token.
- Zéro lien mort : vérifié sur toutes les pages HTML.

## 2026-07-22 (ter) — Accueil : relecture client, section Subventions qualifiante

- Hero : un seul CTA « DÉCOUVRIR LES MAISONS → » (bouton Collection retiré) ; kicker « Choisissez » ; titre « Des maisons prêtes à vivre. » ; La 20 sans la mention déclaration préalable en description ; La 30 specs avec « déclaration préalable ».
- Bloc revêtements : ajout du petit label « Revêtement » au-dessus des 3 pastilles.
- **Section Croissance remplacée par « Vérifiez si vous bénéficiez d'une aide »** (badge SUBVENTIONS 2026) : questionnaire à cocher (checklist) qui fait deviner les dispositifs possibles — location saisonnière/gîte (Fonds Tourisme Durable ADEME), panneaux solaires, label écotourisme, primo-accédant, senior/PMR, projet collectif — recherché sur les dispositifs 2026 en vigueur. L'encadré Aides & Subventions et son lien vers `aides.html` sont conservés à droite.
- `aides.html` (onglet Investisseur Locatif) : deux nouvelles cartes ajoutées pour tenir la promesse du bouton — **Fonds Tourisme Durable (ADEME)** (5 000–200 000€, hébergements ruraux/périurbains) et **Labellisation Écotourisme** (Écolabel Européen, Clé Verte, Gîtes Panda).
- Footer : nom d'entreprise et copyright passés à « GlamHouse » / « GlamHouse.net » (texte uniquement — logo et balises `<title>` restent « MyGlamHouse » en attente d'une décision de rebranding).

## 2026-07-22 (bis) — Accueil : textes client intégrés, page principale confirmée

- **Textes du client intégrés sur l'accueil** : hero « MODULE / MA MAISON CALIFORNIENNE. », signature « La signature du designer Daniel Siboni », « ENTREPRISE 100% FRANÇAISE », « écoresponsables » (au lieu de high tech), masthead « Glamhouse · Été 2026 », kicker « Votre maison », aides « jusqu'à 55 000 € pour certains projets ».
- **Prix des deux maisons** : La 20 à **20 000 €**, La 30 à **30 000 €**.
- **Section « La Collection 2026 » retirée de l'accueil** — ses visuels rejoignent « Nos trends » (styles élargis : Malibu, Palm Springs, Pacific Palisades, Beverly Hills, Bel Air, Hollywood Hills, Venice Beach, Santa Monica). Il n'y a plus que 2 modèles ; la personnalisation passe par le revêtement et la couleur.
- **Nouveau bloc « Chaque maison, à votre goût »** : 3 pastilles revêtements — planches de bois, uni, le mix — exemples visuels IA à générer (fal.ai) en session suivante.
- **Section « 3 Façons d'Investir » supprimée** de l'accueil.
- **Accès aux anciennes versions** : entrée « ARCHIVES » (→ `versions.html`) dans le menu de l'accueil. `index.html` reste la page d'entrée Nginx.
- Formulaire : options « Achat Module 20m² » et « Achat Module 30m² ».

## 2026-07-22 — Accueil : vidéo en tête, deux maisons à prix affichés, fond crème

- **Hero vidéo restauré en tout premier écran** : le bloc Sequoia scroll-reveal (animation pilotée par le scroll) est supprimé de `index.html` (HTML + CSS + JS) — retour client : « pas beau ». L'iso-cube CSS est conservé car réutilisé par `collection.html`.
- **Nouvelle section « Deux maisons, prêtes à vivre »** juste sous le hero : **La 20 à 25 000 €** et **La 30 à 37 000 €**, chacune avec sa vidéo générée via fal.ai (`assets/videos/tiny-20.mp4` / `triplex.mp4`), ses specs et un CTA contact. Amélioration des visuels fal.ai prévue en session suivante.
- **Crypto retirée de l'accueil** : section « Investissement et Finance » (tokenisation / blockchain / crypto) supprimée ; plus aucun lien Tokenisation dans la nav, le footer ou le formulaire ; prix d'appel aligné (« Dès 25 000 € »).
- **Fond crème très léger** : `--white` passe de `#FFFFFF` à `#FBF8F2` et les surfaces blanches (cartes, footer, champs) à `#FEFCF7` via `--cream-card` — s'applique à tout le site classique (`style.css`), palette pastel inchangée.
- **Touches éditoriales discrètes** (esprit grand magazine de mode, sans référence reconnaissable) : ligne masthead sous le hero (« GLAMHOUSE · L'ÉDITION MAISONS · ÉTÉ 2026 · PARIS »), hero et titres de sections en serif Fraunces avec italiques terracotta, kickers en petites capitales espacées, prix en serif italique.

## 2026-07-18 (quinquies) — Showcase réaliste : photos + cartouche plan

- Suite au retour client (« rendu beaucoup plus réaliste et beau, inspiré des photos »), le showcase combine désormais **photo réaliste plein cadre** (références client recadrées : `assets/ref-la20.jpg`, `ref-la30.jpg`, + `ref-la20-nuit.jpg` en réserve) et **cartouche plan SVG coté animé** (4 × 5 m ; étage chambre/terrasse) — l'émotion par la photo, la précision par le plan.
- ⚠️ **Droits des photos à confirmer** avant mise en production (sources : page Facebook Glam House.LA et render Pinterest).

## 2026-07-18 (quater) — Planches SVG animées du showcase (style références client)

- Le showcase La 20 / La 30 affiche désormais **deux planches SVG animées** (élévation + plans, tracé progressif à l'activation du chapitre) dans le style des références fournies : bois clair claire-voie, grandes baies, terrasse à garde-corps bois.
- Dimensions strictement conformes aux décisions : La 20 = plain-pied 4 × 5 m ; La 30 = 4 × 5 m au sol + chambre 10 m² à l'étage face à sa terrasse de 10 m², hauteur ≈ 4,2 m, 30 m² habitables / 40 m² vécus.

## 2026-07-18 (ter) — Chantier Motion n°1 : hero en timeline

- **Motion v12 vendorée** dans `assets/js/motion.min.mjs` (bundle ESM autonome, zéro CDN).
- Le hero de `motion-lumiere.html` est désormais orchestré en **timeline à ressorts** (eyebrow → titre en stagger → texte/CTA → chips → fil de scroll), avec fallback automatique vers les keyframes CSS d'origine si le module ne démarre pas sous 2 s, et respect de `prefers-reduced-motion`.

## 2026-07-18 (bis) — Fond blanc + plan La 20 corrigé (décisions client)

- **Fond blanc généralisé** (`--paper: #FFFFFF`) sur `motion-lumiere.html` et `versions.html` — directive client : tout le site en fond blanc.
- **Plan d'architecte animé corrigé** : l'ancienne géométrie 6,66 × 3 m (héritée de Sequoia/Ultra) était invalide. Nouveau plan **La 20 = 4 × 5 m plain-pied**, fidèle à la planche produit sans l'escalier : séjour au canapé-lit (salon/chambre), cuisine linéaire, salle d'eau complète, coin repas.
- **Showcase corrigé** : textes exacts (La 20 plain-pied 4×5 ; La 30 = 20 m² au sol + chambre 10 m² à l'étage face à sa terrasse de 10 m², 30 m² habitables / 40 m² vécus) et visuels différenciés — les deux planches étaient le même fichier ; `maison4.jpg` sert de provisoire pour La 20 en attendant les images de référence client.
- **Décisions Remotion/Motion consignées** dans `docs/REMOTION-ET-MOTION.md` : Motion en adoption progressive (hero en timeline d'abord), Remotion en rendu local (teaser plan + clips sociaux, logo + CTA final).

## 2026-07-18 — Lumière Kinétique + documentation

- **Décision design actée** : la version fond clair (Lumière) est retenue ; Noir et Ultra passent en archives.
- **Refonte de `motion-lumiere.html`** : la base éditoriale fond clair intègre le langage de mouvement d'Ultra, adapté au thème clair :
  - plan d'architecte SVG animé (tracé progressif, scan, réticule, cotes) déclenché au scroll ;
  - curseur personnalisé (point + anneau) et boutons magnétiques (desktop uniquement) ;
  - barre de progression de lecture, grain photographique, blobs d'ambiance réactifs au pointeur ;
  - grands marquees éditoriaux (dont un inversé sur fond terracotta) avec skew lié à la vélocité du scroll ;
  - compteurs animés au format français (virgule décimale) : 20 m², 1,5 mois, 59 k€, 65 000 € ;
  - bande vidéo plein écran (`maison.mp4`) + section « Films » 9/16 avec tilt 3D au survol ;
  - effet scramble sur le kicker final, texte à dégradé animé, lignes de séparation qui se dessinent ;
  - marquee géant en pied de page (texte outline + dégradé) ;
  - lecture vidéo uniquement à l'écran (IntersectionObserver), respect de `prefers-reduced-motion` partout.
- **`versions.html`** : le sélecteur d'univers devient la page « Archives design » (Lumière = version retenue, Noir/Ultra = archives consultables).
- **Documentation créée** : `README.md`, `CHANGELOG.md` et le dossier `docs/` complet (architecture, pages, design system, motion, guide Remotion/Motion, déploiement, contenu, blockchain legacy, roadmap).

## 2026 (antérieur) — Exploration 3 univers

- Ajout des 6 pages motion au Dockerfile de déploiement.
- Logo GLAMHOUSE (sans « MY ») + nouveau titre sur la page de sélection.
- Menu mobile (burger) sur les 3 versions + pages Designer.
- Responsive des 3 versions corrigé (iPhone 11 → grands écrans).
- Ajout de la 3ᵉ version Ultra (cinétique) + page de garde des 3 univers.
- Retrait de la tokenisation du discours, renforcement des arguments, ajout de la page Designer.
- Repositionnement du discours : extension chez soi, pas cabane en forêt.
- Ajout des 2 versions haut de gamme : Lumière (éditorial) et Noir (futuriste).

## Historique initial

- Remplacement du plan Sequoia par un vrai plan d'architecte (SVG).
- Sequoia : plan corrigé (3 × 6,66 m) + planche statique + hero scroll-reveal.
- Plans 3D interactifs + swap images + messaging tokens simplifié.
- Responsive mobile réécrit de zéro (téléphone / tablette).
- Commit initial : site MyGlamHouse complet + DApp blockchain.
