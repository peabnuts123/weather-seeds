import { Sequelize } from 'sequelize';

import Config from '@app/config';
import Logger from '@app/util/Logger';

import { registerWeatherInfoModel } from '@db/models/WeatherInfo';

export async function connectToDatabase(): Promise<Sequelize> {
  // Connect to DB
  let dbConnectionAttempt = 1;
  let connectionSuccessful = false;
  const sequelize = new Sequelize(Config.DB.DB_NAME, Config.DB.USER, Config.DB.PASSWORD, {
    host: Config.DB.HOST,
    dialect: 'postgres',
  });

  // Manual retry mechanism to account for things like ECONNREFUSED (which just throws, rather than retrying)
  while (!connectionSuccessful) {
    try {
      Logger.log(`Connecting to DB. Attempt ${dbConnectionAttempt++}`);

      // Test DB connection
      await sequelize.authenticate();

      // Connected successfully (i.e. no error was thrown)
      connectionSuccessful = true;
    } catch (e) {
      Logger.logError("Database connection failed", e);
      if (dbConnectionAttempt > Config.DB.MAX_CONNECTION_ATTEMPTS) {
        Logger.logError("Max DB connection retries attempted. Aborting");
        throw e;
      } else {
        let sleepTimeSeconds = 10;
        Logger.logError(`Sleeping for ${sleepTimeSeconds} seconds before retrying...`);
        // Sleep for a brief period
        await new Promise((resolve) => setTimeout(resolve, sleepTimeSeconds * 1000));
      }
    }
  }

  // Model registration
  // @TODO why? What does this do?
  registerWeatherInfoModel(sequelize);

  return sequelize;
}