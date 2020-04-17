# Weather Seeds (to be named)

A site that creates prediction models from seeds and scores them against real weather.

## Prerequisites

You will need the following in-order to run the project:
  * [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
  * An API key for [OpenWeatherMap](https://openweathermap.org/)
    * The free tier is enough as the app just calls their "current weather" endpoint - simply register an account on the website.


## Running the project

The project is set up to be easily deployable from Docker using Docker Compose (it would probably run in Docker swarm too, if that's your thing).

1. Setup environment config for db project
    1. Copy `db/sample.env.docker` to `db/.env.docker`
        ```shell
        cp db/sample.env.docker db/.env.docker
        ```
    1. Edit the the file `db/.env.docker` and fill out all the values
1. Setup environment config for fetcher project
    1. Copy `fetcher/sample.env.docker` to `fetcher/.env.docker`
        ```shell
        cp fetcher/sample.env.docker fetcher/.env.docker
        ```
    1. Edit the the file `fetcher/.env.docker` and fill out all the values
1. (@TODO) ~~Setup environment for www project~~
1. Start the stack by running
    ```shell
    docker-compose up --detach
    ```

## Running the project locally

The fetcher project can also be run locally (e.g. for development). You will need a database instance running, and for this I still recommend running the db container in Docker. You can run just the database with `docker-compose up -d db`. You will also need node.js installed on your machine.

You will need to set up the fetcher project's environment config manually (usually docker sources the `.env.docker` file for you). This means setting the environment variables found in `fetcher/sample.env.docker` before running the application. How you achieve this is up to you as there's no common standard (as far as I know).

Here are a few ways to achieve this:
  * I have a utility script for sourcing .env files. It looks a bit like this:
    ```shell
    set -a
    source fetcher/.env.local
    set +a
    ```
    * `set -a` exports all declared variables in a file - so by sourcing `fetcher/.env.local` it will declare all those variables in your environment.
    * Make a copy of `fetcher/sample.env.docker` first and call it `.env.local`:
    ```shell
    cp fetcher/sample.env.docker fetcher/.env.local
    ```
    * Make sure you fill in all the values!
  * Make a script version of the .env file
    * Make a copy of the sample .env and call it something like `local-env.sh`
    ```shell
    cp fetcher/sample.env.docker fetcher/local-env.sh
    ```
    * Fill in all the values
    * Add `export` to the start of every line e.g.
    ```shell
    export DB_HOST=localhost
    ```
    * Source the file by running
    ```shell
    source fetcher/local-env.sh
    ```
  * If you have vscode you can run the launch profile `Debug Fetcher` (from the Run tab)
    * You will need to create a `.env.local` file for this, very similar to `.env.docker`. e.g. Copy the sample and call it `.env.local`
    ```shell
    cp fetcher/sample.env.docker fetcher/.env.local
    ```
    * Fill in all the values - you're good to go! Vscode will automatically read this file.

**NOTE: When running locally, `DB_HOST` should probably be set to `localhost` rather than `db` - as you are pointing at the database on your local machine - and not referring to the Docker container by name.**

The reason for having both `.env.docker` and `.env.local` (or `local-env.sh`) files is so you can run the different versions under different scenarios without having to swap your file back and forth (e.g. You might run `NODE_ENV=development` locally and `NODE_ENV=production` in Docker). Also, as noted above, `DB_HOST` will definitely be different between docker and local environments.

Once you have your environment set up for running the fetcher project you can simply run it with `npm start` (make sure you have installed node_modules first: `npm install`).


## Architecture

_NOTE: this is only a draft / plan architecture._

A docker stack of containers that can just fire up and run.

  * Database
    - Postgres Docker image
    - Store weather data
    - Store predictor seeds
  * Data fetcher
    - Small linux container (with no routes to it)
    - A cron job that runs the fetcher project once per day at a certain time
    - Fetcher project hits the weather API and stores the response into the db
    - The fetcher project lots a file which is `tail`'d in the foreground of the container
  * The website
    - Probably alpine node container
    - Express API that connects to DB, serves weather data, seed data
    - Statically serves cute little preact app to display it

## Development Notes
  - [Cron config on Alpine linux](https://gist.github.com/andyshinn/3ae01fa13cb64c9d36e7#gistcomment-2044506)

## Backlog / TODO

  - [x] ~~Get cron job to work in fetcher container~~
  - [x] ~~Make DB run migrations on boot~~
  - [x] ~~Change db config.json to a javascript file w/ environment variables~~
  - [x] ~~Make fetcher tolerant of unavailable DB - retry, etc.~~
  - [x] ~~Straighten out the Fetcher project lol its awful~~
  - [x] ~~Straighten out .env across the 3 containers~~
  - [x] ~~Add eslint to fetcher project~~
  - [x] ~~Make express API that serves data from the DB~~
  - [ ] Write documentation for www running and development
  - [x] ~~Tell sequelize to stop logging SQL queries~~
  - [ ] Document `npm run dev:link-common`
  - [ ] Document .env and variables within
  - [x] ~~(BUG) Make docker containers the right time zone~~
  - [ ] ? Move package.json to top level and have all projects share
  - [ ] ~~Move repos to common~~ and have fetcher/check use them
  - [ ] (BUG) Violation of Round/Seed unique constraint will crash - needs to be handled
