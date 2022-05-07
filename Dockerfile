# build stage
FROM arm32v7/node:latest as build-stage
WORKDIR /app
COPY . .
RUN npm ci

# production stage
FROM nginx:latest as production-stage
COPY --from=build-stage /app/dist/watchlist-frontend /usr/share/nginx/html
EXPOSE 80
