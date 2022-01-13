#!/bin/bash

FRONT_REPO=/home/ec2-user/liarking/front

echo "> Copy React Build"

cp -r $FRONT_REPO/build/* /usr/share/nginx/build/

