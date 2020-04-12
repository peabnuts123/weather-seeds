#!/usr/bin/env sh

# Change into source directory
cd /home/node/fetcher || exit 1;

# Invoke fetch script - pipe stdout and stderr to log file
npm start >> fetcher.log 2>&1;
