FROM node:22-alpine AS build
WORKDIR /app
COPY UrlShorter.FrontEnd/package*.json ./
RUN npm ci
COPY UrlShorter.FrontEnd/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Configura o Nginx para redirecionar todas as rotas para o index.html (SPA mode)
RUN sed -i 's/index  index.html index.htm;/index  index.html index.htm; try_files $uri $uri\/ \/index.html;/g' /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
