/**
 * Formats a given number as a currency string in Nigerian Naira (NGN),
 * including comma separators for thousands.
 *
 * @param amount - The numeric value to format.
 * @returns A formatted string in the format "NGN X,XXX.XX".
 */
export const formatCurrency = (amount: number): string => {
  return `NGN ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
};

// utils/currency.ts
export const CURRENCY_CODES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "CNY",
  "HKD",
  "SGD",
  // Add all supported currency codes
];

export function formatAnyCurrency(
  value: string | number,
  currencyCode: string = "USD",
  locale: string = "en-US",
): string {
  const amount = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(amount)) return "N/A";

  const currency = CURRENCY_CODES.includes(currencyCode.toUpperCase())
    ? currencyCode.toUpperCase()
    : "USD";

  try {
    return amount.toLocaleString(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch (error) {
    console.error("Currency formatting failed:", error);
    // Fallback to simple number formatting
    return amount.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

/**
 * Formats a number with comma separators and exactly two decimal places.
 *
 * @param {number} n - The number to format (e.g., 1000).
 * @returns {string} The formatted number as a string (e.g., "1,000.00").
 */
export function formatNumber(n: number): string {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Formats a number with comma separators (no decimal places).
 * Useful for display values like "2,000" instead of "2000".
 *
 * @param {number | string} value - The value to format.
 * @returns {string} The formatted number as a string (e.g., "2,000").
 */
export function formatStandardNumber(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0";
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Formats a number with commas for display in inputs (no trailing decimals forced).
 *
 * @param {string} value - The raw numeric string.
 * @returns {string} The formatted string with commas (e.g., "2,000").
 */
export function formatNumberWithCommas(value: string): string {
  const isNegative = value.startsWith("-");
  const numericValue = value.replace(/[^0-9.]/g, "");
  if (!numericValue) return isNegative ? "-" : "";
  const parts = numericValue.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (isNegative ? "-" : "") + parts.join(".");
}

/**
 * Removes commas from a formatted number string.
 *
 * @param {string} value - The formatted string with commas.
 * @returns {string} The raw numeric string.
 */
export function parseFormattedNumber(value: string): string {
  return value.replace(/,/g, "");
}

/**
 * Formats a decimal hours value into a human-readable "X hrs Y mins" format.
 *
 * @param {number | string} value - The hours value (e.g., 6.53).
 * @returns {string} The formatted string (e.g., "6 hrs 32 mins").
 */
export function formatHoursMinutes(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num) || num === 0) return "0 hrs 0 mins";
  const hours = Math.floor(num);
  const minutes = Math.round((num - hours) * 60);
  return `${hours} hrs ${minutes} mins`;
}

/**
 * Ensures a value always has exactly 2 decimal places.
 *
 * @param {number | string} value - The value to format.
 * @returns {string} The formatted string with 2 decimal places.
 */
export function toFixed2(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0.00";
  return num.toFixed(2);
}

// Example usage
// console.log(formatNumber(1000)); // Output: "1,000.00"
