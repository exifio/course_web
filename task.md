# task.md

> 이 파일은 RunRoute Sprint Mission 6 최종 작업의 진행 상황을 빠르게 확인하기 위한 체크리스트입니다.
> 상세 구현 절차는 `plan.md`를 기준으로 진행합니다.
> 이번 작업에서 별도 PRD/AGENTS 문서는 사용하지 않습니다.

---

# 1. 전체 작업 진행 상황

- [ ] **Phase 1 / Task 1 — React 컴포넌트 구조 최소 정리**
  - Difficulty: EASY
  - Reason: 현재 생산 `CourseCard`와 중복 파일, `TAG_LABELS` 중복 위치가 이미 진단되어 있어 범위가 명확함

- [ ] **Phase 2 / Task 2 — Auth Session 저장 계층 + React Context 구현**
  - Difficulty: HARD
  - Reason: localStorage 복구, 전역 인증 상태, 새로고침 유지, 기존 Saved 상태와의 분리까지 함께 검증해야 함

- [ ] **Phase 2 / Task 3 — LoginPage + Header 인증 상태 UI 연결**
  - Difficulty: HARD
  - Reason: Router, Header 정렬, 로그인/로그아웃 상태, 비로그인 접근 보장, 반응형 회귀를 함께 다뤄야 함

- [ ] **Phase 3 / Task 4 — 최종 Regression QA**
  - Difficulty: HARD
  - Reason: 전체 기능, Router, Empty/Error/Skeleton, auth, localStorage, responsive, console을 종합 검증해야 함

- [ ] **Phase 4 / Task 5 — README / design-system 최종 작성 + GitHub Push**
  - Difficulty: EASY
  - Reason: 기능 구현이 끝난 뒤 실제 코드에서 사실을 추출하여 문서화하고 Push하는 단계

- [ ] **Phase 5 / Task 6 — Vercel Production 배포 + 최종 Production QA**
  - Difficulty: HARD
  - Reason: SPA rewrite, 직접 URL 새로고침, Production 상태, 배포 환경 회귀까지 확인해야 함

---

# 2. 현재 작업

## Current Phase

**Phase 1 — React 컴포넌트 구조 최소 정리**

## Current Task

**Task 1 — CourseCard 중복 제거와 Tag Label 단일화**

상세 구현 내용:

- `plan.md` → **Phase 1 / Task 1**

이번 Task에서 하는 일:

- canonical CourseCard를 `src/features/courses/CourseCard.tsx`로 유지
- 중복 `src/components/course/CourseCard.tsx`의 생산 import를 재확인한 뒤 제거
- 필요한 테스트를 canonical CourseCard 기준으로 유지/이동
- 여러 파일의 `TAG_LABELS`를 `src/features/courses/tagLabels.ts`로 단일화
- `FeaturedCourseCard`, `CourseDetailPage` 등에서 공통 label source를 import
- 기존 UI/기능은 변경하지 않음
- `FeaturedCourseCard`, `DirectionsModal`, `CourseDetailPage` 전체 구조를 불필요하게 재작성하지 않음

작업 요청은 다음처럼 Task 단위로 진행합니다.

```text
Task 1 진행해줘
```

Task 내부의 세부 Step은 `plan.md`를 따라 순서대로 수행합니다.

---

# 3. 현재 Task 완료 후 확인

## Phase 1 / Task 1 검수 체크리스트

- [ ] 작업 시작 전 `git status --short`를 확인했다.
- [ ] 변경 전 `npm test` 결과를 확인했다.
- [ ] 변경 전 `npm run build` 결과를 확인했다.
- [ ] Home과 Saved가 여전히 `src/features/courses/CourseCard.tsx`를 사용한다.
- [ ] 생산 코드에서 중복 `src/components/course/CourseCard.tsx`를 더 이상 사용하지 않는다.
- [ ] 중복 CourseCard를 삭제했거나 역할 중복이 제거되었다.
- [ ] CourseCard 관련 테스트가 canonical 컴포넌트를 기준으로 유지된다.
- [ ] `TAG_LABELS` 또는 tag label 변환 source가 한 파일로 정리되었다.
- [ ] `CourseCard`, `FeaturedCourseCard`, `CourseDetailPage`가 공통 tag label source를 사용한다.
- [ ] Featured Course의 현재 시각 디자인이 바뀌지 않았다.
- [ ] Saved의 현재 카드 Grid 방향이 바뀌지 않았다.
- [ ] 상세의 분위기 카드가 그대로 유지된다.
- [ ] `DirectionsModal` 등 이번 Task와 무관한 기능을 불필요하게 리팩터링하지 않았다.
- [ ] 저장/해제, 상세 이동, 필터 등 기존 기능이 유지된다.
- [ ] `npm test`가 PASS한다.
- [ ] `npm run build`가 PASS한다.
- [ ] diff가 중복 제거/label 단일화 범위를 벗어나지 않는다.

## 확인이 모두 끝나면

다음 Current Task는 아래로 변경합니다.

```text
Phase 2 / Task 2 — Auth Session 저장 계층 + React Context 구현
```

---

# 4. 이후 Task별 완료 기준 요약

## Phase 2 / Task 2 — Auth Session + Context

- [ ] `runroute:auth-session` localStorage key를 사용한다.
- [ ] 저장 세션은 email과 signedInAt만 가진다.
- [ ] 비밀번호를 localStorage에 저장하지 않는다.
- [ ] 손상된 auth JSON을 안전하게 `null`로 복구한다.
- [ ] `login()` / `logout()` / `isAuthenticated`가 React Context로 동작한다.
- [ ] 실제 서버/API 요청이 없다.
- [ ] 기존 Saved localStorage 로직을 변경하지 않는다.
- [ ] 관련 테스트 PASS.
- [ ] `npm run build` PASS.

## Phase 2 / Task 3 — LoginPage + Header

- [ ] `/login` 라우트가 동작한다.
- [ ] 이메일/비밀번호 입력 UI가 있다.
- [ ] 화면에서 데모 로그인임을 명확히 알린다.
- [ ] 로그인 성공 후 `/`로 이동한다.
- [ ] 새로고침 후 로그인 상태가 유지된다.
- [ ] Header에서 비로그인 시 `로그인`이 보인다.
- [ ] Header에서 로그인 시 email + `로그아웃`이 보인다.
- [ ] 로그아웃이 auth session만 제거한다.
- [ ] 로그아웃 후에도 기존 Saved 데이터가 유지된다.
- [ ] 비로그인 사용자도 `/`, `/saved`, `/courses/:courseId`를 사용할 수 있다.
- [ ] 중앙 Home/Saved navigation 정렬이 auth UI 때문에 깨지지 않는다.
- [ ] 390/768/1280/1440에서 Header와 로그인 폼이 깨지지 않는다.
- [ ] 전체 테스트 PASS.
- [ ] `npm run build` PASS.

## Phase 3 / Task 4 — Regression QA

- [ ] `npm test` PASS.
- [ ] `npm run build` PASS.
- [ ] `npm run preview`로 production build를 확인했다.
- [ ] 홈/필터/상세 흐름 정상.
- [ ] 저장/해제/Saved/Empty 정상.
- [ ] 길찾기 Modal 정상.
- [ ] 잘못된 course id Error UI 정상.
- [ ] Skeleton 관련 기존 테스트 정상.
- [ ] 로그인/새로고침 유지/로그아웃 정상.
- [ ] 로그인 여부와 Saved 데이터가 독립적이다.
- [ ] 브라우저 뒤로가기/앞으로가기 정상.
- [ ] 직접 route 접근 정상.
- [ ] 1440px 정상.
- [ ] 1280px 정상.
- [ ] 768px 정상.
- [ ] 390px 정상.
- [ ] 가로 스크롤 없음.
- [ ] Console uncaught error 없음.

## Phase 4 / Task 5 — README / Design System + GitHub

- [ ] README.md를 실제 구현 기준으로 새로 작성했다.
- [ ] README에 RunRoute 이름이 일관된다.
- [ ] README에 데모 로그인과 실제 인증의 차이를 명확히 적었다.
- [ ] README에 Backend/API/Mock Server 미사용을 명확히 적었다.
- [ ] README에 실행/테스트/build 명령을 적었다.
- [ ] README에 주요 route와 MVP 범위를 적었다.
- [ ] design-system.md를 실제 CSS/token/component 기준으로 작성했다.
- [ ] design-system에 분위기 카드 유지 방향을 적었다.
- [ ] design-system에 Saved Grid 유지 방향을 적었다.
- [ ] design-system에 Login form/AuthMenu 규칙을 포함했다.
- [ ] `RUNWAY` 등 폐기된 서비스명이 남지 않았다.
- [ ] 문서 작성 후 `npm test` PASS.
- [ ] 문서 작성 후 `npm run build` PASS.
- [ ] `plan.md`, `task.md`는 Git 커밋 대상에서 제외했다.
- [ ] 최종 코드/README/design-system을 커밋했다.
- [ ] `git push`가 성공했다.
- [ ] GitHub 원격 저장소에 최신 커밋이 보인다.

## Phase 5 / Task 6 — Vercel

- [ ] repository root의 `vercel.json` SPA rewrite를 확인했다.
- [ ] 필요한 경우 rewrite 설정을 GitHub에 Push했다.
- [ ] Vercel에서 GitHub repository를 Import했다.
- [ ] Framework Preset이 Vite로 올바르게 인식된다.
- [ ] Production deployment가 성공했다.
- [ ] `/` 직접 접근/새로고침 정상.
- [ ] `/login` 직접 접근/새로고침 정상.
- [ ] `/saved` 직접 접근/새로고침 정상.
- [ ] `/courses/buyongcheon` 직접 접근/새로고침 정상.
- [ ] `/courses/not-found-course`에서 앱 Error UI가 보인다.
- [ ] Production에서 저장/해제와 localStorage 유지가 정상이다.
- [ ] Production에서 로그인/새로고침 유지/로그아웃이 정상이다.
- [ ] Production에서 로그아웃 후 Saved가 유지된다.
- [ ] Production에서 길찾기 Modal이 정상이다.
- [ ] Production 1440/1280/768/390px QA 완료.
- [ ] Production Console runtime error/asset 404 없음.
- [ ] GitHub Public Repository URL을 준비했다.
- [ ] Vercel Production URL을 준비했다.

---

# 5. Sprint Mission 6 최종 완료 조건

아래 항목이 모두 충족될 때만 Mission 6 완료로 판단합니다.

- [ ] Phase 1 완료
- [ ] Phase 2 완료
- [ ] Phase 3 완료
- [ ] Phase 4 완료
- [ ] Phase 5 완료
- [ ] 최종 `npm test` PASS
- [ ] 최종 `npm run build` PASS
- [ ] Production QA 완료
- [ ] GitHub 제출 URL 확보
- [ ] Vercel 제출 URL 확보

Mission 6 완료 전에는 테스트/build/deployment 결과를 실제로 확인하지 않고 완료 상태로 변경하지 않습니다.