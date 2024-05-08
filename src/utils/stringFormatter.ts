// FORMAT STRING WITH HYPHENS AND LOWERCASE TO CAPITALS FIRST LETTERS AND NO HYPHENS
export function stringFormatter(str: string): string {
  return str.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}
