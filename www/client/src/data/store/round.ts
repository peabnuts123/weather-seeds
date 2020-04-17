import Store from "@app/data/base/store";
import Api from '@app/data/base/api';

import { WeatherInfoDto, WeatherInfo } from '@app/data/store/weather';
import { PredictorAndPredictionsDto, PredictorAndPredictions } from "@app/data/store/predictor";

interface RoundDto {
  id: number;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export class Round {
  public readonly id: number;
  public readonly startDate: Date;
  public readonly endDate?: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public constructor(raw: RoundDto) {
    this.id = raw.id;
    this.startDate = new Date(raw.startDate);
    this.endDate = raw.endDate ? new Date(raw.endDate) : undefined;
    this.createdAt = new Date(raw.createdAt);
    this.updatedAt = new Date(raw.updatedAt);
  }
}

interface RoundDetailsDto {
  round: RoundDto;
  weather: WeatherInfoDto[];
  predictors: PredictorAndPredictionsDto[];
}

export class RoundDetails {
  public readonly round: Round;
  public readonly weather: WeatherInfo[];
  public readonly predictors: PredictorAndPredictions[];

  public constructor(raw: RoundDetailsDto) {
    this.round = new Round(raw.round);
    this.weather = raw.weather.map((raw) => new WeatherInfo(raw));
    this.predictors = raw.predictors.map((raw) => new PredictorAndPredictions(raw, this.round));
  }
}

const API_BASE_ROUND = '/round';


class RoundStore extends Store {
  public async getAllRounds(): Promise<Round[]> {
    await this.waitUntilInitialised();

    const rawRounds: RoundDto[] = await Api.get(API_BASE_ROUND);
    return rawRounds.map((raw) => new Round(raw));
  }

  public async getRoundById(id: number): Promise<Round> {
    await this.waitUntilInitialised();

    const rawRound: RoundDto = await Api.get(API_BASE_ROUND + `/${id}`);
    return new Round(rawRound);
  }

  public async getCurrentRound(): Promise<Round> {
    await this.waitUntilInitialised();

    const rawRound: RoundDto = await Api.get(API_BASE_ROUND + '/active');
    return new Round(rawRound);
  }

  public async getRoundDetailsById(id: number): Promise<RoundDetails> {
    await this.waitUntilInitialised();

    const rawRoundDetails: RoundDetailsDto = await Api.get(API_BASE_ROUND + `/details/${id}`);
    return new RoundDetails(rawRoundDetails);
  }

  public async getCurrentRoundDetails(): Promise<RoundDetails> {
    await this.waitUntilInitialised();

    const rawRoundDetails: RoundDetailsDto = await Api.get(API_BASE_ROUND + `/details/active`);
    return new RoundDetails(rawRoundDetails);
  }
}

export default new RoundStore();
