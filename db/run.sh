#!/usr/bin/env bash

# Print node version
echo "node version: $(node --version)";
echo "npm version: $(npm --version)";

# Enter source directory
cd src || exit 1;

# Install node.js dependencies
npm install;

# Ensure database is up-to-date
# Run this in a sub-process which sleeps for a short period to ensure
#   the database is initialised first.
bash -c 'sleep 20; ./node_modules/.bin/sequelize-cli db:migrate' &

# Run postgres as main process
docker-entrypoint.sh "postgres";
