FROM nginx:alpine

# Supprimer la config par defaut
RUN rm /etc/nginx/conf.d/default.conf

# Copier notre config Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copier le site entier
COPY index.html /usr/share/nginx/html/
COPY admin.html /usr/share/nginx/html/
COPY aides.html /usr/share/nginx/html/
COPY artiste.html /usr/share/nginx/html/
COPY collection.html /usr/share/nginx/html/
COPY construction.html /usr/share/nginx/html/
COPY investir.html /usr/share/nginx/html/
COPY projets.html /usr/share/nginx/html/
COPY tokenisation.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY blockchain.js /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY contracts/ /usr/share/nginx/html/contracts/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
