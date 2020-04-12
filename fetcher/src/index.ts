import Logger from '@app/util/Logger';
import { connectToDatabase } from '@app/db';
import OpenWeatherMap from '@app/open-weather-map';

import WeatherInfo from '@db/models/WeatherInfo';

async function main() {
  Logger.log(`Job running`);

  // Establish connection to database
  await connectToDatabase();

  // Request OpenWeatherMap API
  let weatherResponse = await OpenWeatherMap.getCurrentWeatherByCity('Wellington', 'nz');
  Logger.log("Got response from Weather API.");

  let weatherType = OpenWeatherMap.resolveWeatherTypeFromResponse(weatherResponse);
  Logger.log("Resolved weather type: ", weatherType);

  await WeatherInfo.create({
    type: weatherType,
    raw: JSON.stringify(weatherResponse),
  });

  Logger.log("Successfully created new weather info record");

  Logger.log(`Job finished processing`);
  Logger.log();
}

// ENTRY POINT
if (process.env.NODE_ENV === 'production') {
  // In production, sleep for a period to ensure DB migrations have been run
  const SLEEP_TIMEOUT_SECONDS = 30;

  Logger.log(`Job awake. Sleeping for ${SLEEP_TIMEOUT_SECONDS} seconds to ensure DB migrations have run`);
  setTimeout(() => {
    main();
  }, SLEEP_TIMEOUT_SECONDS * 1000);
} else {
  // Development mode - run process immediately
  Logger.log('Job awake. Development mode - running immediately')
  main();
}
