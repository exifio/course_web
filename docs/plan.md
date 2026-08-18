# RunRoute Sprint Mission 6 Finalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 RunRoute UI와 핵심 기능을 유지하면서 React 컴포넌트 구조의 명확한 중복만 정리하고, 서비스 이용을 막지 않는 localStorage 기반 로그인 시뮬레이션을 추가한 뒤 최종 QA, 문서화, GitHub Push, Vercel 배포까지 완료한다.

**Architecture:** 기존 React + Vite + TypeScript SPA, React Router, CSS Modules, React 기본 상태 관리, localStorage 구조를 유지한다. Phase 1에서는 현재 생산 코드가 사용하는 `src/features/courses/CourseCard.tsx`를 기준 컴포넌트로 확정하고 중복 카드와 중복 태그 라벨만 최소 정리한다. Phase 2에서는 실제 인증/서버 없이 React Context + localStorage로 로그인 상태만 시뮬레이션하며, 비로그인 사용자도 홈·상세·저장·길찾기를 모두 사용할 수 있게 유지한다. Phase 3 이후에는 기능 추가를 중단하고 회귀 QA → 최종 문서 → GitHub → Vercel 순으로 마무리한다.

**Tech Stack:** React, Vite, TypeScript, React Router, CSS Modules, Vitest, React Testing Library, localStorage, Git, GitHub, Vercel

**Spec:** Sprint Mission 6 요구사항 + 현재 RunRoute 구현 진단 결과. 별도 PRD/AGENTS 문서는 이번 최종 작업에서 재생성하지 않으며, 작업 중에는 이 `plan.md`와 `task.md`를 실행 기준으로 사용한다.

## Global Constraints

- 서비스명은 **RunRoute**로 고정한다. `RUNWAY`로 되돌리지 않는다.
- 현재 확인된 UI 구조를 재디자인하지 않는다.
- 분위기 카드는 유지한다. 현재는 텍스트 중심이지만 추후 사진이 추가될 수 있는 독립 카드 구조를 보존한다.
- Saved 화면의 현재 카드형 Grid 방향을 유지한다. 1-column horizontal list로 되돌리지 않는다.
- 기존 핵심 기능인 홈 탐색, 필터, 코스 상세, 저장/해제, 저장 목록, 길찾기 안내 Modal, Toast, Empty/Error/Skeleton 경계를 유지한다.
- Empty/Error/Loading은 이번 작업에서 새 기능으로 다시 만들지 않는다. 기존 구현과 테스트가 회귀하지 않는지만 검증한다.
- 실제 Backend, Database, Mock Server, 실제 API는 추가하지 않는다.
- 로그인은 **시뮬레이션**이다. 실제 계정 검증, 회원가입, 비밀번호 서버 전송, 토큰 발급, 계정별 저장 데이터 동기화는 구현하지 않는다.
- 로그인 여부와 관계없이 RunRoute의 기존 핵심 기능은 동일하게 사용할 수 있어야 한다. 보호 라우트는 만들지 않는다.
- 로그인 시 저장한 코스를 계정에 귀속시키지 않는다. 기존 Saved localStorage 구조를 그대로 유지한다.
- 비밀번호는 localStorage에 저장하지 않는다.
- 새 전역 상태 라이브러리(Redux, Zustand 등)를 설치하지 않는다. React Context와 기본 Hook만 사용한다.
- 기존 UI 컴포넌트와 CSS 토큰을 우선 재사용하고, 로그인 화면 때문에 전체 디자인 시스템을 변경하지 않는다.
- 기존 정상 기능을 불필요하게 리팩터링하지 않는다. 특히 `FeaturedCourseCard`, `DirectionsModal`, `CourseInfoSection`, `CourseMediaCarousel`은 이번 범위와 직접 관련이 없으면 그대로 유지한다.
- 각 Phase의 코드 변경 후 최소 `npm test`와 `npm run build`를 실행한다.
- 최종 완료 판정 전 `npm test`, `npm run build`, `npm run preview`와 수동 QA를 모두 수행한다.
- `plan.md`, `task.md`는 이번 작업 관리용 임시 문서다. Phase 4 Git 커밋에는 포함하지 않고 로컬 작업 기준으로만 사용할 수 있다.

---

## Planned File Structure

현재 코드 구조를 최대한 유지하며 필요한 파일만 추가/수정한다.

```text
src/
├─ app/
│  └─ App.tsx                         # /login 라우트 + AuthProvider 연결
├─ components/
│  ├─ auth/
│  │  └─ AuthMenu.tsx                 # Header 우측 로그인 상태 UI
│  ├─ course/
│  │  └─ FeaturedCourseCard.tsx       # 유지, tagLabels import만 가능
│  ├─ feedback/
│  │  ├─ DirectionsModal.tsx          # 원칙적으로 유지
│  │  └─ Toast.tsx                    # 유지
│  └─ ui/
│     ├─ Button.tsx
│     ├─ Tag.tsx
│     └─ ...
├─ features/
│  ├─ auth/
│  │  ├─ authSession.ts               # localStorage 직렬화/복구
│  │  ├─ authSession.test.ts
│  │  ├─ AuthContext.tsx              # 로그인 상태 Provider + Hook
│  │  └─ AuthContext.test.tsx
│  └─ courses/
│     ├─ CourseCard.tsx               # canonical CourseCard
│     └─ tagLabels.ts                  # TAG_LABELS 단일 기준
├─ pages/
│  ├─ HomePage.tsx
│  ├─ CourseDetailPage.tsx
│  ├─ SavedCoursesPage.tsx
│  ├─ SavedPage.tsx
│  ├─ LoginPage.tsx                   # 신규
│  ├─ LoginPage.module.css            # 신규
│  └─ LoginPage.test.tsx              # 신규
├─ services/
│  └─ storage.ts                      # 기존 Saved storage는 유지
└─ ...

README.md                              # Phase 4에서 최종 작성
design-system.md                       # Phase 4에서 실제 구현 기준으로 최종 작성
vercel.json                            # Phase 5에서 SPA rewrite 확인/추가
```

> Header/AppHeader의 정확한 파일 경로는 현재 진단 보고서에 경로가 기록되지 않았으므로 Phase 2 시작 시 아래 명령으로 생산 코드의 실제 GNB 파일을 확정한다.
>
> ```bash
> rg -n "AppHeader|Header|GNB|저장한 코스|홈" src
> ```
>
> 검색 결과 중 `App.tsx` 또는 공통 Layout에서 실제 import되는 Header만 수정한다. 사용되지 않는 래퍼까지 함께 정리하지 않는다.

---

# Phase 1 — React 컴포넌트 구조 최소 정리

## Task 1: CourseCard 중복 제거와 Tag Label 단일화

**Goal:** 이미 충족된 페이지 분리/props 재사용 구조는 유지하고, 현재 진단에서 명확히 확인된 중복 `CourseCard`와 `TAG_LABELS`만 정리한다.

**Files:**
- Keep/Modify: `src/features/courses/CourseCard.tsx`
- Delete after import verification: `src/components/course/CourseCard.tsx`
- Delete or migrate: `src/components/course/CourseCard.test.tsx`가 존재하면 canonical 카드 테스트로 이동
- Create: `src/features/courses/tagLabels.ts`
- Modify: `src/components/course/FeaturedCourseCard.tsx`
- Modify: `src/pages/CourseDetailPage.tsx`
- Modify: `src/features/courses/CourseInfoSection.tsx`에서 TAG label map을 별도로 갖고 있다면 import로 교체
- Test: 기존 Home/Saved/CourseCard 관련 테스트

**Interfaces:**
- Canonical card: `src/features/courses/CourseCard.tsx`
- Produces: `TAG_LABELS`, 필요 시 `getTagLabel(tag)`
- Preserves: `course`, `isSaved`, `onToggleSaved` props 계약

- [ ] **Step 1: 변경 전 기준선을 기록한다.**

```bash
git status --short
npm test
npm run build
```

Expected: 현재 기준 테스트/빌드 결과를 기록한다. 실패가 있으면 Phase 1 변경과 분리해서 먼저 원인을 확인한다.

- [ ] **Step 2: 두 CourseCard의 실제 import 관계를 재확인한다.**

```bash
rg -n "features/courses/CourseCard|components/course/CourseCard|from ['\"].*CourseCard" src
```

Expected: Home과 Saved 생산 코드는 `src/features/courses/CourseCard.tsx`를 사용하고, `src/components/course/CourseCard.tsx`는 생산 코드에서 사용되지 않는 상태를 확인한다.

- [ ] **Step 3: canonical CourseCard의 회귀 테스트를 먼저 보강한다.**

기존 테스트에 아래 동작이 없으면 `src/features/courses/CourseCard.test.tsx`를 추가하거나 기존 테스트에 포함한다.

```tsx
it('코스 데이터와 저장 상태를 props로 렌더링한다', () => {
  // 현재 프로젝트의 실제 Course fixture를 사용한다.
  // 코스명, 거리/시간, 저장 버튼 accessible name을 검증한다.
});

it('저장 버튼 클릭 시 onToggleSaved를 호출한다', async () => {
  // userEvent로 저장 버튼을 클릭하고 callback 1회 호출을 검증한다.
});
```

- [ ] **Step 4: 중복 CourseCard를 제거한다.**

`src/components/course/CourseCard.tsx`가 생산 import가 없는 것을 Step 2에서 확인했으면 삭제한다. 해당 파일 전용 테스트가 있다면 canonical `src/features/courses/CourseCard.tsx` 테스트로 필요한 assertion만 이동한 뒤 중복 테스트 파일도 제거한다.

- [ ] **Step 5: TAG_LABELS를 한 파일로 이동한다.**

`src/features/courses/tagLabels.ts`를 생성한다.

```ts
export const TAG_LABELS = {
  // 현재 프로젝트에 이미 존재하는 key/value를 그대로 이동한다.
} as const;

export function getTagLabel(tag: string): string {
  return TAG_LABELS[tag as keyof typeof TAG_LABELS] ?? tag;
}
```

새 라벨을 임의로 만들지 말고 기존 `CourseCard`, `FeaturedCourseCard`, `CourseDetailPage`의 실제 맵을 합쳐 동일 key의 기존 표시 문구를 보존한다.

- [ ] **Step 6: 중복 선언을 import로 교체한다.**

최소 아래 파일에서 로컬 `TAG_LABELS` 선언을 제거하고 `getTagLabel` 또는 `TAG_LABELS`를 import한다.

```text
src/features/courses/CourseCard.tsx
src/components/course/FeaturedCourseCard.tsx
src/pages/CourseDetailPage.tsx
```

`CourseInfoSection.tsx`에도 동일 매핑이 있다면 같은 방식으로 교체한다.

- [ ] **Step 7: Tag 컴포넌트/Modal을 과도하게 리팩터링하지 않는다.**

현재 CSS가 서로 다른 카드 용도에 맞춰 직접 `<span>`을 쓰고 있다면 UI가 바뀌지 않도록 유지한다. `FeaturedCourseCard`를 일반 `CourseCard`와 합치지 않는다. `DirectionsModal`을 공통 `Modal` 기반으로 재작성하는 작업도 이번 Task에서 하지 않는다.

- [ ] **Step 8: Phase 1 검증을 실행한다.**

```bash
npm test
npm run build
```

Expected: 모든 기존 테스트와 canonical CourseCard 테스트 PASS, production build 성공.

- [ ] **Step 9: 변경 diff를 확인한다.**

```bash
git diff -- src/features/courses src/components/course src/pages/CourseDetailPage.tsx
```

Expected: UI 기능 변경이 아니라 중복 제거/라벨 단일화 중심의 diff만 존재한다.

- [ ] **Step 10: 커밋한다.**

```bash
git add src/features/courses src/components/course src/pages/CourseDetailPage.tsx

git commit -m "refactor: consolidate reusable course components"
```

**Task 1 완료 기준:**
- Home/Saved는 여전히 동일한 canonical CourseCard를 사용한다.
- 중복 CourseCard 생산 구현이 하나로 정리된다.
- TAG label source가 한 곳으로 정리된다.
- Featured card, 상세, Saved UI가 시각적으로 바뀌지 않는다.
- 전체 테스트와 build가 통과한다.

---

# Phase 2 — localStorage 기반 로그인 시뮬레이션

## Task 2: Auth Session 저장 계층과 React Context 구현

**Goal:** 실제 서버 인증 없이 로그인 상태를 localStorage에 저장하고 앱 전체에서 읽고 로그아웃할 수 있는 최소 인증 상태 계층을 만든다.

**Files:**
- Create: `src/features/auth/authSession.ts`
- Create: `src/features/auth/authSession.test.ts`
- Create: `src/features/auth/AuthContext.tsx`
- Create: `src/features/auth/AuthContext.test.tsx`
- Modify: `src/app/App.tsx` 또는 `src/main.tsx` 중 현재 Provider 배치 패턴에 맞는 한 곳

**Interfaces:**

```ts
export interface AuthSession {
  email: string;
  signedInAt: string;
}

export const AUTH_SESSION_KEY = 'runroute:auth-session';
export function readAuthSession(): AuthSession | null;
export function writeAuthSession(session: AuthSession): void;
export function clearAuthSession(): void;
```

```ts
interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}
```

- [ ] **Step 1: authSession 실패 테스트를 먼저 작성한다.**

```ts
beforeEach(() => localStorage.clear());

it('세션을 localStorage에 저장하고 다시 읽는다', () => {
  const session = { email: 'runner@example.com', signedInAt: '2026-08-18T00:00:00.000Z' };
  writeAuthSession(session);
  expect(readAuthSession()).toEqual(session);
});

it('손상된 세션은 null로 복구한다', () => {
  localStorage.setItem(AUTH_SESSION_KEY, '{broken');
  expect(readAuthSession()).toBeNull();
});

it('비밀번호는 저장 모델에 포함하지 않는다', () => {
  const session = { email: 'runner@example.com', signedInAt: '2026-08-18T00:00:00.000Z' };
  writeAuthSession(session);
  expect(localStorage.getItem(AUTH_SESSION_KEY)).not.toContain('password');
});
```

- [ ] **Step 2: 테스트가 실패하는지 확인한다.**

```bash
npm test -- authSession
```

Expected: authSession 미구현으로 FAIL.

- [ ] **Step 3: 최소 storage 구현을 작성한다.**

`readAuthSession()`은 JSON parse 실패, 객체 형태 오류, email 누락 시 `null`을 반환하고 잘못된 값을 제거한다. `writeAuthSession()`은 email/signedInAt만 저장한다.

- [ ] **Step 4: AuthContext 실패 테스트를 작성한다.**

```tsx
it('login 후 인증 상태가 true가 되고 새 세션이 저장된다', async () => {
  // 테스트 consumer에서 login('runner@example.com', 'demo') 실행
  // isAuthenticated === true와 저장된 email을 검증
});

it('logout 후 인증 상태와 localStorage 세션을 제거한다', async () => {
  // 초기 세션을 넣고 Provider 렌더 → logout → null 검증
});
```

- [ ] **Step 5: AuthProvider와 `useAuth()`를 구현한다.**

동작 규칙:

```text
login(email, password)
- trim된 email이 비어 있으면 false
- password가 비어 있으면 false
- 실제 서버 검증은 하지 않음
- 성공 시 { email, signedInAt: new Date().toISOString() } 저장
- password는 저장하지 않음

logout()
- auth session key 삭제
- React state를 null로 변경
```

- [ ] **Step 6: 앱 루트에 AuthProvider를 한 번만 연결한다.**

기존 Provider/Router 순서를 먼저 확인하고, 모든 페이지와 Header가 `useAuth()`에 접근할 수 있는 위치에 배치한다. Router 구조 자체는 재작성하지 않는다.

- [ ] **Step 7: auth 단위 테스트와 전체 build를 확인한다.**

```bash
npm test -- authSession AuthContext
npm run build
```

Expected: PASS.

---

## Task 3: LoginPage와 Header 인증 상태 UI 연결

**Goal:** 사용자가 가짜 로그인/로그아웃 흐름을 직접 경험할 수 있게 하되, 로그인하지 않아도 모든 RunRoute 기능을 그대로 사용할 수 있게 한다.

**Files:**
- Create: `src/components/auth/AuthMenu.tsx`
- Create: `src/components/auth/AuthMenu.test.tsx`
- Create: `src/pages/LoginPage.tsx`
- Create: `src/pages/LoginPage.module.css`
- Create: `src/pages/LoginPage.test.tsx`
- Modify: `src/app/App.tsx`
- Modify: Step 1에서 찾은 실제 Header/AppHeader/GNB 생산 파일

**Interfaces:**
- Route: `/login`
- Auth UI:
  - signed out → `로그인` link
  - signed in → email 표시 + `로그아웃` button
- No protected routes.

- [ ] **Step 1: 실제 Header 파일을 확정한다.**

```bash
rg -n "AppHeader|Header|GNB|저장한 코스|홈" src
```

`App.tsx` 또는 실제 Layout에서 import되는 Header 파일 한 곳만 수정 대상으로 선택한다.

- [ ] **Step 2: LoginPage 실패 테스트를 작성한다.**

최소 테스트:

```tsx
it('이메일과 비밀번호 입력 폼을 표시한다', () => {
  // email input, password input, 로그인 버튼 확인
});

it('유효한 입력으로 로그인하면 홈으로 이동한다', async () => {
  // MemoryRouter + AuthProvider로 렌더
  // email/password 입력 → submit → '/' 이동 확인
});

it('빈 입력은 로그인하지 않는다', async () => {
  // validation message 또는 required 상태 확인
});
```

- [ ] **Step 3: LoginPage를 구현한다.**

화면 요구사항:

```text
RunRoute 로그인
MVP 데모 로그인입니다. 입력한 정보는 서버로 전송되지 않습니다.

이메일 [                    ]
비밀번호 [                  ]
[로그인]
```

규칙:
- `<input type="email">`, `<input type="password">` 사용
- email/password 모두 필수
- 로그인 성공 시 `/`로 이동
- 이미 로그인 상태에서 `/login`으로 진입하면 `/`로 replace 이동
- 회원가입 링크를 만들지 않는다
- 소셜 로그인 버튼을 만들지 않는다
- 실제 로그인인 것처럼 오해할 수 있는 문구를 넣지 않는다

- [ ] **Step 4: AuthMenu 실패 테스트를 작성한다.**

```tsx
it('비로그인 상태에서 로그인 링크를 표시한다', () => {
  // href="/login" 검증
});

it('로그인 상태에서 email과 로그아웃 버튼을 표시한다', () => {
  // runner@example.com, 로그아웃 확인
});
```

- [ ] **Step 5: AuthMenu를 Header 우측 영역에 연결한다.**

현재 중앙 `홈 / 저장한 코스` 정렬을 깨지 않도록 기존 Header의 우측 균형 영역 또는 action 영역에 배치한다. 모바일/좁은 화면에서는 기존 breakpoint 규칙 안에서 줄바꿈 또는 간격만 조정하고 새로운 모바일 전용 UI를 만들지 않는다.

- [ ] **Step 6: App 라우트에 `/login`을 추가한다.**

```tsx
<Route path="/login" element={<LoginPage />} />
```

기존 `/`, `/courses/:courseId`, `/saved`, wildcard 라우트 순서와 동작을 보존한다.

- [ ] **Step 7: 비로그인 접근이 막히지 않는 회귀 테스트를 추가한다.**

```tsx
it('비로그인 사용자도 홈에 접근할 수 있다', () => {
  // session 없음 → Home 렌더 확인
});

it('비로그인 사용자도 저장 페이지와 상세 페이지에 접근할 수 있다', () => {
  // protected redirect가 발생하지 않음을 검증
});
```

- [ ] **Step 8: 로그인 지속/로그아웃 수동 동작을 확인한다.**

```text
1. /login에서 로그인
2. Header에 email + 로그아웃 표시
3. 브라우저 새로고침
4. 로그인 상태 유지
5. 홈/상세/저장/길찾기 기능 정상 사용
6. 로그아웃
7. Header가 로그인 링크로 복귀
8. 기존 저장 코스는 그대로 유지
```

- [ ] **Step 9: Phase 2 전체 검증을 실행한다.**

```bash
npm test
npm run build
```

Expected: 기존 테스트 + auth 테스트 PASS, production build 성공.

- [ ] **Step 10: 커밋한다.**

```bash
git add src/features/auth src/components/auth src/pages/LoginPage.tsx src/pages/LoginPage.module.css src/pages/LoginPage.test.tsx src/app
# Step 1에서 확정한 Header 파일도 함께 add

git commit -m "feat: add simulated login flow"
```

**Phase 2 완료 기준:**
- 실제 서버/DB 없이 로그인 상태가 동작한다.
- 비밀번호가 저장되지 않는다.
- 새로고침 후 로그인 상태가 유지된다.
- 로그아웃이 동작한다.
- 비로그인/로그인 모두 기존 RunRoute 핵심 기능을 사용할 수 있다.
- Saved 데이터는 auth session과 독립적으로 유지된다.

---

# Phase 3 — 최종 Regression QA

## Task 4: Mission 6 Acceptance Verification

**Goal:** 기능을 더 추가하지 않고 현재 RunRoute 전체 흐름이 최종 제출 가능한 상태인지 자동 테스트와 수동 QA로 검증한다.

**Files:**
- Feature files: 원칙적으로 변경 없음
- 실패가 발견된 경우 해당 문제와 직접 관련된 파일만 수정

- [ ] **Step 1: 전체 자동 테스트를 실행한다.**

```bash
npm test
```

Expected: 0 failed tests.

- [ ] **Step 2: production build를 실행한다.**

```bash
npm run build
```

Expected: exit code 0, TypeScript/Vite build 오류 없음.

- [ ] **Step 3: production preview를 실행한다.**

```bash
npm run preview
```

개발 서버가 아니라 build 결과를 기준으로 이후 수동 QA를 수행한다.

- [ ] **Step 4: 비로그인 핵심 사용자 흐름을 확인한다.**

```text
/ 진입
→ 추천 코스/필터 확인
→ 코스 상세 진입
→ 저장
→ /saved 확인
→ 저장 해제
→ 마지막 항목 제거 시 Empty State
→ 상세에서 길찾기 Modal Open/Close
```

- [ ] **Step 5: Error/Loading 경계를 확인한다.**

```text
Error:
/courses/not-found-course 직접 접근
→ 코스 정보를 찾을 수 없다는 Error UI
→ 홈 복귀 CTA

Loading:
현재 동기 Mock Data이므로 인위적 delay를 추가하지 않는다.
HomePage/CourseDetailPage의 기존 Skeleton 테스트가 PASS하는 것으로 경계를 검증한다.
```

- [ ] **Step 6: 로그인 흐름을 확인한다.**

```text
/login
→ demo login
→ 새로고침 후 유지
→ 홈/상세/저장/길찾기 정상
→ 로그아웃
→ 기존 Saved 데이터 유지
→ 비로그인 상태에서도 기능 사용 가능
```

- [ ] **Step 7: Router/History를 확인한다.**

```text
홈 → 상세 → 저장 페이지 → 상세
브라우저 뒤로가기/앞으로가기 정상
/courses/:courseId 직접 URL 접근 정상
/saved 직접 URL 접근 정상
```

- [ ] **Step 8: 반응형을 4개 기준 폭에서 확인한다.**

```text
1440px
1280px
768px
390px
```

확인 항목:
- 가로 스크롤 없음
- 카드/이미지 잘림 없음
- Header 중앙 메뉴와 auth action 충돌 없음
- 로그인 폼 overflow 없음
- 상세 CTA 겹침 없음
- 분위기 카드 구조 유지
- Saved Grid 방향 유지

- [ ] **Step 9: 브라우저 Console을 확인한다.**

Expected: 사용자 흐름 중 uncaught error, React key warning, failed asset error가 없어야 한다.

- [ ] **Step 10: localStorage key를 확인한다.**

최소 다음 두 종류가 서로 독립적으로 동작해야 한다.

```text
기존 saved-course 관련 key
runroute:auth-session
```

로그아웃은 auth session만 제거하고 Saved key를 삭제하지 않아야 한다.

- [ ] **Step 11: 문제가 발견되면 최소 수정 후 전체 검증을 처음부터 다시 실행한다.**

수정 후 반드시 다시:

```bash
npm test
npm run build
```

- [ ] **Step 12: QA 완료 커밋이 필요한 경우에만 커밋한다.**

```bash
git status --short
# Phase 3 시작 시 작업 트리가 깨끗했다는 전제에서 QA 중 수정된 tracked 파일만 stage한다.
git add -u
git commit -m "fix: resolve final sprint 6 regressions"
```

새 문제를 수정하지 않았다면 불필요한 빈 커밋은 만들지 않는다.

---

# Phase 4 — README / Design System 최종 문서화 + GitHub Push

## Task 5: 최종 문서 생성과 GitHub 동기화

**Goal:** 실제 구현 결과를 기준으로 README와 디자인 시스템을 다시 작성하고, 제출용 GitHub 저장소에 최신 코드를 Push한다.

**Files:**
- Create: `README.md`
- Create: `design-system.md`
- Do not commit: `plan.md`, `task.md` (이번 작업용 로컬 문서)
- Modify: 기능 코드는 Phase 3에서 검증이 끝난 상태이므로 원칙적으로 변경 없음

- [ ] **Step 1: 실제 코드에서 README에 쓸 사실을 수집한다.**

확인 명령:

```bash
cat package.json
rg -n "path=|Route path|createBrowserRouter" src
rg -n "localStorage|AUTH_SESSION_KEY|saved" src/features src/hooks src/services
```

README에 추측으로 라이브러리/라우트/기능을 쓰지 않는다.

- [ ] **Step 2: README.md를 실제 구현 기준으로 작성한다.**

필수 섹션:

```text
# RunRoute
서비스 소개
핵심 사용자 문제
핵심 기능
- 추천 코스 탐색/필터
- 코스 상세
- 저장/해제 및 Saved
- 길찾기 안내 Modal
- Empty/Error/Skeleton UX
- localStorage 기반 데모 로그인

기술 스택
프로젝트 실행 방법
npm install
npm run dev
npm test
npm run build
npm run preview

주요 Routes
localStorage 사용 항목
MVP 범위
의도적으로 제외한 기능
- Backend/DB/API/Mock Server
- 실제 지도 연동
- 실제 인증/회원가입/계정 동기화

반응형 기준
테스트/품질 검증 방법
```

로그인은 반드시 `실제 인증이 아닌 MVP 인증 상태 시뮬레이션`이라고 설명한다.

- [ ] **Step 3: 실제 CSS/tokens/components에서 디자인 시스템 값을 수집한다.**

```bash
find src -maxdepth 3 -type f \( -name "*.css" -o -name "*.module.css" \) -print
rg -n -- "--[a-zA-Z0-9-]+:" src
```

이전 문서의 값을 기억으로 복원하지 않고 현재 구현값을 기준으로 작성한다.

- [ ] **Step 4: design-system.md를 최종 구현 기준으로 작성한다.**

필수 섹션:

```text
# RunRoute Design System
디자인 원칙
Desktop 중심 Responsive Web 원칙
색상 토큰
Typography
Spacing / Radius / Shadow
Content width / Grid / Breakpoints
Button
Chip / Tag
CourseCard
FeaturedCourseCard
SaveControl
Toast
DirectionsModal
Empty / Error / Skeleton
Login form / AuthMenu
Focus / Keyboard / Accessibility
이미지/Fallback 규칙
화면별 레이아웃
- Home
- Detail
- Saved
- Login
확정된 제품 UI 결정
- 서비스명 RunRoute
- 분위기 카드 유지 및 향후 사진 확장
- Saved 카드 Grid 유지
```

실제 코드와 다른 규칙을 새로 정의하지 않는다.

- [ ] **Step 5: 문서에서 이전 서비스명/폐기된 범위를 검색한다.**

```bash
rg -n "RUNWAY|Runway|로그인 제외|회원가입 없이만|horizontal list" README.md design-system.md
```

Expected: 잘못된 이전 서비스명과 현재 결정에 반하는 설명이 없어야 한다. `회원가입 없이 핵심 기능 사용 가능`이라는 설명 자체는 유지 가능하지만, 데모 로그인 기능 존재와 모순되지 않게 쓴다.

- [ ] **Step 6: 문서 작성 후 코드 검증을 다시 실행한다.**

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 7: Git 상태를 확인하고 plan/task를 커밋 대상에서 제외한다.**

```bash
git status --short
```

`plan.md`, `task.md`가 로컬 작업 문서라면 `git add .`를 사용하지 않는다.

- [ ] **Step 8: 최종 문서와 코드만 커밋한다.**

```bash
git add README.md design-system.md src package.json package-lock.json vercel.json
```

`vercel.json`이 아직 존재하지 않으면 해당 경로는 add 명령에서 제외한다.

```bash
git commit -m "docs: finalize RunRoute sprint 6"
```

이미 Phase 1~3의 코드가 각각 커밋되어 있고 Phase 4에서 문서만 변경됐다면 `README.md`와 `design-system.md`만 add한다.

- [ ] **Step 9: 원격 저장소와 브랜치를 확인한다.**

```bash
git remote -v
git branch --show-current
git status --short
```

- [ ] **Step 10: GitHub에 Push한다.**

```bash
git push
```

Expected: 현재 브랜치의 최신 커밋이 GitHub 원격 저장소에 반영된다.

**Phase 4 완료 기준:**
- README와 design-system이 현재 RunRoute 구현과 일치한다.
- RunRoute 명칭이 일관된다.
- 실제 인증과 데모 로그인을 명확히 구분한다.
- 코드 테스트/build가 통과한다.
- 최신 코드/문서가 GitHub에 Push된다.
- 작업용 plan/task는 최종 Git 문서 구성에 포함하지 않아도 된다.

---

# Phase 5 — Vercel 배포와 Production QA

## Task 6: Vercel Production Deployment

**Goal:** GitHub에 Push된 최종 RunRoute를 Vercel에 배포하고 실제 Production URL에서 SPA 라우팅과 핵심 사용자 흐름을 최종 검증한다.

**Files:**
- Create/Modify if needed: `vercel.json`
- Optional after deploy: `README.md`에 실제 Production URL을 추가할 경우 docs commit

- [ ] **Step 1: SPA rewrite 설정을 확인한다.**

React Router 기반 Vite SPA에서 직접 URL 접근 시 Vercel 404가 발생하지 않도록 repository root의 `vercel.json`을 확인한다.

기본 형태:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

`cleanUrls: true`를 별도로 사용하고 있다면 `/index.html` rewrite와 충돌할 수 있으므로 제거하거나 현재 Vercel 설정에 맞게 조정한다. 불필요한 build/output 설정은 Vite 자동 감지가 정상이라면 추가하지 않는다.

- [ ] **Step 2: vercel.json을 새로 만들거나 수정했다면 검증 후 GitHub에 Push한다.**

```bash
npm test
npm run build
git add vercel.json
git commit -m "chore: configure Vercel SPA routing"
git push
```

이미 올바른 설정이 존재하면 새 커밋을 만들지 않는다.

- [ ] **Step 3: Vercel Dashboard에서 GitHub repository를 Import한다.**

```text
Vercel Dashboard
→ New Project
→ GitHub repository 선택
→ Framework Preset: Vite 자동 감지 확인
→ Build 설정이 package.json과 일치하는지 확인
→ Deploy
```

환경 변수가 필요한 실제 API/비밀키는 이번 MVP에 없으므로 새 secret을 만들지 않는다.

- [ ] **Step 4: Build/Deployment 로그를 확인한다.**

Expected:
- Build 성공
- Production deployment 상태 Ready
- root URL 정상 응답

- [ ] **Step 5: Production URL에서 직접 라우트/새로고침을 확인한다.**

```text
/
/login
/saved
/courses/buyongcheon
/courses/not-found-course
```

각 URL을 주소창에 직접 입력하고 새로고침한다. Vercel 기본 404가 나오면 완료 처리하지 않는다.

- [ ] **Step 6: Production 핵심 기능을 확인한다.**

```text
홈 카드/필터
상세 진입
저장/해제
새로고침 후 Saved 유지
마지막 삭제 후 Empty State
길찾기 Modal
잘못된 course id Error State
로그인
로그인 새로고침 유지
로그아웃
로그아웃 후 Saved 유지
```

- [ ] **Step 7: Production 반응형을 확인한다.**

```text
1440px
1280px
768px
390px
```

가로 스크롤, Header auth 충돌, 카드/CTA 겹침이 없어야 한다.

- [ ] **Step 8: Production Console을 확인한다.**

Expected: uncaught runtime error, asset 404, React warning이 없어야 한다.

- [ ] **Step 9: 필요하면 README에 Production URL을 추가하고 마지막 docs commit을 Push한다.**

```bash
git add README.md
git commit -m "docs: add RunRoute production URL"
git push
```

URL을 README에 넣지 않기로 하면 이 Step은 생략한다.

- [ ] **Step 10: 제출 정보를 정리한다.**

```text
GitHub Public Repository URL
Vercel Production URL
```

두 URL을 시크릿/로그인 없이 평가자가 열 수 있는지 확인한다.

**Phase 5 완료 기준:**
- Vercel Production deployment가 성공한다.
- 직접 URL과 새로고침에서 SPA 404가 발생하지 않는다.
- Production에서 핵심 기능과 데모 로그인 흐름이 정상 동작한다.
- GitHub repository와 Production URL이 제출 가능한 상태다.

---

# Final Definition of Done

아래가 모두 검증된 경우에만 Sprint Mission 6 완료로 판단한다.

- [ ] React 컴포넌트 구조에서 명확한 CourseCard 중복이 제거되었다.
- [ ] TAG label source가 단일화되었다.
- [ ] 기존 UI와 핵심 기능에 회귀가 없다.
- [ ] localStorage 기반 데모 로그인/로그아웃이 동작한다.
- [ ] 비로그인 사용자도 핵심 기능을 모두 사용할 수 있다.
- [ ] 로그인 상태는 새로고침 후 유지되고 로그아웃 시 제거된다.
- [ ] 비밀번호는 localStorage에 저장되지 않는다.
- [ ] Saved 데이터는 로그인 상태와 독립적으로 유지된다.
- [ ] Empty/Error/Skeleton 경계가 기존 테스트 기준으로 유지된다.
- [ ] 1440/1280/768/390px에서 레이아웃이 깨지지 않는다.
- [ ] `npm test` PASS.
- [ ] `npm run build` PASS.
- [ ] `npm run preview` 기반 수동 QA 완료.
- [ ] README.md가 실제 구현과 일치한다.
- [ ] design-system.md가 실제 UI 토큰/컴포넌트와 일치한다.
- [ ] GitHub에 최신 코드와 최종 문서가 Push되어 있다.
- [ ] Vercel Production 배포가 성공한다.
- [ ] Production 직접 URL/새로고침/핵심 기능 QA가 완료된다.