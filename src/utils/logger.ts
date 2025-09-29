import { Logger } from "@aws-lambda-powertools/logger";
import type { LogLevel } from "@aws-lambda-powertools/logger/types";

/**
 * Get a logger instance set up with the specified service name, log level, and environment.
 * @param serviceName Lambda or service that the logger is being used in.
 * @param logLevel The log level to use for the instance.
 * @param environment The environment that the service is running in.
 * @returns A logger instance with the specified configuration.
 */
const getLogger = (
  serviceName: string,
  logLevelName?: string,
  environment: string = "dev",
): Logger => {
  const logLevel = (logLevelName ||
    (process.env.LOG_LEVEL as LogLevel) ||
    "ERROR") as LogLevel;
  const logger = new Logger({ serviceName, logLevel, environment });

  return logger;
};

export const logger = getLogger(
  process.env.PACKAGE_NAME as string,
  process.env.LOG_LEVEL || "DEBUG",
);
