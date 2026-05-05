// Alternative: Create a utility function for handling multiple refs
import type { Ref } from "react";

/**
 * Utility to combine multiple refs into one callback ref
 * Useful when you need both react-hook-form's ref and your custom ref
 */
export function combineRefs<T>(
  ...refs: (Ref<T> | undefined)[]
): (instance: T | null) => void {
  return (instance: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref && typeof ref === "object") {
        (ref as any).current = instance;
      }
    });
  };
}

// Usage example:
// <Input
//   {...field}
//   ref={combineRefs(field.ref, firstInputRef)}
// />
