#!/bin/bash
sleep 5

./mongo.sh
./node.sh

# Esperar um pouco para garantir que os containers estejam prontos
sleep 5

# Executar comandos no container Node.js
docker exec -it -d node.js bash -c "
cd AppUnievent && \
npm install && \
npm start" &

echo "Aplicação iniciada. Acesse http://localhost:3000"
