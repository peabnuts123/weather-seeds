import OpenWeatherMap from '@app/open-weather-map';
import Config from '@app/config';
import Logger from '@common/util/Logger';
import { connectToDatabase } from '@common/db';

import WeatherInfo from '@db/models/WeatherInfo';
import runJob from '@app/util/runJob';

async function main() {
  Logger.log(`Job running`);

  // Establish connection to database
  await connectToDatabase(Config.DB);

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
runJob('fetch', main);
