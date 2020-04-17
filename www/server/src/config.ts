import Logger, { LogLevel } from '@common/util/Logger';

// Config / environment variables
const CONFIG = {
  DB: {
    DB_NAME: process.env.POSTGRES_DB as string,
    USER: process.env.POSTGRES_USER as string,
    PASSWORD: process.env.POSTGRES_PASSWORD as string,
    HOST: process.env.DB_HOST as string,
    MAX_CONNECTION_ATTEMPTS: 5,
  },
  SERVER: {
    PORT: (process.env.API_PORT && Number(process.env.API_PORT)) as number,
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

// PORT
if (!CONFIG.SERVER.PORT) {
  throw new Error("Cannot start Fetcher - Environment variable 'API_PORT' is empty");
}

// Logger config
Logger.setLogLevel(LogLevel.debug);

export default CONFIG;
