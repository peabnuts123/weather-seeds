#!/usr/bin/env sh

# Fail on non-zero exit code
set -e;

# Build client
cd client;
npm --production false ci;
npm run deploy;

# Build server
cd ../server;
npm ci;

# Run server
npm start;
