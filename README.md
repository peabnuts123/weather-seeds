# Weather Seeds (to be named)

A site that creates prediction models from seeds and scores them against real weather.

## Architecture

Probably a docker stack of containers that can just fire up and run

  * Database
    - Postgres Docker image?
    - Store weather data
    - Store seeds / predictors
  * Data fetcher
    - Small linux container (with no routes to it)
    - A cron job that runs the fetcher project once per day at a certain time
    - Fetcher project hits the weather API and stores the response into the db
    - The fetcher project logs to a cron log file which is the foreground of the container
  * The website
    - Probably alpine node container
    - Express API that connects to DB, serves weather data, seed data
    - Statically serves cute little preact app to display it
