# Déploiement

## Vue d'ensemble

Le site est packagé dans une image **Nginx alpine** : chaque fichier utile est copié dans `/usr/share/nginx/html/`.

```bash
docker build -t glamhouse .
docker run -p 8080:80 glamhouse
# → http://localhost:8080
```

## Dockerfile — règle essentielle

Les pages sont copiées **une par une**. Toute nouvelle page HTML doit être ajoutée au `Dockerfile`, sinon elle sera absente de la prod (et le fallback Nginx renverra `index.html` à sa place, sans erreur visible).

Checklist nouvelle page :
1. Créer `ma-page.html`.
2. Ajouter `COPY ma-page.html /usr/share/nginx/html/` au `Dockerfile`.
3. Vérifier les liens entrants (navs, footers, `versions.html`).
4. Documenter la page dans [PAGES.md](PAGES.md).

## nginx.conf — points notables

| Directive | Effet |
|---|---|
| `try_files $uri $uri/ /index.html;` | **Fallback SPA** : toute URL inconnue sert `index.html` (pas de vraie 404) |
| `location /assets/` → `expires 30d` + `immutable` | Cache long images/vidéos. ⚠️ Si vous **remplacez** un asset en gardant son nom, les navigateurs peuvent servir l'ancien pendant 30 j — renommer le fichier |
| `location ~* \.(css|js)$` → `expires 7d` | Cache moyen pour `style.css`/`script.js` (les pages motion sont inline, donc non concernées) |
| `gzip on` (+ types) | Compression texte/CSS/JS/SVG |
| Headers sécurité | `X-Frame-Options SAMEORIGIN`, `nosniff`, `Referrer-Policy` |
| `error_page 404 /index.html;` | Cohérent avec le fallback |

## Checklist mise en prod

- [ ] `docker build` sans erreur.
- [ ] Test local : hero, plan animé, showcase épinglé, vidéos, burger mobile.
- [ ] Pages motion : vérifier sur mobile réel ou émulation `pointer: coarse` (pas de curseur custom, vidéos qui jouent).
- [ ] Assets renommés si remplacés (cache 30 j immutable).
- [ ] `CHANGELOG.md` mis à jour.

## Ce qui n'est PAS déployé

`docs/`, `README.md`, `CHANGELOG.md`, `hardhat.config.js`, `scripts/` ne sont pas copiés dans l'image — c'est voulu. `contracts/` **est** copié (téléchargeable en texte brut via `/contracts/`, voir [BLOCKCHAIN.md](BLOCKCHAIN.md)).
