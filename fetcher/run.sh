#!/usr/bin/env sh

# Fail on non-zero exit code
set -e;

# Install dependencies
npm i;

# Start cron daemon
crond;

# Create and tail logfile
touch fetcher.log
tail -f fetcher.log
