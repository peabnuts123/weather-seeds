import OpenWeatherMap from '@app/open-weather-map';
import Config from '@app/config';
import Logger from '@common/util/Logger';
import { connectToDatabase } from '@common/db';

import WeatherInfo from '@db/models/WeatherInfo';
import runJob from '@app/util/runJob';

async function main() {
  try {
    Logger.log(`Job running`);

    // Establish connection to database
    await connectToDatabase(Config.DB);

    // Request OpenWeatherMap API
    Logger.log("Getting weather data...")
    let weatherResponse = await OpenWeatherMap.getCurrentWeatherByCity('Wellington', 'nz');
    Logger.log("Got response from Weather API.");

    let weatherType = OpenWeatherMap.resolveWeatherTypeFromResponse(weatherResponse);
    Logger.log("Resolved weather type: ", weatherType);

    Logger.log("Saving weather info to DB...");
    await WeatherInfo.create({
      type: weatherType,
      raw: JSON.stringify(weatherResponse),
    });

    Logger.log("Successfully created new weather info record");

    Logger.log(`Job finished processing successfully`);
    Logger.log();
  } catch (e) {
    Logger.logError("Failed while processing", e)
  }
}

// ENTRY POINT
runJob('fetch', main);
