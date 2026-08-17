import { useCallback, useState } from 'react';
import { courses } from '../data/courses';
import type { Course } from '../domain/course';
import {
  readSavedCourseIds,
  writeSavedCourseIds,
} from '../utils/savedCoursesStorage';

export interface UseSavedCoursesResult {
  savedCourseIds: string[];
  savedCourses: Course[];
  isSaved: (courseId: string) => boolean;
  saveCourse: (courseId: string) => void;
  removeCourse: (courseId: string) => void;
  toggleCourse: (courseId: string) => boolean;
}

export function useSavedCourses(): UseSavedCoursesResult {
  const [savedCourseIds, setSavedCourseIds] = useState<string[]>(() =>
    readSavedCourseIds(),
  );

  const commit = useCallback((nextIds: string[]) => {
    const uniqueIds = [...new Set(nextIds.filter((id) => typeof id === 'string'))];
    writeSavedCourseIds(uniqueIds);
    setSavedCourseIds(uniqueIds);
  }, []);

  const saveCourse = useCallback(
    (courseId: string) => {
      if (savedCourseIds.includes(courseId)) return;
      commit([...savedCourseIds, courseId]);
    },
    [commit, savedCourseIds],
  );

  const removeCourse = useCallback(
    (courseId: string) => {
      commit(savedCourseIds.filter((id) => id !== courseId));
    },
    [commit, savedCourseIds],
  );

  const toggleCourse = useCallback(
    (courseId: string): boolean => {
      const nextSaved = !savedCourseIds.includes(courseId);
      const nextIds = nextSaved
        ? [...savedCourseIds, courseId]
        : savedCourseIds.filter((id) => id !== courseId);
      commit(nextIds);
      return nextSaved;
    },
    [commit, savedCourseIds],
  );

  const isSaved = useCallback(
    (courseId: string) => savedCourseIds.includes(courseId),
    [savedCourseIds],
  );

  const savedCourses = courses.filter((course) =>
    savedCourseIds.includes(course.id),
  );

  return {
    savedCourseIds,
    savedCourses,
    isSaved,
    saveCourse,
    removeCourse,
    toggleCourse,
  };
}
