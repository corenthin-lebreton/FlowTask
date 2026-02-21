# ==========================================
# Étape 1 : Construction (Builder)
# ==========================================
FROM node:20-alpine AS builder

# Sécurité : Définir le répertoire de travail
WORKDIR /app

# Optimisation du cache Docker : copier uniquement les fichiers de dépendances d'abord
# Si les dépendances ne changent pas, Docker utilisera le cache pour l'étape `npm ci`
COPY package.json package-lock.json* ./

# Installation des dépendances (exactes selon le lockfile, plus sécurisé)
RUN npm ci

# Copie du reste du code source
COPY . .

# Construction de l'application React/Vite (les fichiers iront dans /app/dist par défaut)
RUN npm run build

# ==========================================
# Étape 2 : Production (Serveur Web)
# ==========================================
FROM nginx:alpine-slim

# Hardening : Sécurisation de l'image
# 1. Utilisation d'un port non privilégié (8080 au lieu de 80) pour ne pas requérir les droits root
# 2. Assignation des permissions des dossiers de cache et de run Nginx à un utilisateur non-root
RUN sed -i 's/listen  *80;/listen 8080;/g' /etc/nginx/conf.d/default.conf && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Nettoyage de la configuration de base de Nginx (optionnel mais recommandé)
RUN rm -rf /usr/share/nginx/html/*

# Copier les fichiers statiques (artifacts de build) depuis l'étape de construction
# On attribue directement les fichiers à l'utilisateur 'nginx'
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Exposer le port de notre serveur
EXPOSE 80

# Hardening : Basculer sur l'utilisateur non privilégié 'nginx' (intégré d'office dans l'image nginx:alpine)
USER nginx

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
