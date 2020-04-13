FROM node:lts-alpine

WORKDIR /home/node

# Copy sources
RUN mkdir www
COPY client www/client
COPY server www/server

# Build client
RUN cd www/client && \
  npm ci && \
  npm run deploy

# Build server
RUN cd www/server && \
  npm ci

WORKDIR /home/node/www/server

CMD ["npm", "start"]
