#!/bin/sh

cd /portal
if ! diff -q package.json /package.json; then
    echo "package.json changed"
    echo "Running npm install"
    npm install
fi

web-dev-server -b /portal-dev/ &
exec nginx
