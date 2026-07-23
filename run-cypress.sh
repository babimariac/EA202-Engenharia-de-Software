#! /bin/bash

SCRIPTPATH="$(pwd)"
ID=$(id -u)
GID=$(id -g)
USER='user'

# Verify argument
if [ -z "$1" ]; then
    echo "Por favor, forneça o número da aula que deseja rodar os testes."
    exit 1
fi

# Set test script based on the second argument
if [ "$2" = "wsl" ]; then
    TEST_SCRIPT="./run-tests-delivery$1.sh"
else
    TEST_SCRIPT="./run-tests-delivery$1.sh $2"
fi

# Set DISPLAY options if running on WSL
if [ "$2" = "wsl" ] || [ "$3" = "wsl" ]; then
    DISPLAY_OPT="-e DISPLAY=192.168.15.79:0"
else
    DISPLAY_OPT=""
fi


START_TIME=$(date +%s)

docker run \
-it \
-d \
--name cypress \
-h cypress \
-w /home/$USER \
-v "$SCRIPTPATH"/:/home/$USER/ \
--net=host \
--entrypoint=bash \
$DISPLAY_OPT \
cypress/included:12.17.4 \
-c "npm install --save-dev mochawesome mochawesome-merge && tail -f /dev/null"
$TEST_SCRIPT

docker stop cypress
docker rm cypress


END_TIME=$(date +%s)
ELAPSED_TIME=$((END_TIME - START_TIME))

# Display elapsed time
echo "O tempo total de execução foi de $ELAPSED_TIME segundos."
