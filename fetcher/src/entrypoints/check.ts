import { rword } from 'rword';
import { Op } from 'sequelize';

import { connectToDatabase } from '@common/db';
import Logger, { LogLevel } from '@common/util/Logger';

import runJob from '@app/util/runJob';
import Config from '@app/config';

import Round from '@db/models/Round';
import Predictor from '@db/models/Predictor';
import WeatherInfo from '@db/models/WeatherInfo';


async function main() {
  // Configure log level (which is set to debug by default in Config)
  Logger.setLogLevel(LogLevel.normal);

  // Establish connection to database
  await connectToDatabase(Config.DB);

  // Get the current round (there should only be 1 active round)
  const activeRounds: Round[] = await Round.findAll({
    where: {
      endDate: {
        [Op.eq]: null,
      },
    },
  });

  /** The only round that is currently active */
  let currentRound: Round;

  if (activeRounds.length > 1) {
    // More than 1 active round - oh noes (requires manual intervention in the DB to recover from this)
    throw new Error("Cannot continue processing. More than 1 active round! Manual intervention required");
  } else if (activeRounds.length === 0) {
    // No active rounds so start a new one!
    Logger.log("No active Rounds!");

    // Create Round object
    currentRound = await createNewRound();
  } else {
    Logger.log("There is an on-going round")
    // There is only 1 round - use it
    currentRound = activeRounds[0];
  }

  // 1 Get all active predictors for the current round
  let activePredictors: Predictor[] = await currentRound.getPredictors({
    where: {
      firstIncorrectDate: {
        [Op.eq]: null,
      },
    },
  });

  Logger.log(`Testing ${activePredictors.length} active predictors considering new data`);

  // 2 Any seeds that are wrong are recorded that they were incorrect
  let numIncorrectPredictors = 0;
  let numCorrectPredictors = 0;
  let currentRoundWeatherData = await getWeatherInfoForRound(currentRound);
  Logger.log(LogLevel.debug, "Current round actual weather", currentRoundWeatherData.map((x) => x.weatherType));
  for (let i = 0; i < activePredictors.length; i++) {
    let predictor = activePredictors[i];
    // Check if predictor is still correct
    let predictorStillCorrect = await isPredictorStillCorrect(activePredictors[i], currentRoundWeatherData);

    // If it is not, mark it as incorrect
    if (!predictorStillCorrect) {
      numIncorrectPredictors++;
      // Set firstIncorrectDate to now
      Logger.log(LogLevel.debug, `Marking predictor ${predictor.get('id')} as incorrect`);
      await predictor.update({
        firstIncorrectDate: new Date(),
      });
    } else {
      numCorrectPredictors++;
    }
  }

  Logger.log("Results:");
  Logger.log(`${numCorrectPredictors} predictors were still correct`);
  Logger.log(`${numIncorrectPredictors} predictors no longer correct`);

  // 3 If there are no remaining valid seeds in a round - mark it inactive
  if (numCorrectPredictors === 0) {
    Logger.log("There are no correct predictors left. Marking round as ended. A new round will be started");

    // Set round's end date to now
    await currentRound.update({
      endDate: new Date(),
    });

    // Start a new round immediately
    await createNewRound();
  }

  Logger.log("Finished processing.")
}

runJob('check', main);

/**
 * Compare whether a predictor is still correct for all given weather data
 *
 * @param predictor Predictor model instance
 * @param rounderWeatherData Weather data to compare against
 */
async function isPredictorStillCorrect(predictor: Predictor, roundWeatherData: WeatherInfo[]): Promise<boolean> {
  const predictions = predictor.getPredictions(roundWeatherData.length);
  Logger.log(LogLevel.debug, "Predictor predictions", predictions);

  return predictions.every((prediction, i) => prediction === roundWeatherData[i].weatherType);
}

/**
 * Get all WeatherInfo model objects for a given Round.
 * If the round is still active, it will return all WeatherInfo since the start
 * of the round.
 */
async function getWeatherInfoForRound(round: Round): Promise<WeatherInfo[]> {
  // Filter weather info (at DB level) by record created date
  return WeatherInfo.findAll({
    where: {
      createdAt: {
        [Op.and]: [
          // CreatedAt is greater than or equal to round start date
          { [Op.gte]: round.startDate },
          // Only filter for endDate if there is one
          round.endDate && { [Op.lte]: round.endDate },
        ].filter(Boolean), // Hack to remove undefined entries from an array
      },
    },
  });
}

async function createNewRound() {
  // Create Round object
  let newRound: Round = await Round.create({
    startDate: new Date(),
  });

  // Create some predictors
  const numPredictors = 20;
  for (let i = 0; i < numPredictors; i++) {
    // Generate a some random words
    const minWords = 1;
    const maxWords = 3;
    let randomWords = rword.generate(~~(Math.random() * (maxWords - minWords + 1)) + minWords, {
      capitalize: 'first',
    });
    // Ensure `randomWords` is an array (it returns a straight string if length = 1)
    if (!Array.isArray(randomWords)) {
      randomWords = [randomWords];
    }

    // Join random words to create seed
    let predictorSeed = randomWords.join('');

    // Create predictor in current round
    await newRound.createPredictor({
      seed: predictorSeed,
    });
  }

  Logger.log(`Started new round with ${numPredictors} predictors`);
  return newRound;
}