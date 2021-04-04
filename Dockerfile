FROM node:14.16.0@sha256:f6b9ff4caca9d4f0a331a882e560df242eb332b7bbbed2f426784de208fcd7bd AS build

WORKDIR /app

COPY package.json yarn.lock schema.prisma ./
RUN yarn install --frozen-lockfile

COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN yarn build

FROM node:14.16.0-slim@sha256:7ff9cf5e411481ee734479637265f063c5f356f496d0f9c47112312cb7b46d42

WORKDIR /app

ENV PORT 4000

RUN apt-get update && apt-get install -y --no-install-recommends \
  openssl=1.1.0l-1~deb9u3 \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock schema.prisma ./
RUN yarn install --frozen-lockfile --production

RUN yarn prisma generate
COPY --from=build /app/dist ./dist

EXPOSE $PORT

CMD ["node", "dist/main.js"]
