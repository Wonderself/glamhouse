# MyGlamHouse — Site vitrine

> **Maisons modulaires écologiques** en ossature bois & chanvre, dessinées par Daniel Siboni.
> De 20 à 30 m², passives (DPE A), fabriquées en France, installées en 1,5 mois — dès 59 000 €.

Site statique (HTML/CSS/JS pur, zéro framework, zéro build) servi par Nginx dans un conteneur Docker.

---

## 🎯 Direction design actuelle

Après une phase d'exploration en **3 univers** (Lumière / Noir / Ultra), la décision est prise :

| Version | Statut | Fichier |
|---|---|---|
| **Lumière Kinétique** — fond clair éditorial + dynamisme cinétique | ✅ **Version retenue** | `motion-lumiere.html` |
| Noir — futuriste noir & ambre | 🗄️ Archive | `motion-noir.html` |
| Ultra — cinétique sombre | 🗄️ Archive (son langage de mouvement vit dans Lumière) | `motion-ultra.html` |

La version retenue garde la base **fond clair nature-luxe** (papier, serif Fraunces, terracotta) et intègre le dynamisme d'Ultra adapté au thème clair : plan d'architecte animé, curseur personnalisé, marquees cinétiques avec skew à la vélocité du scroll, compteurs animés, films vidéo avec tilt 3D, grain, blobs d'ambiance, effet scramble, marquee géant en pied de page.

## 🚀 Démarrer en local

Aucune dépendance à installer :

```bash
# Option 1 — serveur Python
python3 -m http.server 8000
# puis http://localhost:8000/motion-lumiere.html

# Option 2 — Docker (identique à la prod)
docker build -t glamhouse .
docker run -p 8080:80 glamhouse
```

## 🗂️ Structure du dépôt

```
glamhouse/
├── index.html               # Site « classique » historique (point d'entrée Nginx)
├── motion-lumiere.html      # ⭐ Version retenue : Lumière Kinétique
├── motion-lumiere-siboni.html  # Page Designer (thème Lumière)
├── motion-noir.html         # Archive design (Noir)
├── motion-noir-siboni.html  # Page Designer (thème Noir)
├── motion-ultra.html        # Archive design (Ultra)
├── versions.html            # Page des archives design (ex-sélecteur d'univers)
├── collection.html          # Catalogue des modèles
├── construction.html        # Méthode constructive
├── projets.html             # Réalisations / projets
├── aides.html               # Simulateur d'aides de l'État
├── investir.html            # Page investissement
├── artiste.html             # Page artiste
├── admin.html               # Back-office (démo)
├── tokenisation.html        # Legacy blockchain (retiré du discours)
├── style.css / script.js    # Styles & scripts du site classique
├── blockchain.js            # DApp legacy (voir docs/BLOCKCHAIN.md)
├── contracts/               # Smart contracts Solidity (legacy)
├── scripts/deploy.js        # Déploiement Hardhat (legacy)
├── assets/                  # Images, vidéos, plans
├── Dockerfile / nginx.conf  # Déploiement
└── docs/                    # 📚 Documentation complète
```

## 📚 Documentation

Toute la documentation vit dans [`docs/`](docs/README.md) :

| Document | Contenu |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Stack, conventions, organisation du code |
| [docs/PAGES.md](docs/PAGES.md) | Inventaire de chaque page HTML et son statut |
| [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) | Palette, typographie, composants, tokens |
| [docs/MOTION.md](docs/MOTION.md) | Inventaire des animations + règles (perf, accessibilité) |
| [docs/REMOTION-ET-MOTION.md](docs/REMOTION-ET-MOTION.md) | Guide Remotion (vidéo) & Motion (animation web) + questions à trancher |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Docker, Nginx, cache, mise en prod |
| [docs/CONTENT.md](docs/CONTENT.md) | Messaging, argumentaire, chiffres clés |
| [docs/BLOCKCHAIN.md](docs/BLOCKCHAIN.md) | Legacy DApp / contrats Solidity |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Prochaines étapes |

L'historique des évolutions est dans [CHANGELOG.md](CHANGELOG.md).

## ✍️ Conventions

- **Français** partout (contenu, commentaires, commits).
- Les pages « motion » sont **autonomes** : CSS et JS inline, aucune dépendance entre elles.
- Toute animation doit respecter `prefers-reduced-motion` et se désactiver proprement sur mobile (`pointer: coarse`) — voir [docs/MOTION.md](docs/MOTION.md).
- Nouvelle page ⇒ l'ajouter au `Dockerfile` (voir [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)).
