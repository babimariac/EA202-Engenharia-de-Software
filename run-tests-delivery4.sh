#!/bin/bash

BASE_DIR="aula04"
REPORT_DIR="report/delivery4"
REPORT_OUTPUT="$REPORT_DIR/report.json"

if [[ $# -gt 0 ]]; then
  RAS=("$1")
else
  RAS=($(ls -d "${BASE_DIR}"/*/ | xargs -n 1 basename))
fi

for ra in "${RAS[@]}"; do
  student_dir="${BASE_DIR}/${ra}"

  if [[ -d "$student_dir" ]]; then
    echo "Running tests for student $ra"
    (
      cd "$student_dir/delivery1" || { echo "Failed to change directory to $student_dir"; exit 1; }
      chmod +x *
      ./node.sh
      docker exec -it cypress bash -c \
        "cypress run --spec 'cypress/e2e/delivery4/test1.cy.js' --reporter mochawesome --reporter-options 'reportDir=$REPORT_DIR,reportFilename=r${ra}-test1'"
      docker stop node.js
      cd - > /dev/null || exit 1
      echo "Waiting for docker to finish ..."
      sleep 5
      cd "$student_dir/delivery2" || { echo "Failed to change directory to $student_dir"; exit 1; }
      chmod +x *
      ./node.sh
      docker exec -it cypress bash -c \
        "cypress run --spec 'cypress/e2e/delivery4/test2.cy.js' --reporter mochawesome --reporter-options 'reportDir=$REPORT_DIR,reportFilename=r${ra}-test1'"
      docker stop node.js
    )
  else
    echo "Directory $student_dir does not exist"
  fi
done
