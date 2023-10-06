#!/bin/sh

set -e # The code exit immediately if it return a non 0 state


echo "start the app"
exec "$@"