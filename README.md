# RunRoute — 의정부 러닝 코스 탐색 MVP

RunRoute는 의정부 지역 러너가 새로운 러닝 코스를 빠르게 탐색하고, 안전성·노면·편의시설·분위기 정보를 확인한 뒤 **코스를 저장**하거나 **길찾기 이용 의향**을 표현할 수 있는 Sprint 6 프론트엔드 MVP입니다.

## 핵심 사용자 문제

- 러너는 어떤 코스가 안전하고 어떤 노면·편의시설을 갖췄는지 한눈에 파악하기 어렵습니다.
- 여러 코스를 비교하며 마음에 드는 코스를 빠르게 저장해두고 싶어 합니다.
- 실제 길찾기 안내가 제공되기 전에도, 이용자가 이 기능을 원하는지 검증해야 합니다.

## 핵심 기능

- **추천 코스 탐색 / 필터** — 오늘의 추천 코스와 추천 코스 목록, 카테고리(안전성·노면·편의시설·분위기) Chip 필터
- **코스 상세** — 거리·소요시간·난이도, 안전성 / 노면 상태 / 편의시설 / 분위기 정보, 미디어 캐러셀
- **저장 / 해제 및 저장한 코스(Saved)** — SaveControl 토글 + Toast 안내 + 저장 목록 그리드
- **길찾기 안내 Modal** — 현재 MVP에서는 길찾기 기능을 준비 중임을 안내하고 이용 의향을 검증
- **Empty / Error / Skeleton UX** — 저장 목록 Empty, 잘못된 코스 id Error, 로딩 Skeleton
- **localStorage 기반 데모 로그인(Modal)** — 헤더의 로그인 버튼으로 로그인 모달을 열어 `runroute:auth-session` 세션을 기록

## 기술 스택

- React 19, TypeScript
- Vite (프론트엔드 빌드 / 개발 서버)
- React Router v7 (SPA 라우팅)
- CSS Modules (+ 전역 CSS 변수 토큰)
- Vitest + React Testing Library (jsdom, 테스트)
- localStorage (브라우저 저장소)

> 실제 Backend, Database, Mock Server, 실제 API는 사용하지 않습니다. 코스 데이터는 클라이언트에 포함된 샘플(mock) 데이터입니다.

## 프로젝트 실행 방법

```bash
npm install
npm run dev        # 개발 서버 실행 (기본 포트 5173)
npm test           # 테스트 실행 (Vitest)
npm run build      # 프로덕션 빌드 (dist/)
npm run preview    # 빌드 결과 미리보기 (production build 확인)
```

## 주요 Routes

| Route | 페이지 | 설명 |
| --- | --- | --- |
| `/` | HomePage | 추천 코스 탐색 및 카테고리 필터 |
| `/courses/:courseId` | CourseDetailPage | 코스 상세 정보, 저장, 길찾기 안내 |
| `/saved` | SavedCoursesPage | 저장한 코스 목록 (Empty State 포함) |
| 그 외 경로 | NotFoundPage | 404 처리 |

## localStorage 사용 항목

| 키 | 용도 |
| --- | --- |
| `runroute:saved-course-ids` | 저장한 코스 id 배열. 기존 `runway:saved-course-ids` 값이 있으면 자동으로 마이그레이션합니다. |
| `runroute:auth-session` | 데모 로그인 세션 `{ email, signedInAt }`. 비밀번호는 저장하지 않습니다. |

## 데모 로그인 (MVP 인증 상태 시뮬레이션)

- 헤더의 **로그인** 버튼을 누르면 로그인 모달이 열립니다.
- 이메일과 비밀번호를 입력하면 세션(`runroute:auth-session`)만 브라우저 localStorage에 기록되는 **MVP 인증 상태 시뮬레이션**입니다.
- 실제 인증/회원가입/비밀번호 검증/토큰 발급/계정 동기화는 **구현하지 않습니다.** 비밀번호는 어디에도 저장·전송되지 않습니다.
- 새로고침 후에도 로그인 상태가 유지되며, 로그아웃 시 세션만 제거됩니다.
- **비로그인 상태에서도** 홈·상세·저장·길찾기 등 모든 핵심 기능을 동일하게 이용할 수 있습니다. 저장 데이터는 로그인 여부와 독립적으로 유지됩니다.

## MVP 범위

- 의정부시 6개 러닝 코스 샘플 데이터(`src/data/courses.ts`)
- 코스 탐색/필터, 상세, 저장/해제 + Saved, 길찾기 의향 안내, 데모 로그인(모달)
- Empty / Error / Skeleton 경계 및 반응형 UI

## 의도적으로 제외한 기능

- Backend / DB / API / Mock Server
- 실제 지도 및 길찾기 연동
- 실제 인증 / 회원가입 / 계정별 저장 동기화
- 코스 등록 / 수정 / 관리

## 반응형 기준

- 홈 그리드: 3열 → 2열(1200px 이하) → 1열(768px 이하)
- Saved 그리드: 3열 → 2열(1024px 이하) → 1열(768px 이하)
- Featured 카드: 1024px 이상에서 좌우 2단(58/42) 레이아웃
- QA 폭: 1440px / 1280px / 768px / 390px

## 테스트 / 품질 검증 방법

```bash
npm test      # 30개 테스트 파일 / 179개 테스트 PASS
npm run build # 프로덕션 빌드 PASS
npm run preview
```

- 테스트: Vitest + React Testing Library(jsdom)로 핵심 기능과 회귀 검증
- 수동 QA: 라우터 직접 접근/뒤로가기, 저장/해제, 데모 로그인/새로고침/로그아웃, 길찾기 Modal, Error/Empty/Skeleton, 반응형, 콘솔 에러·에셋 404 확인
