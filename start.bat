@echo off
cd /d %~dp0
docker compose -f docker/docker-compose.yml up server
pause
