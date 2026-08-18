export const TAG_LABELS = {
  'night-safe': '야간안심',
  flat: '평지',
  beginner: '초보추천',
  riverside: '수변',
  park: '공원',
  forest: '숲',
  city: '도심',
  'long-run': '장거리',
  refresh: '리프레시',
} as const;

export function getTagLabel(tag: string): string {
  return TAG_LABELS[tag as keyof typeof TAG_LABELS] ?? tag.replace(/^#/, '');
}
