# RunRoute Design System

실제 구현(`src/styles/tokens.css`, 각 `*.module.css`)을 기준으로 작성한 디자인 시스템 문서입니다. 문서상 규칙이 아닌 **현재 코드의 CSS 변수 토큰과 컴포넌트 구현**을 기준으로 합니다.

## 디자인 원칙

- **Desktop 중심 Responsive Web** — 데스크톱(1200px 콘텐츠 폭)을 기준으로 하고 767px 이하에서 단일 컬럼/하단 시트(bottom sheet) 모달로 전환합니다.
- **토큰 재사용** — 색·타이포·간격·반경·그림자를 전역 CSS 변수(`:root`)로 정의하고 컴포넌트가 이를 참조합니다.
- **정보 우선** — 안전성·노면·편의시설·분위기 정보를 카드/섹션으로 명확히 노출합니다.
- **재디자인 금지** — 확정된 UI 구조를 바꾸지 않습니다.

## 색상 토큰 (`src/styles/tokens.css`)

**Primary(브랜드)** — `--primary-50 #EDF2FA` … `--primary-500 #4F7DD4`(기본) … `--primary-900 #203459`

> 50: `#EDF2FA`, 100: `#C7D6F1`, 200: `#ADC3EA`, 300: `#87A8E2`, 400: `#7097DC`, 500: `#4F7DD4`, 600: `#4872C1`, 700: `#385896`, 800: `#2B4474`, 900: `#203459`

**Neutral / Gray** — `--white #FFFFFF`, `--gray-25 #FCFCFD`, `--gray-50 #F7F9FC`, `--gray-100 #F1F4F8`, `--gray-200 #E4E9F0`, `--gray-300 #D2D9E3`, `--gray-400 #98A2B3`, `--gray-500 #667085`, `--gray-600 #475467`, `--gray-700 #344054`, `--gray-800 #1D2939`, `--gray-900 #101828`

**Accent(포인트)** — `--color-accent-500 #E5FE65` 계열

**상태 색상** — Success `#2F8A52` / `--success-bg #EEF8F1`, Warning `#B7791F` / `#FFF8E8`, Danger `#C94B4B` / `#FFF1F1`

**의미 토큰** — `--page-bg #F7F9FC`, `--surface #FFFFFF`, `--border #E4E9F0`, `--text-primary #101828`, `--text-secondary #475467`

## Typography

font-family: `'Pretendard Variable'` + 시스템 폰트 폴백

| 토큰 | size / line-height / weight |
| --- | --- |
| display | 36px / 44px / 700 |
| h1 | 32px / 40px / 700 |
| h2 | 24px / 32px / 700 |
| h3 | 20px / 28px / 600 |
| body | 16px / 24px / 400 |
| body-s | 14px / 20px / 400 |
| label | 14px / 20px / 600 |
| caption | 12px / 18px / 400 |

## Spacing / Radius / Shadow

**Spacing** — `--space-4/8/12/16/20/24/32/40/48/64/80` (4px 간격 스케일)

**Radius** — `--radius-sm 8px`, `--radius-md 12px`, `--radius-lg 16px`, `--radius-xl 24px`, `--radius-pill 999px`, `--radius-button 12px`, `--radius-card 16px`, `--radius-modal/toast/control 12~16px`

**Shadow** — `--shadow-card 0 4px 16px rgba(16,24,40,.05)`, `--shadow-card-hover 0 8px 24px rgba(16,24,40,.08)`

## Content width / Grid / Breakpoints

- `--container-max` / `--content-max` = **1200px**
- `--page-gutter` 32px (768px 이하 20px), `--section-gap` 48px(40px), `--card-gap` 24px(16px), `--gnb-height` 72px
- 모션: `--motion-fast 150ms ease-out`, `--motion-normal 200ms ease-out`

**그리드 (column 전환)**
- 홈 `.grid`: 3열 → 2열(`≤1199px`) → 1열(`≤767px`)
- Saved `.grid`: 3열 → 2열(`≤1023px`) → 1열(`≤767px`)
- Featured(.link): `≥1024px`에서 좌우 2단 `58fr/42fr`

**Breakpoints 요약** — 1200(콘텐츠/그리드), 1199(홈 그리드·GNB·페이지 폭), 1024(Featured·캐러셀 2단), 1023(Saved·상세 2단), 768(tokens gutter), 767(모바일 단일/하단 시트)

## Component

### Button (`ui/Button`)
- variants: `primary`, `secondary`, `ghost`; size: `sm|md|lg|default|cta` (`cta`/`lg`는 전폭 CTA 스타일)
- 기본 `type="button"`, min-height 44px, `--radius-button`

### Chip (`ui/Chip`) — 카테고리/필터
- `selected` 상태에 따라 `aria-pressed` 토글, 선택 시 primary 강조

### Tag (`ui/Tag`)
- variants: `default`, `accent`, `brand`(상세 페이지 상단 특성 태그)

### CourseCard (`features/courses/CourseCard.tsx`) — 표준 코스 카드
- canonical 구현이며 Home/Saved가 공유. 이미지 + 제목 + 거리/시간 + 상위 3개 태그
- SaveControl을 우상단에 오버레이 (props: `course`, `isSaved`, `onToggleSaved`)

### FeaturedCourseCard (`components/course/FeaturedCourseCard.tsx`)
- 홈의 "오늘의 추천 코스" 큰 카드. `≥1024px` 좌우 2단, `CourseMetrics` 포함

### SaveControl (`ui/SaveControl`)
- 북마크 토글 버튼. 저장 시 `aria-pressed` + filled 아이콘, `aria-label`에 코스명과 함께 저장/해제 명시

### Metric (`ui/Metric`) — 거리/시간/난이도 등 라벨-값 표시

### Toast (`feedback/Toast.tsx`)
- variants: `saved`(저장됨) / `unsaved`(해제됨). `role="status"`+`aria-live="polite"`, 기본 3500ms 자동 닫힘. 저장 시 "저장한 코스 보기" 액션 제공

### Modal (`ui/Modal.tsx`) — 범용 다이얼로그
- `role="dialog"`+`aria-modal`, ESC 닫기, Tab 트랩, 오버레이 클릭 닫기, `body overflow hidden`
- `≤767px`에서 하단 시트(bottom sheet)로 전환

### DirectionsModal (`feedback/DirectionsModal.tsx`)
- 길찾기 이용 의향 안내 다이얼로그. ESC/닫기/오버레이로 닫히고 백드롭 시 중심 정렬

### Login Modal (`auth/LoginModal.tsx`) + AuthMenu (`auth/AuthMenu.tsx`)
- **LoginModal**: 헤더 로그인 버튼으로 여는 전역 모달. 이메일/비밀번호 입력, "MVP 데모 로그인" 안내 문구, 백드롭/ESC 닫기, 입력값 없으면 에러 문구
- **AuthMenu**: 비로그인 시 `로그인` 버튼, 로그인 시 `email + 로그아웃` 버튼. GNB 우측에 배치되며 중앙 nav 정렬을 깨지 않게 `1fr auto 1fr` 그리드 활용

### Empty / Error / Skeleton
- **EmptyState**(`ui/EmptyState`): 저장 목록이 비었을 때. Error red를 쓰지 않고 primary 계열 아이콘 + "추천 코스 보러가기" CTA
- **Error**(상세 페이지 `CourseDetailPage`): 잘못된 코스 id일 때 `role="alert"` + "코스 정보를 찾을 수 없습니다." + 홈 복귀 CTA
- **Skeleton**: `CourseDetailSkeleton`, `CourseGridSkeleton(count)`, `FeaturedCourseSkeleton` — 로딩 중 `aria-busy`로 스켈레톤 표시

### ImageWithFallback (`ui/ImageWithFallback`)
- 이미지 `onError` 시 "코스 이미지 준비 중" fallback 박스로 대체, `loading="lazy"`

### MockDataNotice (`ui/MockDataNotice`)
- 샘플 데이터 안내 배너. 홈/상세에 노출, "실제 거리·경로·시설·안전 상태와 다를 수 있음" 안내

## Focus / Keyboard / Accessibility

- Modal 계열은 포커스 트랩, ESC/오버레이 닫기, 열림 시 내부 포커스 이동·닫힘 후 이전 포커스 복원
- SaveControl / Chip / 로그인·로그아웃 버튼은 `aria-pressed`/명확한 `aria-label`
- Toast는 `role="status"` / `aria-live="polite"`
- 오류는 `role="alert"`, 보조 텍스트 `aria-label` 제공

## 이미지 / Fallback 규칙

- 모든 코스 이미지는 `ImageWithFallback`을 통해 로드하고, 실패 시 대체 박스 표시
- 이미지 소스: `course.image` 또는 `heroImageKey` 기반 `getCourseImageUrl()`

## 화면별 레이아웃

- **Home** — 인트로(위치·헤딩) → 오늘의 추천 코스(Featured) → 다른 추천 코스(필터 Chip + 3/2/1열 그리드) → MockDataNotice
- **Detail** — Hero(이름·요약·특성 태그, 거리/시간/난이도 Metric) + 미디어 캐러셀 + 길찾기/저장 액션 → 안전성·노면·편의시설·분위기 Info Grid → MockDataNotice
- **Saved** — 제목 + 저장 수 → 3/2/1열 카드 그리드(빈 경우 EmptyState) → Toast
- **Login** — 전역 **모달**(별도 페이지 아님): 백드롭 + 이메일/비밀번호 폼 + 데모 로그인 안내

## 확정된 제품 UI 결정

- **서비스명은 RunRoute**입니다. `RUNWAY`로 되돌리지 않습니다.
- **분위기 카드 유지** — 현재는 텍스트 중심이지만, 향후 사진이 추가될 수 있는 독립 카드 구조를 보존합니다.
- **Saved 카드 Grid 유지** — Saved는 카드형 Grid(3→2→1열)를 유지하며 1-column horizontal list로 되돌리지 않습니다.
