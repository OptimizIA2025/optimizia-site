#!/usr/bin/env bash
# Vérifie l'image construite par la CI (ou en local) : pages servies,
# redirections, en-têtes de sécurité et compression.
#
# Usage : docker build -t site . && docker run -d --name site -p 8080:80 site
#         bash scripts/verifier-image.sh
set -u

BASE="${BASE:-http://localhost:8080}"
erreurs=0

verifier() {
    local hote="$1" chemin="$2" attendu="$3"
    local code
    code=$(curl -s -o /dev/null -w '%{http_code}' -H "Host: $hote" "$BASE$chemin")
    if [ "$code" = "$attendu" ]; then
        echo "OK   $attendu  $hote$chemin"
    else
        echo "ECHEC attendu $attendu, obtenu $code  $hote$chemin"
        erreurs=$((erreurs + 1))
    fi
}

# Le code seul ne suffit pas : une 301 vers une page morte passe le test du
# code. C'est ainsi que 73 anciennes adresses SEOPlus ont fini sur les piliers
# /seo/ et /geo/, en 410 depuis le 26/09, sans qu'aucune CI ne le voie.
verifier_redirection() {
    local hote="$1" chemin="$2" cible="$3"
    local entetes code location
    entetes=$(curl -s -o /dev/null -D - -H "Host: $hote" "$BASE$chemin" | tr -d '\r')
    code=$(printf '%s\n' "$entetes" | head -n 1 | cut -d ' ' -f 2)
    location=$(printf '%s\n' "$entetes" | grep -i '^location:' | cut -d ' ' -f 2)
    if [ "$code" = "301" ] && [ "$location" = "$cible" ]; then
        echo "OK   301 -> $cible  $hote$chemin"
    else
        echo "ECHEC attendu 301 -> $cible, obtenu $code -> $location  $hote$chemin"
        erreurs=$((erreurs + 1))
    fi
}

verifier_entete() {
    local hote="$1" chemin="$2" entete="$3"
    if curl -s -o /dev/null -D - -H "Host: $hote" "$BASE$chemin" | grep -qi "^$entete:"; then
        echo "OK   en-tête $entete  $hote$chemin"
    else
        echo "ECHEC en-tête $entete absent  $hote$chemin"
        erreurs=$((erreurs + 1))
    fi
}

verifier_gzip() {
    local hote="$1" chemin="$2"
    if curl -s -o /dev/null -D - -H "Host: $hote" -H "Accept-Encoding: gzip" "$BASE$chemin" | grep -qi "^Content-Encoding: gzip"; then
        echo "OK   gzip  $hote$chemin"
    else
        echo "ECHEC pas de compression gzip  $hote$chemin"
        erreurs=$((erreurs + 1))
    fi
}

# Pages, fichiers et redirections
verifier "www.optimizia.xyz" "/" 200
verifier "www.optimizia.xyz" "/case-studies/" 200
verifier "www.optimizia.xyz" "/contact.html" 200
verifier "www.optimizia.xyz" "/llms.txt" 200
verifier "www.optimizia.xyz" "/index.html" 301
verifier "www.optimizia.xyz" "/fr/apropos.html" 301
verifier "optimizia.xyz" "/" 301
verifier "mta-sts.optimizia.xyz" "/.well-known/mta-sts.txt" 200
verifier "www.optimizia.xyz" "/legal-notice.html" 200
verifier_redirection "www.optimizia.xyz" "/case-studies/legal-notice.html" "/legal-notice.html"
verifier_redirection "www.optimizia.xyz" "/case-studies/automated-reporting/legal-notice.html" "/legal-notice.html"
verifier_redirection "www.optimizia.xyz" "/mentions-legales.html" "/legal-notice.html"
verifier_redirection "www.optimizia.xyz" "/new-reporting-pics/SOI_W2621_ANONYMIZED_SHOWCASE.html" "/assets/examples/example-report.html"

# En-têtes de sécurité
verifier_entete "www.optimizia.xyz" "/" "X-Content-Type-Options"
verifier_entete "www.optimizia.xyz" "/" "Content-Security-Policy"
verifier_entete "www.optimizia.xyz" "/" "Strict-Transport-Security"

# Compression
verifier_gzip "www.optimizia.xyz" "/"

if [ "$erreurs" -gt 0 ]; then
    echo "$erreurs vérification(s) en échec"
    exit 1
fi
echo "Image vérifiée : pages, redirections, en-têtes et compression."
