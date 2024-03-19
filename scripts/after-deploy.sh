#!/bin/bash

# 서버 재시작
echo "Restarting server..."
pm2 restart all

# 또는 Docker 컨테이너를 사용하는 경우
# echo "Starting Docker containers..."
# docker-compose up -d

echo "Deployment finished."
