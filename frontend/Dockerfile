# Build SPA cu Node
FROM node:20-alpine AS build
WORKDIR /src
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build  # produce dist/<project>/browser/ (Angular 21) sau dist/ (React/Vue)

# Serve static cu nginx alpine
FROM nginx:1.27-alpine
# Pentru Angular 21: dist/<numele_proiectului>/browser/
# Pentru React (CRA): build/
# Pentru Vite: dist/
COPY --from=build /src/dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
