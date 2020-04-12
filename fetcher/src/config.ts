import Logger, { LogLevel } from '@app/util/Logger';

// Config / environment variables
const CONFIG = {
  DB: {
    DB_NAME: process.env.POSTGRES_DB as string,
    USER: process.env.POSTGRES_USER as string,
    PASSWORD: process.env.POSTGRES_PASSWORD as string,
    HOST: process.env.DB_HOST as string,
    MAX_CONNECTION_ATTEMPTS: 5,
  },
  OPENWEATHERMAP: {
    API_KEY: process.env.OPENWEATHERMAP_API_KEY as string,
  },
  ENDPOINTS: {
    API_BASE: 'https://api.openweathermap.org',
    CURRENT_WEATHER: '/data/2.5/weather',
  },
};

// Validation
// DB
if (!CONFIG.DB.DB_NAME) {
  throw new Error("Cannot start Fetcher - Environment variable 'POSTGRES_DB' is empty");
} else if (!CONFIG.DB.USER) {
  throw new Error("Cannot start Fetcher - Environment variable 'POSTGRES_USER' is empty");
} else if (!CONFIG.DB.PASSWORD) {
  throw new Error("Cannot start Fetcher - Environment variable 'POSTGRES_PASSWORD' is empty");
} else if (!CONFIG.DB.PASSWORD) {
  throw new Error("Cannot start Fetcher - Environment variable 'DB_HOST' is empty");
}

// OPENWEATHERMAP
if (!CONFIG.OPENWEATHERMAP.API_KEY) {
  throw new Error("Cannot start Fetcher - Environment variable 'OPENWEATHERMAP_API_KEY' is empty")
}

// Logger config
Logger.setLogLevel(LogLevel.debug);

export default CONFIG;
