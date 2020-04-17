import { Op, FindOptions } from 'sequelize';


import Round from "@db/models/Round";
import Predictor from '@db/models/Predictor';
import Logger, { LogLevel } from '@common/util/Logger';

class RoundRepository {
  /**
   * Get all Rounds
   */
  public async getAll(includePredictors: boolean = false): Promise<Round[]> {
    let queryOptions: FindOptions = {};

    // JOIN on predictors if requested
    if (includePredictors) {
      queryOptions.include = [{
        model: Predictor,
        required: true,
        as: 'predictors',
      }];
    }

    return Round.findAll(queryOptions);
  }

  /**
   * Look up a round by ID. Returns `null` if none is found
   *
   * @param id Round id
   */
  public async getById(id: number, includePredictors: boolean = false): Promise<Round | null> {
    let queryOptions: FindOptions = {
      where: {
        id: {
          [Op.eq]: id
        },
      },
    };

    // JOIN on predictors if requested
    if (includePredictors) {
      queryOptions.include = [{
        model: Predictor,
        required: true,
        as: 'predictors',
      }];
    }

    return Round.findOne(queryOptions);
  }

  /**
   * Get the current (and only) active round, if available.
   * Returns `null` if there are no active rounds.
   *
   * @throws If there are more than 1 active round
   */
  public async getCurrent(includePredictors: boolean = false): Promise<Round | null> {
    let queryOptions: FindOptions = {
      where: {
        endDate: {
          [Op.eq]: null,
        },
      },
    };

    // JOIN on predictors if requested
    if (includePredictors) {
      queryOptions.include = [{
        model: Predictor,
        required: true,
        as: 'predictors',
      }];
    }

    const activeRounds: Round[] = await Round.findAll(queryOptions);
    Logger.log(LogLevel.debug, `Active rounds from DB: `, activeRounds.map((x) => x.toJSON()));

    if (activeRounds.length > 1) {
      throw new Error("More than 1 round is active");
    } else if (activeRounds.length === 0) {
      return null;
    } else {
      return activeRounds[0];
    }
  }
}

export default new RoundRepository();
