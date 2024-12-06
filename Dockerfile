FROM node:lts as Builder

WORKDIR /tmp
COPY . .

RUN npm ci && \
   npm run build

FROM node:lts-slim as Runtime

ENV NODE_ENV=production

WORKDIR /app
COPY --from=Builder /tmp/node_modules ./node_modules
COPY --from=Builder /tmp/bin/ ./bin

RUN npm prune

# FIXME: Temporary work around
#  ffmpeg-static doesn't like streaming links while running in a docker container
#  so replace it with the full blown thing!!!
RUN apt update && apt install -y ffmpeg
RUN rm -rf ./node_modules/ffmpeg-static

ENTRYPOINT ["node", "bin/index.js"]
# Requires the following ENV VARS
# - DISCORD_BOT_TOKEN
