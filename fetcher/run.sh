#!/usr/bin/env sh

# Fail on non-zero exit code
set -e;

# Install dependencies
npm i;

# Switch behavior based on environment
if [ "${NODE_ENV}" = 'production' ]; then
  # Start cron daemon
  crond;

  # Create and tail logfile
  touch fetcher.log
  tail -f fetcher.log
else
  # Invoke script directly
  npm start;
fi
