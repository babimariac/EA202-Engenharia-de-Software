#!/bin/bash

BASE_DIR="aula05"
REPORT_DIR="report/delivery5"
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
      mkdir -p report
      mkdir -p report/delivery5
      mkdir -p report/delivery5/video
      mkdir -p report/delivery5/screenshots
      mkdir -p report/delivery5/screenshots/${ra}-t1
      mkdir -p report/delivery5/screenshots/${ra}-t2
      cd "$student_dir" || { echo "Failed to change directory to $student_dir"; exit 1; }
      chmod +x *
      ./server.sh
      docker exec -it cypress bash -c \
        "cypress run --spec 'cypress/e2e/delivery5/test.cy.js' --reporter mochawesome --reporter-options 'reportDir=$REPORT_DIR,reportFilename=r${ra}-test1'"
      docker stop node.js
      cd - > /dev/null || exit 1
      cp cypress/videos/test.cy.js.mp4 report/delivery5/video/v${ra}-1.mp4
      if [ -n "$(ls -A cypress/screenshots/test.cy.js/* 2>/dev/null)" ]
      then
         cp cypress/screenshots/test.cy.js/* report/delivery5/screenshots/${ra}-t1
      fi
      echo "Waiting for docker to stop ..."
      sleep 5
      cd "$student_dir" || { echo "Failed to change directory to $student_dir"; exit 1; }
      chmod +x *
      ./server.sh
      docker exec -it cypress bash -c \
        "cypress run --spec 'cypress/e2e/delivery5/test2.cy.js' --reporter mochawesome --reporter-options 'reportDir=$REPORT_DIR,reportFilename=r${ra}-test2'"
      docker stop node.js
      cd - > /dev/null || exit 1
      cp cypress/videos/test2.cy.js.mp4 report/delivery5/video/v${ra}-2.mp4
      if [ -n "$(ls -A cypress/screenshots/test2.cy.js/* 2>/dev/null)" ]
      then
         cp cypress/screenshots/test2.cy.js/* report/delivery5/screenshots/${ra}-t2
      fi
      echo "Waiting for docker to stop ..."
      sleep 5
    )
  else
    echo "Directory $student_dir does not exist"
  fi
done
