/**
 * Safely parses a JSON string and returns the parsed value or a fallback
 * @param value - The value to parse (could be string, array, or other type)
 * @param fallback - The fallback value if parsing fails
 * @returns The parsed value or fallback
 */
export function safeJsonParse<T extends any[]>(value: unknown, fallback: T): T {
  if (Array.isArray(value)) {
    return value as T;
  }

  if (value == null) {
    return fallback;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T) : fallback;
    } catch {
      if (value.trim()) {
        return [value] as T;
      }
      return fallback;
    }
  }

  return fallback;
}

/**
 * Converts various data formats to an array of specific types (number or string)
 * @param value - The value to convert
 * @param type - The desired output type for all items: "number" or "string"
 * @returns Array of strings or numbers
 */
export function parseMultiSelectValue(
  value: unknown,
  type: "number" | "string" = "string",
): (string | number)[] {
  const parsed = safeJsonParse(value, []);

  return parsed
    .map((v) => {
      if (type === "number") {
        const num = Number(v);
        return !isNaN(num) && v !== "" ? num : null;
      } else {
        return String(v);
      }
    })
    .filter((v) => v !== null); // Remove nulls if parsing to number fails
}

/**
 * Converts training data fields to the format expected by the form
 * @param training - The training data object
 * @returns Parsed training data with arrays properly converted
 */
export function parseTrainingData(training: any) {
  if (!training) return null;
  return {
    ...training,
    grade_level_id: parseMultiSelectValue(training.grade_level_id, "number"),
    job_role_id: parseMultiSelectValue(training.job_role_id, "number"),
    job_location_id: parseMultiSelectValue(training.job_location_id, "number"),
    department: parseMultiSelectValue(training.department_id, "number"),
    employee_type_id: parseMultiSelectValue(
      training.employee_type_id,
      "number",
    ),
  };
}
