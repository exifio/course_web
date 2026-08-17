export type Availability = 'available' | 'unavailable' | 'unknown';
export type LightingLevel = 'good' | 'moderate' | 'limited' | 'unknown';
export type PeopleLevel = 'high' | 'medium' | 'low' | 'unknown';
export type RoadSeparation = 'full' | 'partial' | 'none' | 'unknown';
export type SlopeLevel = 'flat' | 'gentle' | 'hilly' | 'unknown';
export type StairsLevel = 'none' | 'some' | 'unknown';
export type CourseDifficulty = '쉬움' | '보통' | '어려움' | 'easy' | 'moderate' | 'hard';

export type CourseTag =
  | string
  | 'night-safe'
  | 'flat'
  | 'beginner'
  | 'riverside'
  | 'park'
  | 'forest'
  | 'city'
  | 'long-run'
  | 'refresh';

export interface Course {
  id: string;
  name: string;
  summary: string;
  description?: string;
  region?: '의정부시';
  distanceKm: number;
  durationMin: number;
  estimatedMinutes?: number;
  difficulty: CourseDifficulty;
  tags: string[];
  categories: string[];
  image: string;
  routeImage: string;
  heroImageKey?: string;
  routeImageKey?: string;
  location?: {
    latitude: number | null;
    longitude: number | null;
  };
  safety: {
    lighting: string;
    cctv: string;
    footTraffic?: string;
    pedestrianTraffic?: PeopleLevel | string;
    roadSeparation: string;
  };
  surface: {
    primary?: string;
    type?: string;
    slope: string;
    stairs: string;
  };
  facilities: {
    toilets?: string;
    restroom?: Availability | string;
    convenienceStores?: string;
    convenienceStore?: Availability | string;
    waterFountains?: string;
    waterFountain?: Availability | string;
    lockers?: string;
    locker?: Availability | string;
  };
  atmosphere: string | {
    keywords: string[];
    description: string;
  };
}
