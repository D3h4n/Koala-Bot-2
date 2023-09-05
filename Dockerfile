FROM node:lts as Builder

WORKDIR /tmp
COPY . .

ENV NODE_ENV=production
RUN npm ci

FROM node:lts-slim as Runtime

ENV NODE_ENV=production

WORKDIR /app
COPY --from=Builder /tmp/node_modules ./node_modules
COPY ./src ./src
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./tsconfig.build.json ./tsconfig.build.json

# FIXME: Temporary work around
#  ffmpeg-static doesn't like streaming links while running in a docker container
#  so replace it with the full blown thing!!!
RUN apt update && apt install -y ffmpeg
RUN rm -rf ./node_modules/ffmpeg-static

# FIXME: ts-node doesn't like test files and isn't ignoring them for some reason
RUN find ./src -type f -name '*.test.ts' -delete

ENTRYPOINT ["npm", "start"]
# Requires the following ENV VARS
# - DISCORD_BOT_TOKEN
