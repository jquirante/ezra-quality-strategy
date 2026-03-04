/**
 * Reads a required environment variable.
 * Throws at test startup if a required var is missing — fails fast, not mid-test.
 *
 * @param {string} key
 * @param {string} [fallback]
 * @returns {string}
 */
function getEnv(key, fallback) {
  const value = process.env[key];
  if (!value && fallback === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || fallback;
}

module.exports = { getEnv };
