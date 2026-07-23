#!/bin/bash

BASE_DIR="aula03"
REPORT_DIR="report/delivery3"
REPORT_OUTPUT="$REPORT_DIR/report.json"

if [[ $# -gt 0 ]]; then
  RAS=("$1")
else
  RAS=($(ls -d ${BASE_DIR}/*/ | xargs -n 1 basename))
fi

for ra in "${RAS[@]}"; do
  student_dir="${BASE_DIR}/${ra}/"
  html_file="${student_dir}index.html"

  if [[ -f "$html_file" ]]; then
    echo "Running tests for student $ra"
    docker exec -it cypress bash -c \
      "cypress run --spec cypress/e2e/delivery3/test.cy.js --reporter mochawesome --reporter-options "reportDir=$REPORT_DIR,reportFilename=r${ra}" --env url=$html_file"
  else
    echo "index.html não encontrado em $student_dir"
  fi
done