/**
 * Retrieves the label corresponding to a given value from an array of label-value pairs.
 * Handles both string and number values through TypeScript generics.
 *
 * @template T - The type of the value (string or number)
 * @param {string | number} value - The value to search for (will be stringified for comparison)
 * @param {Array<{label: string, value: T}>} options - Array of objects containing label-value pairs
 * @returns {string} The matching label if found, otherwise returns the string representation of the value
 *
 * @example
 * // With number values
 * const departments = [{ label: 'Engineering', value: 1 }];
 * getLabelFromValue(1, departments); // Returns 'Engineering'
 *
 * @example
 * // With string values
 * const jobRoles = [{ label: 'Developer', value: 'dev' }];
 * getLabelFromValue('dev', jobRoles); // Returns 'Developer'
 */
export const getLabelFromValue = <T extends string | number>(
  value: string | number | undefined | null,
  options: Array<{ label: string; value: T }>
): string => {
  if (value === undefined || value === null) return "";

  const stringValue = String(value);
  const found = options.find((option) => String(option.value) === stringValue);

  return found ? found.label : stringValue;
};

