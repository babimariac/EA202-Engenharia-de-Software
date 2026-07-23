#!/bin/bash

docker stop mongo
docker stop node.js

# Aguardar um pouco para garantir que os containers foram parados
sleep 5

# Verificar se a porta 3000 ainda está em uso
while lsof -i :3000 >/dev/null 2>&1; do
    echo "Aguardando a liberação da porta 3000..."
    sleep 2
done

echo "Porta 3000 liberada. Containers parados com sucesso."