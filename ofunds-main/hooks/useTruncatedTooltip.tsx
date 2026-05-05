// hooks/useTruncatedTooltip.tsx
import { useMemo } from "react";

export const useTruncatedTooltip = (text: string, maxLength: number = 100) => {
  const truncated = useMemo(() => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) : text;
  }, [text, maxLength]);

  const isTruncated = text.length > maxLength;

  return { truncated, full: text, isTruncated };
};
