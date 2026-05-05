import React, { useState, useCallback, useMemo } from "react";

// Define a generic type for your table data row
type TableRowData = Record<string, any>;

interface UseTableSelectionProps<T extends TableRowData> {
  data: T[] | undefined; // The array of data items for the table
  getId: (row: T) => string | number; // Function to extract unique ID from a row
}

interface UseTableSelectionReturn {
  selectedRows: Set<string | number>;
  onSelectRow: (id: string | number, isSelected: boolean) => void;
  onSelectAllRows: (isSelected: boolean) => void;
}

/**
 * A custom React hook to manage row selection state for a table.
 *
 * @template T The type of the individual data row objects in the table.
 * @param {UseTableSelectionProps<T>} props - The properties for the hook.
 * @param {T[] | undefined} props.data - The array of data items currently displayed in the table.
 * @param {(row: T) => string | number} props.getId - A function that takes a row object and returns its unique ID.
 * @returns {UseTableSelectionReturn} An object containing the selected rows state and functions to manage selection.
 */
export const useTableSelection = <T extends TableRowData>({
  data,
  getId,
}: UseTableSelectionProps<T>): UseTableSelectionReturn => {
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set(),
  );

  // Callback to handle selection/deselection of a single row
  const onSelectRow = useCallback(
    (id: string | number, isSelected: boolean) => {
      setSelectedRows((prev) => {
        const newSelectedRows = new Set(prev);
        if (isSelected) {
          newSelectedRows.add(id);
        } else {
          newSelectedRows.delete(id);
        }
        return newSelectedRows;
      });
    },
    [],
  );

  // Memoize all available row IDs for efficiency when selecting all
  const allRowIds = useMemo(() => {
    if (!data) return new Set<string | number>();
    return new Set(data?.map(getId));
  }, [data, getId]);

  // Callback to handle selection/deselection of all visible rows
  const onSelectAllRows = useCallback(
    (isSelected: boolean) => {
      if (isSelected) {
        setSelectedRows(allRowIds);
      } else {
        setSelectedRows(new Set());
      }
    },
    [allRowIds],
  );

  // Optionally, you might want to clear selections if the data changes significantly
  // For example, if a filter is applied that drastically changes the `data` array.
  // Be cautious with this, as it might clear selections unexpectedly if data updates frequently
  // but logically represents the same set of items (e.g., re-ordering).
  // useEffect(() => {
  //   // Example: Clear selections if an item no longer exists in `data`
  //   setSelectedRows(prev => {
  //     const newSet = new Set<string | number>();
  //     prev.forEach(id => {
  //       if (allRowIds.has(id)) {
  //         newSet.add(id);
  //       }
  //     });
  //     return newSet;
  //   });
  // }, [allRowIds]);

  return {
    selectedRows,
    onSelectRow,
    onSelectAllRows,
  };
};
