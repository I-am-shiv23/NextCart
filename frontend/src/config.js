const configuredApiUrl = import.meta.env.VITE_API_URL?.trim() || "";
const localApiUrlPattern = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(?:[/?#]|$)/i;

const shouldUseConfiguredApiUrl =
  configuredApiUrl && (import.meta.env.DEV || !localApiUrlPattern.test(configuredApiUrl));

export const API_BASE_URL = shouldUseConfiguredApiUrl
  ? configuredApiUrl.replace(/\/$/, "")
  : import.meta.env.DEV
    ? "http://localhost:5000"
    : "";
