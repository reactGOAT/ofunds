"use client";

import { useEffect, type RefObject } from "react";

interface UseFocusManagementOptions {
  /**
   * Ref to the input element that should receive focus
   */
  inputRef: RefObject<HTMLInputElement>;

  /**
   * Whether the component/modal is open
   */
  isOpen: boolean;

  /**
   * Whether using Sheet component (needs delay) vs Popover (immediate focus)
   * @default false
   */
  useSheet?: boolean;

  /**
   * Custom delay in milliseconds for Sheet components
   * @default 150
   */
  sheetDelay?: number;

  /**
   * Additional condition that must be true for focus to occur
   * Useful for hierarchical components where focus should only happen in certain views
   */
  shouldFocus?: boolean;

  /**
   * Dependencies array for the useEffect
   * @default [isOpen]
   */
  dependencies?: any[];
}

/**
 * Custom hook to handle focus management for Sheet vs Popover components
 *
 * @example
 * ```tsx
 * const searchInputRef = useRef<HTMLInputElement>(null)
 *
 * // Basic usage for simple modals
 * useFocusManagement({
 *   inputRef: searchInputRef,
 *   isOpen: isModalOpen,
 *   useSheet: true
 * })
 *
 * // Advanced usage for hierarchical components
 * useFocusManagement({
 *   inputRef: searchInputRef,
 *   isOpen: isModalOpen,
 *   useSheet: useSheetMode,
 *   shouldFocus: currentView !== "main", // Only focus when not in main view
 *   dependencies: [isModalOpen, currentView, useSheetMode]
 * })
 * ```
 */
export const useFocusManagement = ({
  inputRef,
  isOpen,
  useSheet = false,
  sheetDelay = 150,
  shouldFocus = true,
  dependencies = [isOpen],
}: UseFocusManagementOptions) => {
  useEffect(() => {
    // Check all conditions before attempting to focus
    if (isOpen && shouldFocus && inputRef.current) {
      if (useSheet) {
        // Sheet components need delay for overlay and animations to settle
        const timer = setTimeout(() => {
          inputRef.current?.focus();
        }, sheetDelay);

        return () => clearTimeout(timer);
      } else {
        // Popover components can focus immediately
        inputRef.current.focus();
      }
    }
  }, dependencies);
};

/**
 * Preset configurations for common use cases
 */
export const focusPresets = {
  /**
   * For simple modals/sheets with immediate focus needs
   */
  simpleModal: (
    inputRef: RefObject<HTMLInputElement>,
    isOpen: boolean,
    useSheet?: boolean,
  ) => ({
    inputRef,
    isOpen,
    useSheet,
    dependencies: [isOpen, useSheet],
  }),

  /**
   * For hierarchical filters where focus should only happen in category views
   */
  hierarchicalFilter: (
    inputRef: RefObject<HTMLInputElement>,
    isOpen: boolean,
    currentView: string,
    useSheet?: boolean,
  ) => ({
    inputRef,
    isOpen,
    useSheet,
    shouldFocus: currentView !== "main",
    dependencies: [isOpen, currentView, useSheet],
  }),

  /**
   * For components that need custom focus conditions
   */
  conditional: (
    inputRef: RefObject<HTMLInputElement>,
    isOpen: boolean,
    condition: boolean,
    useSheet?: boolean,
  ) => ({
    inputRef,
    isOpen,
    useSheet,
    shouldFocus: condition,
    dependencies: [isOpen, condition, useSheet],
  }),
};
