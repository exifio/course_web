import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCourseById } from '../data/courses';
import type {
  Availability,
  CourseDifficulty,
  PeopleLevel,
} from '../domain/course';
import { useSavedCourses } from '../features/saved/useSavedCourses';
import { logEvent } from '../lib/eventLogger';
import CourseInfoSection from '../features/courses/CourseInfoSection';
import CourseMediaCarousel from '../components/course/CourseMediaCarousel';
import CourseDetailSkeleton from '../components/course/CourseDetailSkeleton';
import Button from '../components/ui/Button';
import Metric from '../components/ui/Metric';
import Tag from '../components/ui/Tag';
import DirectionsModal from '../components/feedback/DirectionsModal';
import Toast, { type ToastVariant } from '../components/feedback/Toast';
import MockDataNotice from '../components/ui/MockDataNotice';
import {
  ShieldIcon,
  RoadIcon,
  StoreIcon,
  LeafIcon,
  LightbulbIcon,
  CameraIcon,
  UsersIcon,
  SplitIcon,
  LayersIcon,
  TrendingUpIcon,
  StairsIcon,
  RestroomIcon,
  WaterFountainIcon,
  LockerIcon,
} from '../components/ui/Icons';
import styles from './CourseDetailPage.module.css';

const difficultyLabel: Record<CourseDifficulty, string> = {
  easy: '쉬움',
  moderate: '보통',
  hard: '어려움',
  쉬움: '쉬움',
  보통: '보통',
  어려움: '어려움',
};

const availabilityLabel: Record<Availability, string> = {
  available: '있음',
  unavailable: '없음',
  unknown: '정보 없음',
};

const peopleLabel: Record<PeopleLevel, string> = {
  high: '많음',
  medium: '보통',
  low: '적음',
  unknown: '정보 없음',
};

const surfaceLabel: Record<string, string> = {
  asphalt: '아스팔트',
  urethane: '우레탄',
  mixed: '혼합',
  trail: '트레일',
  unknown: '정보 없음',
};

const TAG_LABELS: Record<string, string> = {
  'night-safe': '야간안심',
  flat: '평지',
  beginner: '초보추천',
  riverside: '수변',
  park: '공원',
  forest: '숲',
  city: '도심',
  'long-run': '장거리',
  refresh: '리프레시',
};

function displayTag(tag: string): string {
  if (TAG_LABELS[tag]) return TAG_LABELS[tag];
  return tag.replace(/^#/, '');
}

function displayAtmosphere(
  atmosphere: string | { keywords: string[]; description: string },
): string {
  return typeof atmosphere === 'string' ? atmosphere : atmosphere.description;
}

function displayPeople(safety: {
  pedestrianTraffic?: string | PeopleLevel;
  footTraffic?: string;
}): string {
  if (safety.footTraffic) {
    return safety.footTraffic;
  }

  const value = safety.pedestrianTraffic;
  if (value && typeof value === 'string' && value in peopleLabel) {
    return peopleLabel[value as PeopleLevel];
  }

  return (value as string | undefined) ?? '정보 없음';
}

function displaySurface(surface: { type?: string; primary?: string }): string {
  if (surface.primary) {
    return surface.primary;
  }

  if (surface.type && surface.type in surfaceLabel) {
    return surfaceLabel[surface.type];
  }

  return surface.type ?? '정보 없음';
}

function displayAvailability(
  value: Availability | string | undefined,
  fallback?: string,
): string {
  const isEmpty = (v: string | undefined) => !v || v === 'unknown';

  if (!isEmpty(fallback)) {
    return fallback as string;
  }

  if (value && typeof value === 'string') {
    if (value === 'unknown') return '정보 없음';
    if (value in availabilityLabel) {
      return availabilityLabel[value as Availability];
    }
    return value;
  }

  return '정보 없음';
}

interface CourseDetailPageProps {
  isLoading?: boolean;
}

export default function CourseDetailPage({ isLoading = false }: CourseDetailPageProps) {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const course = getCourseById(courseId);
  const saved = useSavedCourses();
  const navigate = useNavigate();
  const [navigationModalOpen, setNavigationModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastVariant | null>(null);

  if (isLoading) {
    return (
      <div className={styles.page} aria-busy="true">
        <CourseDetailSkeleton />
      </div>
    );
  }

  if (!course) {
    return (
      <div className={styles.page}>
        <section className={styles.errorState} role="alert">
          <h1 className={styles.errorTitle}>코스 정보를 찾을 수 없습니다.</h1>
          <p className={styles.errorDescription}>
            요청하신 코스가 존재하지 않거나 삭제되었습니다.
          </p>
          <Link to="/" className={styles.errorCta}>
            추천 코스로 돌아가기
          </Link>
        </section>
      </div>
    );
  }

  const isSaved = saved.isSaved(course.id);
  const uniqueTags = [...new Set(course.tags.map(displayTag))].slice(0, 4);

  function handleDirections() {
    logEvent('navigation_click', {
      courseId: course.id,
      courseName: course.name,
    });
    setNavigationModalOpen(true);
  }

  function handleSaveToggle() {
    const nextSaved = saved.toggleCourse(course.id);
    setToast(nextSaved ? 'saved' : 'unsaved');
  }

  return (
    <div className={styles.page}>
      <section
        className={styles.detailHeroSurface}
        data-testid="course-detail-hero"
      >
        <div className={styles.courseInfoPanel}>
          <div className={styles.heroIntroGroup}>
            <h1 className={styles.courseName}>{course.name}</h1>
            <p className={styles.summaryText}>{course.summary}</p>
            {uniqueTags.length > 0 && (
              <ul className={styles.tags} aria-label="코스 특징">
                {uniqueTags.map((tag) => (
                  <li key={tag} className={styles.tagItem}>
                    <Tag variant="brand">{tag}</Tag>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.metricsGroup}>
            <Metric
              label="거리"
              value={course.distanceKm}
              unit="km"
              className={styles.heroMetric}
            />
            <Metric
              label="예상 시간"
              value={course.durationMin ?? course.estimatedMinutes ?? 0}
              unit="분"
              className={styles.heroMetric}
            />
            <Metric
              label="난이도"
              value={difficultyLabel[course.difficulty] ?? course.difficulty}
              className={styles.heroMetric}
            />
          </div>
        </div>

        <div className={styles.routePanel} data-testid="course-detail-media">
          <CourseMediaCarousel course={course} />
          <div className={styles.actionRow} data-testid="course-detail-actions">
            <Button
              variant="primary"
              size="cta"
              className={styles.primaryAction}
              onClick={handleDirections}
            >
              길찾기
            </Button>
            <Button
              variant="secondary"
              size="cta"
              className={`${styles.saveAction} ${isSaved ? styles.savedState : ''}`}
              aria-pressed={isSaved}
              aria-label={isSaved ? '코스 저장 해제' : '코스 저장'}
              onClick={handleSaveToggle}
            >
              <svg
                className={styles.saveIcon}
                viewBox="0 0 24 24"
                fill={isSaved ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                data-bookmark-state={isSaved ? 'filled' : 'outline'}
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <span>저장</span>
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.infoGrid} aria-label="러닝 환경">
        <CourseInfoSection
          title="안전성"
          icon={<ShieldIcon />}
          items={[
            ['조명', course.safety.lighting, <LightbulbIcon />],
            ['CCTV', course.safety.cctv, <CameraIcon />],
            ['인적', displayPeople(course.safety), <UsersIcon />],
            ['차도 분리', course.safety.roadSeparation, <SplitIcon />],
          ]}
        />
        <CourseInfoSection
          title="노면 상태"
          icon={<RoadIcon />}
          items={[
            ['주요 노면', displaySurface(course.surface), <LayersIcon />],
            ['경사', course.surface.slope, <TrendingUpIcon />],
            ['계단', course.surface.stairs, <StairsIcon />],
          ]}
        />
        <CourseInfoSection
          title="편의시설"
          icon={<StoreIcon />}
          items={[
            [
              '화장실',
              displayAvailability(
                course.facilities.restroom,
                course.facilities.toilets,
              ),
              <RestroomIcon />,
            ],
            [
              '편의점',
              displayAvailability(
                course.facilities.convenienceStore,
                course.facilities.convenienceStores,
              ),
              <StoreIcon />,
            ],
            [
              '개수대',
              displayAvailability(
                course.facilities.waterFountain,
                course.facilities.waterFountains,
              ),
              <WaterFountainIcon />,
            ],
            [
              '보관함',
              displayAvailability(
                course.facilities.locker,
                course.facilities.lockers,
              ),
              <LockerIcon />,
            ],
          ]}
        />
        <CourseInfoSection
          title="분위기"
          icon={<LeafIcon />}
          description={displayAtmosphere(course.atmosphere)}
        />
      </section>

      <MockDataNotice />

      <DirectionsModal
        isOpen={navigationModalOpen}
        onClose={() => setNavigationModalOpen(false)}
      />
      <Toast
        variant={toast}
        onClose={() => setToast(null)}
        onViewSaved={() => navigate('/saved')}
      />
    </div>
  );
}
