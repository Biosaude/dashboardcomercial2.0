export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  readonly request_id?: string;
  readonly phase?: string | number;
  readonly operation?: string;
  readonly result?: "success" | "failure";
  readonly duration_ms?: number;
  readonly error_code?: string;
}

export interface LogEntry {
  readonly timestamp: string;
  readonly level: LogLevel;
  readonly message: string;
  readonly context: LogContext;
}

export type LogWriter = (entry: LogEntry) => void;

const defaultWriter: LogWriter = (entry) => {
  const serialized = JSON.stringify(entry);
  if (entry.level === "error") {
    console.error(serialized);
    return;
  }
  if (entry.level === "warn") {
    console.warn(serialized);
    return;
  }
  console.log(serialized);
};

export function createLogger(baseContext: LogContext = {}, writer: LogWriter = defaultWriter) {
  const log = (level: LogLevel, message: string, context: LogContext = {}) => {
    writer({
      timestamp: new Date().toISOString(),
      level,
      message,
      context: { ...baseContext, ...context },
    });
  };

  return {
    debug: (message: string, context?: LogContext) => log("debug", message, context),
    info: (message: string, context?: LogContext) => log("info", message, context),
    warn: (message: string, context?: LogContext) => log("warn", message, context),
    error: (message: string, context?: LogContext) => log("error", message, context),
  } as const;
}
