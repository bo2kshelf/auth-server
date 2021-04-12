FROM node:14.16.1@sha256:8eb45f4677c813ad08cef8522254640aa6a1800e75a9c213a0a651f6f3564189 AS build

WORKDIR /app

COPY package.json yarn.lock schema.prisma ./
RUN yarn install --frozen-lockfile

COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN yarn build

FROM node:14.16.1-slim@sha256:027ca5b035e85229e96ebd4e60c26386126e6a208f238561759b3d68ac50cae9

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
