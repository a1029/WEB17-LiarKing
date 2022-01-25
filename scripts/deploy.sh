#!/bin/bash

REPO=/home/ec2-user/WEB17-LiarKing
BACK_REPO=/home/ec2-user/WEB17-LiarKing/back-end
FRONT_REPO=/home/ec2-user/WEB17-LiarKing/front-end

cd $REPO

echo "> Copy react build"

sudo cp -r /home/ec2-user/build /usr/share/nginx/build

echo "> Install server dependency"

cd $BACK_REPO && npm install

echo "> Stop server"

killall node

echo "> Server start"

nohup npm start 1>../../server_log.txt 2>&1 &

exit
