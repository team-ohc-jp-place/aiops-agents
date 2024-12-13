#!/bin/bash

while true; do
  ./install.sh
  if [ $? -eq 0 ]; then
    break
  fi
  echo -e "\n operator installatin has hanged up, retrying..."
done
