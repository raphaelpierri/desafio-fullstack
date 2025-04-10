FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./

RUN npm cache clean --force
RUN npm install

COPY . .
RUN npm run build -- --output-path=dist/desafio-fullstack-frontend

FROM nginx:alpine
COPY --from=builder /app/dist/desafio-fullstack-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
