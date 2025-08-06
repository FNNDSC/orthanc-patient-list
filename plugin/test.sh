#!/usr/bin/env bash

# figure out whether to use jaq or jq
if type jaq > /dev/null 2>&1; then
  jq=jaq
else
  jq=jq
fi

# change to directory where this script lives
cd "$(dirname "$(readlink -f "$0")")"

set -exuo pipefail

# get configured basename from Orthanc JSON configuration
base_path=$($jq -r '.PatientListUI.RouterBasename' < ./Orthanc.jsonc)

podman-compose up -d

# Wait 10s for Orthanc to start
start=$(date +%s)
until curl -sSfu alice:alice1234 http://localhost:8042/patients; do
  now=$(date +%s)
  test "$((now-start))" -lt 10
  sleep 1
done

# Test plugin serves all the correct files
temp=$(mktemp -d)
for file in $(find ../dist -type f | sed 's/.*dist\///'); do
  curl -sSfu alice:alice1234 -o $temp/actual.dat http://localhost:8042$base_path/$file
  diff -q $temp/actual.dat ../dist/$file
done

# Test plugin serves index.html
diff -q ../dist/index.html <(curl -sSfu alice:alice1234 http://localhost:8042$base_path)
diff -q ../dist/index.html <(curl -sSfu alice:alice1234 http://localhost:8042$base_path/)

# Clean up
rm -rf $temp
podman-compose down -v

