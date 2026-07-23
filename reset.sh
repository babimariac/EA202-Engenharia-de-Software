#!/bin/bash
#
SCRIPTPATH="$(pwd)"

docker run \
-it \
-d \
--name clean \
-w /home/clean \
-v "$SCRIPTPATH"/:/home/clean \
node

docker exec clean git config --global --add safe.directory /home/clean
docker exec clean git reset --hard
docker exec clean git clean -fd

docker stop clean
docker container remove clean
