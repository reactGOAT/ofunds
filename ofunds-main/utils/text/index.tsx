export const truncateText = (str: string, n: number) =>
  str.length > n ? `${str.trim().substring(0, n)}...` : `${str.trim()}`;

export const capitalize = (s: string = "") =>
  s.length >= 1 ? s.charAt(0).toUpperCase() + s.slice(1) : "";

export const formatJoinedText = (
  str: string,
  separator: string | RegExp = "-",
) => {
  return str
    .split(separator)
    .map((word) => capitalize(word))
    .join(" ");
};

export const addSuffixes = (
  length: number,
  suffixes: string = "s",
  alt?: string,
) => (length > 1 ? suffixes : (alt ?? ""));

export interface QueryTextProps {
  isEdit?: boolean;
  isDelete?: boolean;
}

export const successText = ({ isDelete, isEdit }: QueryTextProps) =>
  `${isDelete ? "deleted" : isEdit ? "edited" : "created"} successfully`;

export const errorText = ({ isDelete, isEdit }: QueryTextProps) =>
  `Failed to ${isDelete ? "delete" : isEdit ? "edit" : "create new"}`;

export const joinFirstNameAndLastName = (
  first_name?: string | null,
  last_name?: string | null,
) => `${returnPlaceHolderTxt(first_name)} ${returnPlaceHolderTxt(last_name)}`;

export const returnPlaceHolderTxt = (
  text?: string | number | null,
  placeholder?: string,
) => text ?? placeholder ?? "-";
