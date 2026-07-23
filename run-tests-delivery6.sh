#!/bin/bash

BASE_DIR="aula06"
REPORT_DIR="report/delivery6"
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
      cd "$student_dir" || { echo "Failed to change directory to $student_dir"; exit 1; }
      chmod +x *
      ./start.sh
      cd - > /dev/null || exit 1
      mkdir -p report
      mkdir -p report/delivery6
      mkdir -p report/delivery6/video
      mkdir -p report/delivery6/screenshots
      mkdir -p report/delivery6/screenshots/${ra}-t1
      mkdir -p report/delivery6/screenshots/${ra}-t2
      docker exec -it cypress bash -c \
        "cypress run --spec 'cypress/e2e/delivery6/test1.cy.js' --reporter mochawesome --reporter-options 'reportDir=$REPORT_DIR,reportFilename=r${ra}-test1'"
      cd "$student_dir"
      ./stop.sh
      echo "Copying test videos to report"
      cd - > /dev/null || exit 1
      cp cypress/videos/test1.cy.js.mp4 report/delivery6/video/v${ra}-1.mp4
      if [ -n "$(ls -A cypress/screenshots/test1.cy.js/* 2>/dev/null)" ]
      then
         cp cypress/screenshots/test1.cy.js/* report/delivery6/screenshots/${ra}-t1
      fi
      cd "$student_dir" || { echo "Failed to change directory to $student_dir"; exit 1; }
      ./start.sh
      cd - > /dev/null || exit 1
      docker exec -it cypress bash -c \
        "cypress run --spec 'cypress/e2e/delivery6/test2.cy.js' --reporter mochawesome --reporter-options 'reportDir=$REPORT_DIR,reportFilename=r${ra}-test2'"
      cd "$student_dir"
      ./stop.sh
      echo "Copying test videos and screenshots"
      cd - > /dev/null || exit 1
      cp cypress/videos/test2.cy.js.mp4 report/delivery6/video/v${ra}-2.mp4
      if [ -n "$(ls -A cypress/screenshots/test1.cy.js/* 2>/dev/null)" ]
      then
        cp cypress/screenshots/test2.cy.js/* report/delivery6/screenshots/${ra}-t2
      fi
    )
  else
    echo "Directory $student_dir does not exist"
  fi
done
