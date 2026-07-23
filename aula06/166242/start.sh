#!/bin/bash
sleep 5
./mongo.sh
./node.sh
sleep 5
docker exec -it -d node.js bash -c "
cd AppMongo && \
npm install && \
npm start" &

