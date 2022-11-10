FROM node:lts as Builder

WORKDIR /tmp
COPY . .

RUN npm ci
RUN npm run build --if-present

FROM node:lts-slim as Runtime

WORKDIR /app
COPY --from=Builder /tmp/node_modules ./node_modules
COPY --from=Builder /tmp/dist ./dist

ENTRYPOINT ["node", "dist/index.js"]
# Requires the following ENV VARS
# - DISCORD_BOT_TOKEN
# - YOUTUBE_API_KEY
