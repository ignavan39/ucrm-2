FROM node:14.17-alpine as dev

WORKDIR /app/

COPY ./pnpm-lock.yaml ./package.json ./

RUN npm i -g pnpm
RUN pnpm i

COPY . .

FROM node:14.17-alpine as builder

WORKDIR /app/

COPY --from=dev /app/ /app/

RUN npm i -g pnpm
RUN pnpm run build


FROM node:14.17-alpine

WORKDIR /app/
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

RUN NODE_ENV=production

RUN npm i -g pnpm
RUN pnpm i

COPY --from=builder /app/dist ./dist
CMD [ "node", "dist/main.js" ]