/** Response payload from OpenWeatherMap's API */
export default interface OpenWeatherMapResponse {
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
};
