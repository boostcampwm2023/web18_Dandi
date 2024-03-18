#!/bin/sh

DEBUG_LOG="debug.log"


# frontend-blue 컨테이너가 띄워져 있는지 확인
EXIST_BLUE=$(docker ps --filter "name=frontend-blue" -q | grep -E .)

if [ -n "$EXIST_BLUE" ]; then
  TARGET_COLOR="green"
  NOW_COLOR="blue"
  WEB_SERVER_TARGET_PORT=8001
  WEB_SERVER_STOP_PORT=8000
else
  TARGET_COLOR="blue"
  NOW_COLOR="green"
  WEB_SERVER_TARGET_PORT=8000
  WEB_SERVER_STOP_PORT=8001
fi


# green의 경우 was 환경변수 PORT 변경
ENV_FILE="/dandi/.env"
PORT_CHANGE_FROM="PORT=3000"
PORT_CHANGE_TO="PORT=3001"

if [ "$TARGET_COLOR" = "green" ]; then
  sed -i "s/$PORT_CHANGE_FROM/$PORT_CHANGE_TO/" "$ENV_FILE"

  echo "**** Change .env PORT $(date +'%Y-%m-%d %H:%M:%S')" >> $DEBUG_LOG
fi


# target color의 docker-compose 실행
DOCKER_COMPOSE="docker-compose.$TARGET_COLOR.yml"

echo "<<< Run docker-compose : $DOCKER_COMPOSE $(date +'%Y-%m-%d %H:%M:%S')" >> $DEBUG_LOG

docker-compose -f "$DOCKER_COMPOSE" up -d

echo ">>> Complete docker-compose up $(date +'%Y-%m-%d %H:%M:%S')" >> $DEBUG_LOG

sleep 60


# nginx 설정 및 reload
echo "<<< Reload nginx $(date +'%Y-%m-%d %H:%M:%S')" >> $DEBUG_LOG

NGINX_CONFIG="/etc/nginx/conf.d/default.conf"
STOP_WEB_SERVER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' frontend-$NOW_COLOR)
NEW_WEB_SERVER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' frontend-$TARGET_COLOR)

sed -i "s/$WEB_SERVER_STOP_PORT/$WEB_SERVER_TARGET_PORT/g" $NGINX_CONFIG
sed -i "s/frontend-$NOW_COLOR/frontend-$TARGET_COLOR/g" $NGINX_CONFIG
sed -i "s/$STOP_WEB_SERVER_IP/$NEW_WEB_SERVER_IP/g" $NGINX_CONFIG
sudo nginx -s reload

echo ">>> Complete reload $(date +'%Y-%m-%d %H:%M:%S')" >> $DEBUG_LOG


# 이전 버전 컨테이너 & 이미지 삭제
echo ">>> Down old version $(date +'%Y-%m-%d %H:%M:%S')" >> $DEBUG_LOG

STOP_WEB_SERVER_ID=$(docker ps --filter "name=frontend-$NOW_COLOR" -q)
STOP_WAS_ID=$(docker ps --filter "name=was-$NOW_COLOR" -q)

docker stop $STOP_WEB_SERVER_ID
docker rm $STOP_WEB_SERVER_ID
docker stop $STOP_WAS_ID
docker rm $STOP_WAS_ID

docker image prune -a -f

echo "------------------ All is done $(date +'%Y-%m-%d %H:%M:%S')------------------" >> $DEBUG_LOG