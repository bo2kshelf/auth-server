FROM node:14.15.3@sha256:75e1dc0763f97d0907b81e378d0242ab9034fb54544430898b99a3ac71fa0928 AS build

WORKDIR /app

COPY package.json yarn.lock schema.prisma ./
RUN yarn install --frozen-lockfile

COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN yarn build

FROM node:14.15.3-slim

WORKDIR /app

ENV PORT 4000

COPY package.json yarn.lock schema.prisma ./
RUN yarn install --frozen-lockfile --production

COPY --from=build /app/dist ./dist

EXPOSE $PORT

CMD ["node", "dist/main.js"]
