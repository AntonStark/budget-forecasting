#!/usr/bin/env sh
./service/stop.sh
npm run build
./service/start.sh
