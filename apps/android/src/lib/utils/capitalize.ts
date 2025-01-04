export const capitalize = (value: string) => {
  return value.replace(/\b\w/g, (char) => char.toUpperCase())
}
