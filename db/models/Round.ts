import { Model, Sequelize, DataTypes, HasManyCreateAssociationMixinOptions, HasManyGetAssociationsMixinOptions } from 'sequelize';

import Predictor from '@db/models/Predictor';


export default class Round extends Model {
  /** Date this round started */
  public readonly startDate!: Date;
  /** Date this round ended */
  public endDate!: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /** Fetch all predictors in this round */
  public readonly getPredictors!: (options?: HasManyGetAssociationsMixinOptions) => Promise<Predictor[]>;
  /** Create a new predictor in this round */
  public readonly createPredictor!: (rawRecord?: Record<string, any>, options?: HasManyCreateAssociationMixinOptions) => Promise<Predictor>;

  /** Whether this round is still active */
  public get isActive(): boolean {
    return this.endDate !== null;
  }
};

export function registerRoundModel(sequelize: Sequelize) {
  Round.init({
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    freezeTableName: true,
  });
}

export function registerRoundRelationships() {
  Round.hasMany(Predictor, {
    foreignKey: 'roundId',
    sourceKey: 'id',
    as: 'predictors',
  });
}
