#!/bin/bash
docker stop mongo
docker stop node.js
sleep 5
while lsof -i :3000 >/dev/null 2>&1; do
    sleep 2
done
