/**
 * Parses a currency string from the UI into a float.
 * e.g. "$1,200.00" → 1200.00
 *
 * @param {string} text
 * @returns {number}
 */
function parseCurrency(text) {
  if (!text || !text.trim()) {
    throw new Error('parseCurrency: received empty or null value');
  }
  const cleaned = text.replace(/[^0-9.]/g, '');
  const value = parseFloat(cleaned);
  if (isNaN(value)) {
    throw new Error(`parseCurrency: could not parse "${text}"`);
  }
  return value;
}

module.exports = { parseCurrency };
