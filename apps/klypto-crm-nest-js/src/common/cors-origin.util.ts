const LOCAL_DEV_ORIGIN_PATTERN =
  /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}|.*\.trycloudflare\.com)(:\d+)?$/;

/**
 * Single source of truth for which frontend origins may talk to the API,
 * shared by the REST CORS config (main.ts) and the WebSocket gateway so the
 * two never drift apart.
 */
export function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true;

  const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (corsOrigins.includes('*') || corsOrigins.includes(origin)) {
    return true;
  }

  const isProduction = process.env.NODE_ENV === 'production';
  return !isProduction && LOCAL_DEV_ORIGIN_PATTERN.test(origin);
}
