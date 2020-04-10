import express from 'express';
import fetch from 'node-fetch';
import { config as dotenv, DotenvParseOutput } from 'dotenv';

// CONFIG
// Parse .env
let envParsed = dotenv();
if (envParsed.error) {
  throw envParsed.error;
}
const config = dotenv().parsed as DotenvParseOutput;
const { WEATHERMAPS_API_KEY } = config;

// Endpoints
const ENDPOINT = {
  CURRENT_WEATHER: `https://api.openweathermap.org/data/2.5/weather`
};


// LOGIC
/** Broad categorisation of OpenWeatherMap's types */
enum WEATHER_TYPE {
  Rain = 'Weather_Type_Rain',
  Snow = 'Weather_Type_Snow',
  Cloud = 'Weather_Type_Cloud',
  Clear = 'Weather_Type_Clear',
}

/** Response payload from OpenWeatherMap's API */
interface OpenWeatherMapResponse {
  coord: {
    /** City geo location, longitude */
    lon: number;
    /** City geo location, latitude */
    lat: number;
  };
  weather: {
    /** Weather condition id */
    id: number;
    /** Group of weather parameters (Rain, Snow, Extreme etc.)  */
    main: string;
    /** Weather condition within the group. */
    description: string;
    /** Weather icon id */
    icon: string;
  }[];
  /** Internal parameter */
  base: string;
  main: {
    /** Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit. */
    temp: number;
    /** Temperature. This temperature parameter accounts for the human perception of weather */
    feels_like: number;
    /** Minimum temperature at the moment. This is deviation from current temp that is possible for large cities and megalopolises geographically expanded (use these parameter optionally). */
    temp_min: number;
    /** Maximum temperature at the moment. This is deviation from current temp that is possible for large cities and megalopolises geographically expanded (use these parameter optionally). */
    temp_max: number;
    /** Atmospheric pressure (on the sea level, if there is no sea_level or grnd_level data), hPa */
    pressure: number;
    /** Atmospheric pressure on the sea level, hPa */
    sea_level?: number;
    /** Atmospheric pressure on the ground level, hPa */
    grnd_level?: number;
    /** Humidity, % */
    humidity: number;
  };
  /** Visibility, meter */
  visibility?: number;
  wind: {
    /** Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour. */
    speed: number;
    /** Wind direction, degrees (meteorological) */
    deg: number;
  };
  rain?: {
    /** Amount, in mm ? (not documented) */
    '3h': string;
  },
  clouds: {
    /** Cloudiness, % */
    all: number;
  };
  /** Time of data calculation, unix, UTC */
  dt: number;
  sys: {
    /** Internal parameter */
    type: number;
    /** Internal parameter */
    id: number;
    /** Internal parameter */
    message: number;
    /** Country code (GB, JP etc.) */
    country: string;
    /** Sunrise time, unix, UTC */
    sunrise: number;
    /** Sunset time, unix, UTC */
    sunset: number;
  };
  /** Shift in seconds from UTC */
  timezone: number;
  /** City ID */
  id: number;
  /** City name */
  name: string;
  /** Internal parameter */
  cod: number;
}

async function main() {
  const requestUrl = new URL(ENDPOINT.CURRENT_WEATHER);
  requestUrl.searchParams.append('appid', WEATHERMAPS_API_KEY);
  requestUrl.searchParams.append('q', 'Wellington,nz');

  requestUrl.searchParams.append('units', 'metric');

  let response = await fetch(requestUrl, {
    method: 'GET',
  });

  if (response.status === 200) {
    // Request succeeded
    let weatherResponse: OpenWeatherMapResponse = await response.json();;
    console.log("Got response from Weather API.");
    let weatherType = resolveWeatherTypeFromResponse(weatherResponse);
    console.log("Resolved weather type: ", weatherType);
  } else {
    throw new Error("Failed to request: " + response.statusText);
  }
}

main();

/** Reduce OWM's weather categorisations down to custom broad categorisations */
function resolveWeatherTypeFromResponse(response: OpenWeatherMapResponse): WEATHER_TYPE {
  // See https://openweathermap.org/weather-conditions for definitions
  if (!response.weather || response.weather.length === 0) {
    console.log(`[DEBUG]`, response);
    throw new Error("Cannot resolve weather type - response contained no weather codes");
  } else if (response.weather.length > 1) {
    // @TODO handle this scenario (what do?)
    console.log(`[DEBUG]`, response);
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
    console.log(`[DEBUG]`, response);
    throw new Error("Cannot resolve weather type - unrecognised code: " + weatherCode)
  }
}