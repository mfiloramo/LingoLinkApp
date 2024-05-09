// UTILITY FUNCTIONS FOR FORMATTING RENDERED STRINGS
export function stringFormatterSnakeToNameCase(str: string): string {
  return str.replace(/[-_]/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export function stringFormatterCamelToNameCase(str: string): string {
  str = str.replace(/([A-Z])/g, ' $1').trim();
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

