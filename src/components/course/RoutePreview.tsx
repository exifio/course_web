import type { Course } from '../../domain/course';
import { getCourseImageUrl } from '../../utils/courseImage';
import ImageWithFallback from '../ui/ImageWithFallback';
import styles from './RoutePreview.module.css';

interface RoutePreviewProps {
  course: Course;
}

export default function RoutePreview({ course }: RoutePreviewProps) {
  return (
    <div className={styles.wrapper}>
      <ImageWithFallback
        src={getCourseImageUrl(course.routeImageKey)}
        alt={`${course.name} 경로 이미지`}
        className={styles.image}
      />
    </div>
  );
}
