import Logger, { LogLevel } from '@common/util/Logger';

export default function runJob(jobName: string, jobEntryPoint: () => Promise<void>) {
  if (process.env.NODE_ENV === 'production') {
    // In production, sleep for a period to ensure DB migrations have been run
    const SLEEP_TIMEOUT_SECONDS = 30;

    Logger.log(`Job '${jobName}' awake. Sleeping for ${SLEEP_TIMEOUT_SECONDS} seconds to ensure DB migrations have run`);
    setTimeout(() => {
      jobEntryPoint();
    }, SLEEP_TIMEOUT_SECONDS * 1000);
  } else {
    // Development mode - run process immediately
    Logger.log(`Job '${jobName}' awake. Development mode - running immediately`)
    jobEntryPoint();
  }
}

