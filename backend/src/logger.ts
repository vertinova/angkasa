export const logger = {
  info(message: string, meta?: unknown) {
    console.info(JSON.stringify({ level: "info", message, meta, at: new Date().toISOString() }));
  },
  warn(message: string, meta?: unknown) {
    console.warn(JSON.stringify({ level: "warn", message, meta, at: new Date().toISOString() }));
  },
  error(message: string, meta?: unknown) {
    console.error(JSON.stringify({ level: "error", message, meta, at: new Date().toISOString() }));
  }
};
