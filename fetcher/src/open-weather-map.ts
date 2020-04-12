import Config from '@app/config';
import Api from '@app/api';
import OpenWeatherMapResponse from '@app/types/OpenWeatherMapResponse';
import Logger, { LogLevel } from '@app/util/Logger';

import { WEATHER_TYPE } from '@db/models/WeatherInfo';


class OpenWeatherMap {
  /**
   * Utility function to extract common logic out between requests.
   *
   * @param path OpenWeatherMap API path to request
   */
  private generateOpenWeatherMapRequest(path: string) {
    const requestUrl = new URL(path, Config.ENDPOINTS.API_BASE);
    requestUrl.searchParams.append('appid', Config.OPENWEATHERMAP.API_KEY);
    requestUrl.searchParams.append('units', 'metric');
    return requestUrl;
  }

  /**
   * Look up the current weather for a given city
   *
   * @param city City name e.g. 'Wellington'
   * @param countryCode ISO 3166 country code e.g. 'nz'
   */
  public async getCurrentWeatherByCity(city: string, countryCode: string): Promise<OpenWeatherMapResponse> {
    const requestUrl = this.generateOpenWeatherMapRequest(Config.ENDPOINTS.CURRENT_WEATHER);
    requestUrl.searchParams.append('q', `${city},${countryCode}`);

    return Api.get(requestUrl) as Promise<OpenWeatherMapResponse>;
  }

  /** Reduce OWM's weather categorisations down to custom broad categorisations */
  public resolveWeatherTypeFromResponse(response: OpenWeatherMapResponse): WEATHER_TYPE {
    // See https://openweathermap.org/weather-conditions for definitions
    if (!response.weather || response.weather.length === 0) {
      Logger.log(LogLevel.debug, response);
      throw new Error("Cannot resolve weather type - response contained no weather codes");
    } else if (response.weather.length > 1) {
      // @TODO handle this scenario (what do?)
      Logger.log(LogLevel.debug, response);
      throw new Error("Cannot resolve weather type - response contained more than 1 weather code")
    }

    const weatherCode = response.weather[0].id;

    if (weatherCode > 800 && weatherCode < 900) {
      // 8xx - Cloudy
      return WEATHER_TYPE.Cloud;
    } else if (weatherCode === 800) {
      // 800 - Clear
      return WEATHER_TYPE.Clear;
    } else if (weatherCode >= 700) {
      // 7xx - Atmosphere e.g. Fog, Dust storm etc.
      return WEATHER_TYPE.Cloud;
    } else if (weatherCode >= 600) {
      // 6xx - Snow
      return WEATHER_TYPE.Snow;
    } else if (weatherCode >= 500) {
      // 5xx - Rain
      return WEATHER_TYPE.Rain;
    } else if (weatherCode >= 300 && weatherCode < 400) {
      // 3xx - Drizzle
      return WEATHER_TYPE.Rain;
    } else if (weatherCode >= 200) {
      // 2xx - Thunderstorm
      return WEATHER_TYPE.Rain;
    } else {
      Logger.log(LogLevel.debug, response);
      throw new Error("Cannot resolve weather type - unrecognised code: " + weatherCode)
    }
  }
}

export default new OpenWeatherMap();
