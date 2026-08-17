export function toggleSavedCourseId(ids: string[], courseId: string): string[] {
  return ids.includes(courseId)
    ? ids.filter((id) => id !== courseId)
    : [...ids, courseId];
}
