#!/bin/bash

REPO=/home/ec2-user/WEB17-LiarKing
BACK_REPO=/home/ec2-user/WEB17-LiarKing/back-end
FRONT_REPO=/home/ec2-user/WEB17-LiarKing/front-end

cd $REPO

echo "> Git pull"

git pull

echo "> Build react"

cd $FRONT_REPO && npm install

npm run build

echo "> Copy react build"

sudo cp -r build/* /usr/share/nginx/build/

echo "> Stop server"

killall node

echo "> Server start"

cd $BACK_REPO && npm install

nohup npm start 1>../../server_log.txt 2>&1 &

exit