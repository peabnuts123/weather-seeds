import { Op, FindOptions } from 'sequelize';


import Round from "@db/models/Round";
import Predictor from '@db/models/Predictor';
import Logger, { LogLevel } from '@common/util/Logger';

class RoundRepository {
  /**
   * Get all Rounds
   */
  public async getAll(): Promise<Round[]> {
    return Round.findAll();
  }

  /**
   * Look up a round by ID. Returns `null` if none is found
   *
   * @param id Round id
   */
  public async getById(id: number): Promise<Round | null> {
    return Round.findOne({
      where: {
        id: {
          [Op.eq]: id
        },
      },
    });
  }

  /**
   * Get the current (and only) active round, if available.
   * Returns `null` if there are no active rounds.
   *
   * @throws If there are more than 1 active round
   */
  public async getCurrent(): Promise<Round | null> {
    const activeRounds: Round[] = await Round.findAll({
      where: {
        endDate: {
          [Op.eq]: null,
        },
      },
    });

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
