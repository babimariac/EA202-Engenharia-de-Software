#!/bin/bash

if [ $# -ne 3 ]; then
    echo "Uso: ./insertuser.sh <usuário> <papel> <senha>"
    exit 1
fi

username=$1
role=$2
password=$3

if [ "$role" != "user" ] && [ "$role" != "admin" ]; then
    echo "Papel inválido. Use 'user' ou 'admin'."
    exit 1
fi

docker exec -i mongo mongosh <<EOF
use alunosDB
db.users.insert({username: '$username', role: '$role', password: '$password'})
EOF

echo "Usuário $username inserido com sucesso como $role."