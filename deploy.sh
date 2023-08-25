service_name=${{ env.AWS_LIGHTSAIL_SERVICE_NAME }}

aws lightsail push-container-image \
   --region ${{ env.AWS_REGION }} \
   --service-name ${service_name} \
   --label ghcr.io/${{ github.actor }}/koala-bot:latest \
   --image ghcr.io/${{ github.actor }}/koala-bot:latest

aws lightsail get-container-images --service-name ${service_name} | jq --raw-output ".containerImages[0].image" > image.txt

jq --arg image $(cat image.txt) '.containers.koala-bot.image = $image' \
   '.containers.koala-bot.environment.DISCORD_BOT_TOKEN = $DISCORD_BOT_TOKEN' \
   '.containers.koala-bot.environment.YOUTUBE_API_KEY = $YOUTUBE_API_KEY' \
   '.containers.koala-bot.environment.CLIENT_ID = $CLIENT_ID' \
   container.template.json > container.json

aws lightsail create-container-service-deployment --service-name ${service_name} --cli-input-json file://$(pwd)/container.json
