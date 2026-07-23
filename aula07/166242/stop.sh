#!/bin/bash

docker stop mongo
docker stop node.js

sleep 5

# Verificar se a porta 3000 ainda está em uso
while lsof -i :3000 >/dev/null 2>&1; do
    sleep 2
done