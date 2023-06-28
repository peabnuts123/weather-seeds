import { Sequelize } from 'sequelize';

import Logger from '@common/util/Logger';

// Models
import { registerWeatherInfoModel } from '@db/models/WeatherInfo';
import { registerRoundModel, registerRoundRelationships } from '@db/models/Round';
import { registerPredictorModel, registerPredictorRelationships } from '@db/models/Predictor';


interface DbConfig {
  DB_NAME: string;
  USER: string;
  PASSWORD: string;
  HOST: string;
  MAX_CONNECTION_ATTEMPTS: number;
}

export async function connectToDatabase(config: DbConfig): Promise<Sequelize> {
  // Construct database object
  const sequelize = new Sequelize(config.DB_NAME, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: 'postgres',
    logging: false,
  });

  // Model registration
  registerWeatherInfoModel(sequelize);
  registerRoundModel(sequelize);
  registerPredictorModel(sequelize);

  // Relationship registration
  registerRoundRelationships();
  registerPredictorRelationships();

  // Ensure connection to database
  let dbConnectionAttempt = 1;
  let connectionSuccessful = false;

  // Manual retry mechanism to account for things like ECONNREFUSED (which just throws, rather than retrying)
  while (!connectionSuccessful) {
    try {
      Logger.log(`Connecting to DB. Attempt ${dbConnectionAttempt++}`);

      // Test DB connection
      await sequelize.authenticate()
        .then(() => {
          Logger.log("[DEBUG] DB connection successful");
        })
        .catch((e: any) => {
          Logger.log("[DEBUG] DB connection FAILED");
          Logger.logError("[DEBUG] [ERROR] DB connection FAILED");
          throw e;
        });

      Logger.log("Successfully connected to database.");

      // Connected successfully (i.e. no error was thrown)
      connectionSuccessful = true;
    } catch (e) {
      Logger.logError("Database connection failed", e);
      if (dbConnectionAttempt > config.MAX_CONNECTION_ATTEMPTS) {
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

  return sequelize;
}