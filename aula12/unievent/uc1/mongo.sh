#!/bin/bash
MONGO_DATA_DIR="$(pwd)/mongodb_data"
mkdir -p $MONGO_DATA_DIR

docker run \
-it \
--name mongo \
--rm \
-d \
-h mongo \
--net=unievent \
-v $MONGO_DATA_DIR:/data/db \
-p 27017:27017 \
mongo:latest