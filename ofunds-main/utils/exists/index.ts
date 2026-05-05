export function exists(value: any, empty?: boolean): boolean {
  let check =
    value != null &&
    value != undefined &&
    value != "null" &&
    value != "undefined";

  if (!check) return false;

  if (empty) {
    check = value.length > 0;
  }
  return check;
}
