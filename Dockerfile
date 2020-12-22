FROM node:14-alpine

RUN apk update && \
    yarn install
