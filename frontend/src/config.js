const configuredApiUrl = import.meta.env.VITE_API_URL?.trim() || "";
const localApiUrlPattern = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(?:[/?#]|$)/i;
const browserHostname = typeof window !== "undefined" ? window.location.hostname : "";
const isBrowserLocalhost = browserHostname === "localhost" || browserHostname === "127.0.0.1";
const isConfiguredLocalApiUrl = localApiUrlPattern.test(configuredApiUrl);

const shouldUseConfiguredApiUrl =
  configuredApiUrl && (!isConfiguredLocalApiUrl || isBrowserLocalhost);

export const API_BASE_URL = shouldUseConfiguredApiUrl
  ? configuredApiUrl.replace(/\/$/, "")
  : isBrowserLocalhost
    ? "http://localhost:5000"
    : "";
