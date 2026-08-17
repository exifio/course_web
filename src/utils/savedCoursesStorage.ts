const LEGACY_STORAGE_KEY = 'runway:saved-course-ids';
export const STORAGE_KEY = 'runroute:saved-course-ids';

export function readSavedCourseIds(): string[] {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (raw) {
        localStorage.setItem(STORAGE_KEY, raw);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    }
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((id): id is string => typeof id === 'string'))];
  } catch {
    return [];
  }
}

export function writeSavedCourseIds(ids: string[]): void {
  const uniqueIds = [...new Set(ids.filter((id) => typeof id === 'string'))];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueIds));
}
