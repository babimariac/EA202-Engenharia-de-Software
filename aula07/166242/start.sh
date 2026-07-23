#!/bin/bash
./mongo.sh
./node.sh

sleep 5
docker exec -it -d node.js bash -c "
cd AppAutent && \
npm install && \
npm start" &

echo "Aplicação iniciada. Acesse http://localhost:3000"
