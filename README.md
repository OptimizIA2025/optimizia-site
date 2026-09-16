# optimizia-site

[![CI](https://github.com/OptimizIA2025/optimizia-site/actions/workflows/ci.yml/badge.svg)](https://github.com/OptimizIA2025/optimizia-site/actions/workflows/ci.yml)
[![CodeQL](https://github.com/OptimizIA2025/optimizia-site/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/OptimizIA2025/optimizia-site/actions/workflows/github-code-scanning/codeql)
[![Site](https://img.shields.io/badge/site-optimizia.xyz-2ea44f)](https://www.optimizia.xyz/)

Canal de livraison du site agence, servi sur `https://www.optimizia.xyz/`.

Ce dépôt ne contient pas le projet : il contient ce qui part en production.
Le site se développe dans le vault Obsidian, sous
`OptimizIA.xyz/01 site OptimizIA.xyz/OptimizIA_Sprint_V5.8/`, et la publication
passe par `(C) publier.ps1` du même dossier.

## Contenu

| Chemin | Rôle |
| --- | --- |
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

## Automatisation

- **CI** (`.github/workflows/ci.yml`) : à chaque push sur `main` et à chaque pull request, l'image est construite, `nginx -t` est exécuté, puis un conteneur est lancé et vérifié par `scripts/verifier-image.sh` (pages en 200, redirections, en-têtes de sécurité, compression). Le résultat est dans le résumé du job. Un second job vérifie les documents Markdown (markdownlint, lychee).
- **Dependabot** : montées de version de l'image nginx et des GitHub Actions, chaque semaine. Les mises à jour patch et mineures sont fusionnées automatiquement une fois la CI passée, ce qui déploie l'image mise à jour ; les majeures attendent une relecture.
- **Ruleset sur `main`** : pas de suppression ni de force push, pull request et vérifications requises pour tout le monde sauf les administrateurs, qui gardent le push direct (le mode de publication normal du site).
- **CodeQL**, **dependency review**, secret scanning avec protection au push. Voir [SECURITY.md](SECURITY.md) et [CONTRIBUTING.md](CONTRIBUTING.md).
