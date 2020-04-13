FROM node:lts-alpine

WORKDIR /home/node

# Copy sources
COPY client client
COPY server server

# Build client
RUN cd client && \
  npm ci && \
  npm run deploy

# Build server
RUN cd server && \
  npm ci

WORKDIR /home/node/server

CMD ["npm", "start"]
