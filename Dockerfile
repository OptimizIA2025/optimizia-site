# optimizia.xyz - image de service statique.
#
# Reprise fidele du "Dockerfile v3" de la note
# "(C) RGI-Deploiement-Site-V5.8-2026-08-11.md" : memes en-tetes, meme nginx.conf,
# meme compression pre-calculee. Seule difference : les blocs heredoc deviennent
# des fichiers versionnes (nginx.conf, security-headers.conf, mta-sts.txt),
# diffables commit par commit.
#
# L'image est la source de verite du site. Aucun volume ne doit etre monte
# sur /usr/share/nginx/html, sinon chaque deploiement passe au vert sans
# rien changer en ligne (piege mesure le 12/08/2026 sur Site_OptimizIA).

FROM nginx:1.27-alpine

COPY site/ /usr/share/nginx/html/
COPY mta-sts.txt /usr/share/nginx/html/.well-known/mta-sts.txt
COPY security-headers.conf /etc/nginx/conf.d/security-headers.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Pre-compression au build : gzip -9 sur tout le texte, servi ensuite par gzip_static
RUN find /usr/share/nginx/html \
      -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.json' \
                 -o -name '*.xml' -o -name '*.txt' -o -name '*.svg' \) \
      -exec gzip -9 -k -f {} \;

EXPOSE 80
