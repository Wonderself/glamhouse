FROM nginx:alpine

# Supprimer la config par defaut
RUN rm /etc/nginx/conf.d/default.conf

# Copier notre config Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copier le site entier (nouvelle arborescence : page de choix + 2 versions)
# - index.html  : page d'entree (choix Classic / Moderne)
# - assets/     : medias partages par les deux versions
# - classic/    : version d'origine complete (HTML/CSS/JS + contracts)
# - modern/     : nouvelle edition (design editorial blanc/noir/fuchsia)
# - motion/     : 3e edition cinetique (films Remotion + motion)
COPY index.html /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY classic/ /usr/share/nginx/html/classic/
COPY modern/ /usr/share/nginx/html/modern/
COPY motion/ /usr/share/nginx/html/motion/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
