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

# FIXME: Temporary work around
#  ffmpeg-static doesn't like streaming links while running in a docker container
#  so replace it with the full blown thing!!!
RUN apt update && apt install -y ffmpeg
RUN rm -rf ./node_modules/ffmpeg-static

ENTRYPOINT ["npm", "start"]
# Requires the following ENV VARS
# - DISCORD_BOT_TOKEN
# - YOUTUBE_API_KEY
