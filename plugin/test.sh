#!/usr/bin/env bash

# change to directory where this script lives
cd "$(dirname "$(readlink -f "$0")")"

if [ -z "$BASE_PATH" ]; then
  >&2 echo "Error: must set BASE_PATH environment variable"
  exit 1
fi

set -exuo pipefail

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
  curl -sSfu alice:alice1234 -o $temp/actual.dat http://localhost:8042$BASE_PATH/$file
  diff -q $temp/actual.dat ../dist/$file
done

# Test plugin serves index.html
diff -q ../dist/index.html <(curl -sSfu alice:alice1234 http://localhost:8042$BASE_PATH)
diff -q ../dist/index.html <(curl -sSfu alice:alice1234 http://localhost:8042$BASE_PATH/)

# Clean up
rm -rf $temp
podman-compose down -v

