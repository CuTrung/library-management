# Stage 1
FROM node:16-alpine as build-stage

WORKDIR /usr/library-management-frontend
COPY library-management-frontend/ .

RUN npm install

RUN npm run build

# Stage 2
FROM nginx:1.23

WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

COPY --from=build-stage /usr/library-management-frontend/dist /usr/share/nginx/html

CMD nginx -g 'daemon off;'


