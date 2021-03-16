FROM node:14.15.3@sha256:75e1dc0763f97d0907b81e378d0242ab9034fb54544430898b99a3ac71fa0928

WORKDIR /app

ENV PORT 4000

COPY package.json yarn.lock ./
COPY tsconfig.json tsconfig.build.json ./
COPY schema.prisma ./
COPY src ./src

RUN yarn install --frozen-lockfile
RUN yarn build

EXPOSE $PORT

CMD ["node", "dist/main.js"]
