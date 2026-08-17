import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import CourseInfoSection from './CourseInfoSection';

describe('CourseInfoSection', () => {
  test('Primary (Helper) 값을 분리해 표시한다', () => {
    render(
      <CourseInfoSection
        title="안전성"
        items={[['조명', '밝음 (가로등 연속 배치)']]}
      />,
    );

    expect(screen.getByText('밝음')).toBeInTheDocument();
    expect(screen.getByText('가로등 연속 배치')).toBeInTheDocument();
  });

  test('제목과 항목을 올바르게 렌더링한다', () => {
    render(
      <CourseInfoSection
        title="안전성"
        items={[
          ['조명', '좋음'],
          ['CCTV', '있음'],
          ['인적', '보통'],
          ['차도 분리', '완전 분리'],
        ]}
      />,
    );

    expect(screen.getByRole('heading', { name: '안전성' })).toBeInTheDocument();
    expect(screen.getByText('조명')).toBeInTheDocument();
    expect(screen.getByText('좋음')).toBeInTheDocument();
    expect(screen.getByText('CCTV')).toBeInTheDocument();
    expect(screen.getByText('있음')).toBeInTheDocument();
    expect(screen.getByText('인적')).toBeInTheDocument();
    expect(screen.getByText('보통')).toBeInTheDocument();
    expect(screen.getByText('차도 분리')).toBeInTheDocument();
    expect(screen.getByText('완전 분리')).toBeInTheDocument();
  });

  test('개별 값이 비어있거나 없으면 해당 항목만 "정보 없음"으로 표시한다', () => {
    render(
      <CourseInfoSection
        title="편의시설"
        items={[
          ['화장실', '있음'],
          ['보관함', undefined],
          ['개수대', ''],
        ]}
      />,
    );

    expect(screen.getByText('화장실')).toBeInTheDocument();
    expect(screen.getByText('있음')).toBeInTheDocument();
    expect(screen.getByText('보관함')).toBeInTheDocument();
    expect(screen.getAllByText('정보 없음')).toHaveLength(2);
  });

  test('태그와 설명이 있을 때 올바르게 렌더링한다', () => {
    render(
      <CourseInfoSection
        title="분위기"
        tags={['수변', '자연', '조용함']}
        description="자연 속에서 여유롭게 달릴 수 있는 분위기입니다."
      />,
    );

    expect(screen.getByRole('heading', { name: '분위기' })).toBeInTheDocument();
    expect(screen.getByText('수변')).toBeInTheDocument();
    expect(screen.getByText('자연')).toBeInTheDocument();
    expect(screen.getByText('조용함')).toBeInTheDocument();
    expect(
      screen.getByText('자연 속에서 여유롭게 달릴 수 있는 분위기입니다.'),
    ).toBeInTheDocument();
  });
});
