import crypto from 'crypto';
import { Model, Sequelize, DataTypes } from 'sequelize';
import { MersenneTwister19937, integer, real } from 'random-js';

import Round from '@db/models/Round';
import { WEATHER_TYPE } from '@db/models/WeatherInfo';

export default class Predictor extends Model {
  /** Predictor seed */
  public readonly seed!: string;
  /** ID of associated Round this predictor belongs to */
  private readonly roundId!: number;
  /** Date this predictor was first incorrect */
  public firstIncorrectDate!: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /** Fetch the round this predictor belongs to */
  public readonly getRound!: () => Promise<Round>;

  /**
   * Generate an array of predictions. Always generates the same
   * predictions in the same order.
   *
   * @param count Number of predictions to count
   */
  public getPredictions(count: number): WEATHER_TYPE[] {
    // let rawModelSeed = req.params['seed'];

    // Seed for PRNG generator
    let prngSeed = parseInt(
      // Hash model seed and take last 4 bytes
      crypto.createHmac("sha256", this.seed).digest('hex').substring(56),
      // Convert hex string to number (is at most 0xFFFFFFFF because of substring())
      16
    );

    const prng = MersenneTwister19937.seed(prngSeed);

    // @TODO probably put this somewhere better
    // @TODO research a better way to inform this
    const weatherTypeValues = Object.values(WEATHER_TYPE);
    let weatherWeights: Record<WEATHER_TYPE, number> = {
      [WEATHER_TYPE.Snow]: 0.0025,
      [WEATHER_TYPE.Clear]: 0.3325,
      [WEATHER_TYPE.Rain]: 0.3325,
      [WEATHER_TYPE.Cloud]: 0.3325,
    };

    // Generate `count` predictions
    let predictions: WEATHER_TYPE[] = [];
    for (let i = 0; i < count; i++) {
      // Implementing weighted random based on weights table above
      let probabilitySum = 0;
      let randValue = real(0, 1, false)(prng);
      for (let weatherTypeValue of weatherTypeValues) {
        probabilitySum += weatherWeights[weatherTypeValue];
        if (randValue < probabilitySum) {
          predictions.push(weatherTypeValue);
          break;
        }
      }
    }

    return predictions;
  }
};


export function registerPredictorModel(sequelize: Sequelize) {
  Predictor.init({
    seed: {
      type: DataTypes.STRING,
    },
    roundId: {
      type: DataTypes.INTEGER,
    },
    firstIncorrectDate:
    {
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    freezeTableName: true,
    indexes: [
      // Restrict a round from having 2 of the same predictor
      {
        fields: ['seed', 'roundId'],
        unique: true,
      },
    ],
  });
}

export function registerPredictorRelationships() {
  Predictor.belongsTo(Round, {
    foreignKey: 'roundId', // This property on the source model (i.e. Predictor)
    targetKey: 'id', // looks at this property on the target model (i.e. Round)
    as: 'round', // referred to as this e.g. getRound()
  });
}
