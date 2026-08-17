# optimizia-site

Canal de livraison du site agence, servi sur `https://www.optimizia.xyz/`.

Ce dépôt ne contient pas le projet : il contient ce qui part en production.
Le site se développe dans le vault Obsidian, sous
`OptimizIA.xyz/01 site OptimizIA.xyz/OptimizIA_Sprint_V5.8/`, et la publication
passe par `(C) publier.ps1` du même dossier.

## Contenu

| Chemin | Rôle |
|---|---|
| `site/` | Le site servi, copie exacte du dossier source du vault. |
| `nginx.conf` | Redirections 301, en-têtes de sécurité, cache, compression. |
| `security-headers.conf` | Les 6 en-têtes, inclus par chaque `location` qui pose un `Cache-Control`. |
| `mta-sts.txt` | Politique MTA-STS, copiée dans `.well-known/`. |
| `Dockerfile` | Image nginx + le site, gzip pré-calculé au build. |

## Règles

- L'image est la source de vérité : **aucun volume** sur `/usr/share/nginx/html`
  côté Coolify, sinon les déploiements passent au vert sans rien changer.
- Tout bloc `location` qui pose un `add_header` doit répéter
  `include security-headers.conf`, sinon les 6 en-têtes disparaissent sur ce
  type de fichier sans erreur au build.
- Le préfixe `/tools/seoplus/` du même domaine est servi par le conteneur
  SEOPlus (labels Caddy) : ce dépôt n'en fait pas partie.
