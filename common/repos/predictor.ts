import { Op } from 'sequelize';

import Round from '@db/models/Round';
import Predictor from '@db/models/Predictor';

class PredictorRepository {
  /**
   * Get all the predictors for the round with id `roundId`
   * @param roundId ID of the round to get predictors belonging to
   */
  public async getPredictorsForRound(roundId: number): Promise<Predictor[]>;
  /**
   * Get all the predictors for given round
   * @param round Round instance to get predictors belonging to
   */
  public async getPredictorsForRound(round: Round): Promise<Predictor[]>;
  public async getPredictorsForRound(roundOrId: Round | number): Promise<Predictor[]> {
    if (typeof roundOrId === 'number') {
      // Round id - query for predictors "manually"
      return Predictor.findAll({
        where: {
          roundId: {
            [Op.eq]: roundOrId,
          },
        },
      });
    } else {
      // Round instance - use sequelize API to query predictors
      return roundOrId.getPredictors();
    }
  }
}

export default new PredictorRepository();
