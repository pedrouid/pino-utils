import { Logger, LoggerOptions } from 'pino';

import { PINO_LOGGER_DEFAULTS } from './constants';

export function getDefaultLoggerOptions(opts?: LoggerOptions): LoggerOptions {
  return {
    ...opts,
    level: opts?.level || PINO_LOGGER_DEFAULTS.level,
    prettyPrint: opts?.prettyPrint || PINO_LOGGER_DEFAULTS.prettyPrint,
  };
}

export function getBrowserLoggerContext(logger: Logger): string {
  return (logger as any).custom_context;
}

export function setBrowserLoggerContext(
  logger: Logger,
  context: string
): Logger {
  (logger as any).custom_context = context;
  return logger;
}

export function getLoggerContext(logger: Logger): string {
  let context = '';
  if (typeof logger.bindings === 'undefined') {
    context = (logger as any).custom_context;
  } else {
    context = logger.bindings().context || '';
  }
  return context;
}

export function formatChildLoggerContext(
  logger: Logger,
  childContext: string
): string {
  const parentContext = getLoggerContext(logger);
  const context = `${parentContext ? `${parentContext}/` : ''}${childContext}`;
  return context;
}

export function generateChildLogger(
  logger: Logger,
  childContext: string
): Logger {
  const context = formatChildLoggerContext(logger, childContext);
  const child = logger.child({ context });
  return setBrowserLoggerContext(child, context);
}
