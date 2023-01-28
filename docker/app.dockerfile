FROM node:18.10.0-alpine as dev

WORKDIR /app/

COPY ./yarn.lock ./package.json ./

RUN yarn --frozen-lockfile \
 && yarn cache clean --all --force

COPY . .

FROM node:18.10.0-alpine as builder

WORKDIR /app/

COPY --from=dev /app/ /app/

RUN yarn build


FROM node:18.10.0-alpine

WORKDIR /app/
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./

RUN NODE_ENV=production

RUN yarn --frozen-lockfile \
 && yarn cache clean --all --force

COPY --from=builder /app/dist ./dist
CMD [ "node", "dist/main.js" ]