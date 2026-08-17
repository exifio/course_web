export interface EventLogEntry {
  name: string;
  payload: Record<string, unknown>;
  occurredAt: string;
}

export function logEvent(name: string, payload: Record<string, unknown> = {}): EventLogEntry {
  const entry: EventLogEntry = {
    name,
    payload,
    occurredAt: new Date().toISOString(),
  };

  console.info('[RunRoute event]', entry);
  return entry;
}
