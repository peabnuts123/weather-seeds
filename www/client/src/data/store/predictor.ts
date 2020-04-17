import Store from "@app/data/base/store";
// import Api from '@app/data/base/api';

import { Round } from "@app/data/store/round";
import { WeatherType } from "@app/data/store/weather";

export interface PredictorDto {
  id: number;
  seed: string;
  roundId: number;
  firstIncorrectDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export class Predictor {
  public readonly id: number;
  public readonly seed: string;
  public readonly firstIncorrectDate?: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly round: Round;

  private readonly roundId: number;

  public constructor(raw: PredictorDto, round: Round) {
    this.id = raw.id;
    this.seed = raw.seed;
    this.roundId = raw.roundId;
    this.firstIncorrectDate = raw.firstIncorrectDate ? new Date(raw.firstIncorrectDate) : undefined;
    this.createdAt = new Date(raw.createdAt);
    this.updatedAt = new Date(raw.updatedAt);
    this.round = round;
  }
}

export interface PredictorAndPredictionsDto extends PredictorDto {
  predictions: WeatherType[];
}

export class PredictorAndPredictions extends Predictor {
  public readonly predictions: WeatherType[];

  public constructor(raw: PredictorAndPredictionsDto, round: Round) {
    super(raw, round);
    this.predictions = raw.predictions;
  }
}

class PredictorStore extends Store {
}

export default PredictorStore;
