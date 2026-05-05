/**
 * @typedef {Object} MultiSelectOption
 * @property {string} label - The display label for the option (e.g., job role name).
 * @property {number | string} value - The unique identifier for the option (e.g., job role ID),
 * which can be a number or a string.
 */
interface MultiSelectOption {
  label: string;
  value: number | string; // Accepts number or string
}

/**
 * Filters a list of transformed job roles based on a given array of job role IDs.
 * This function now handles IDs that can be either numbers or strings by
 * converting both the role's value and the selected IDs to strings for comparison.
 *
 * @param {(number | string)[]} selectedJobRoleIds - An array of job role IDs (numbers or strings) to filter by.
 * @param {MultiSelectOption[]} transformedJobRoles - An array of job role objects,
 * each with a 'label' (string) and 'value' (number | string) property.
 * @returns {MultiSelectOption[]} A new array containing only the job roles
 * whose 'value' (converted to string) is present in the `selectedJobRoleIds` (converted to strings) array.
 */
export const filterIdsToOptions = (
  selectedJobRoleIds: (number | string)[],
  transformedJobRoles: MultiSelectOption[],
): MultiSelectOption[] => {
  // Convert all selectedJobRoleIds to strings for consistent comparison.
  // This ensures that '44' (number) and "44" (string) are treated the same.
  const stringifiedSelectedIds = selectedJobRoleIds.map(String);

  return transformedJobRoles.filter((role) =>
    // Convert the role's value to a string before checking if it's included
    // in the stringified list of selected IDs.
    stringifiedSelectedIds.includes(String(role.value)),
  );
};
