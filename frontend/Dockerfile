# Dockerfile
# 1st Stage
FROM node:14.15.4-alpine AS builder

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .

# install .gyp for compiling node-sass -_____-
RUN apk add --no-cache --virtual .gyp python make g++

RUN yarn install --ignore-platform

# delete .gyp after install that dependencies :)
RUN apk del .gyp

COPY . .

RUN yarn build

# 2nd Stage
FROM nginx:1.14.2-alpine

COPY --from=0 /usr/src/app/build /usr/share/nginx/html
WORKDIR /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]