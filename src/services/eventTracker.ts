export interface DirectionsClickEvent {
  name: 'directions_click';
  courseId: string;
  occurredAt: string;
}

const KEY = 'running-course:events:v1';

function isDirectionsClickEvent(value: unknown): value is DirectionsClickEvent {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    record.name === 'directions_click' &&
    typeof record.courseId === 'string' &&
    typeof record.occurredAt === 'string'
  );
}

export function readEvents(): DirectionsClickEvent[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(value) ? value.filter(isDirectionsClickEvent) : [];
  } catch {
    return [];
  }
}

export function trackDirectionsClick(courseId: string): void {
  const next = [
    ...readEvents(),
    {
      name: 'directions_click' as const,
      courseId,
      occurredAt: new Date().toISOString(),
    },
  ].slice(-100);
  localStorage.setItem(KEY, JSON.stringify(next));
}
