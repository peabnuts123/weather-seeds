import Store from "@app/data/base/store";
// import Api from '@app/data/base/api';

export enum WeatherType {
  Rain = 'Weather_Type_Rain',
  Snow = 'Weather_Type_Snow',
  Cloud = 'Weather_Type_Cloud',
  Clear = 'Weather_Type_Clear',
}

export interface WeatherInfoDto {
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

class WeatherStore extends Store {
}

export default new WeatherStore();
