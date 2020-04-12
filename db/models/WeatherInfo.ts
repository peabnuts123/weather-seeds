import { Model, Sequelize, DataTypes } from 'sequelize';

/** Broad categorisation of OpenWeatherMap's types */
export enum WEATHER_TYPE {
  Rain = 'Weather_Type_Rain',
  Snow = 'Weather_Type_Snow',
  Cloud = 'Weather_Type_Cloud',
  Clear = 'Weather_Type_Clear',
};

export default class WeatherInfo extends Model {
  /** Raw serialized enum WEATHER_TYPE */
  private type!: string;

  /** Raw JSON response from the API */
  public raw!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  /** Enum WEATHER_TYPE of this WeatherInfo */
  public get weatherType(): WEATHER_TYPE {
    return this.type as WEATHER_TYPE;
  }
};

export function registerWeatherInfoModel(sequelize: Sequelize) {
  WeatherInfo.init({
    type: {
      type: new DataTypes.STRING(64),
    },
    raw: {
      type: DataTypes.JSON,
    },
  }, {
    sequelize,
    freezeTableName: true,
  });
}
