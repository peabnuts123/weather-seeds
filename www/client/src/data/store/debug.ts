import Store from "@app/data/base/store";
import Api from '@app/data/base/api';

export enum WeatherType {
  Rain = 'Weather_Type_Rain',
  Snow = 'Weather_Type_Snow',
  Cloud = 'Weather_Type_Cloud',
  Clear = 'Weather_Type_Clear',
}

interface WeatherInfoDto {
  id: number;
  type: string;
  raw: string;
  createdAt: string;
  updatedAt: string;
}

export class WeatherInfo {
  public readonly id: number;
  public readonly type: WeatherType;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(raw: WeatherInfoDto) {
    this.id = raw.id;
    this.type = raw.type as WeatherType;
    this.createdAt = new Date(raw.createdAt);
    this.updatedAt = new Date(raw.updatedAt);
  }
}

class DebugStore extends Store {
  public async getAllWeatherInfo(): Promise<WeatherInfo[]> {
    await this.waitUntilInitialised();

    const rawRecords: WeatherInfoDto[] = await Api.get('/debug');
    return rawRecords.map((dto) => new WeatherInfo(dto));
  }

  public async getModelPredictions(seed: string): Promise<WeatherType[]> {
    await this.waitUntilInitialised();

    // @TODO lol, dangerous cancat. Should validate seed
    return Api.get(`/model/${seed}`);
  }
}

export default new DebugStore();
