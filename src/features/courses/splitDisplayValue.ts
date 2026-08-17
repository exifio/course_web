export interface SplitDisplayValueResult {
  value: string;
  helper?: string;
}

/**
 * Splits `Primary (Helper)` display strings when the pattern is unambiguous.
 * Otherwise returns the full string as value.
 */
export function splitDisplayValue(raw: string): SplitDisplayValueResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { value: trimmed };
  }

  const match = trimmed.match(/^(.+?)\s+\((.+)\)$/);
  if (!match) {
    return { value: trimmed };
  }

  const value = match[1].trim();
  const helper = match[2].trim();

  if (!value || !helper) {
    return { value: trimmed };
  }

  return { value, helper };
}
