# PLAN.md — 엔필름 구현 계획

> 세션 간 유지되는 계획. **각 Phase 시작 시 `/plan`** 으로 읽기 순서 이행.
> `F-NN` = FEATURES.md 기능 ID. 완료는 **실제 검증 후** `[x]`.

**범례:** `F-NN` 기능 ID · `📄 specs/*.md` 상세 스펙 · `🏗` 인프라 · `🧪` 테스트

---

## Phase 0: 초기 설정 🏗  (하네스의 "Initializer" 단계)

**목표:** 인프라·스캐폴딩 완성 — 이후 세션이 깨끗한 상태에서 시작하도록.
**선행조건:** 없음

- [x] 🏗 프로젝트 생성 (Next.js 15 App Router · React 19 · TS strict — 수동 셋업)
- [x] 🏗 필수 패키지 설치 (zustand · TanStack Query · RHF · zod · Tailwind · Vitest)
- [x] 🏗 폴더 구조 스캐폴딩 (`src/{app,components,features,lib,constants,config,hooks,stores,types}`)
- [x] 🏗 `.env.example` + `src/config/env.ts` (zod 런타임 검증, 스텁 플래그)
- [x] 🏗 Lint + Prettier + 타입 strict (`noUncheckedIndexedAccess` 포함)
- [x] 🏗 `constants/theme.ts` 디자인 토큰 (흑백영화 톤 + 하늘색 accent)
- [x] 🏗 디자인 시스템 초안 (Button · Input · Card · ComingSoon)
- [x] 🏗 빌드/실행/테스트 명령 동작 확인 (`tsc` · `vitest` · `next lint` · `next build` · `next dev` 4 라우트 200 OK)
- [ ] 🏗 초기 커밋 + DEVLOG 첫 기록 *(`git init` 사용자 결정 대기 — DEVLOG 는 기록됨)*

**완료 기준:** 빈 화면이 뜬다 · 타입체크 통과 · §0 명령 모두 동작 ✅ (커밋 제외)

---

## Phase 1: 핵심 4기능 MVP (스텁 모드)

**목표:** F-01~F-04 가 인메모리/스텁으로 end-to-end 동작. 추후 Supabase·Kakao 연동만 갈아끼우면 되는 service 인터페이스.
**기능:** F-01, F-02, F-03, F-04
**선행조건:** Phase 0 완료 ✅
**관련 문서:** 📄 `specs/F-01-job-posting.md` · `F-02-auth-kakao.md` · `F-03-invite-signup.md` · `F-04-blacklist.md` (전부 다음 세션 인터뷰 후 작성)

### F-01 공고 올리기 (최우선)
- [x] F-01 spec 작성 (인터뷰 후 피드형 메인 구조로 보강)
- [x] F-01 service 인터페이스 + 인메모리 구현 (`features/jobs/services/jobs.service.ts`)
- [x] F-01 React Hook Form + zod safeParse (`/jobs/new`) + 라이브 미리보기
- [x] F-01 피드(`/jobs`) + 공유 페이지(`/jobs/[id]`) + 마감 토글
- [x] 🧪 F-01 format/service/dday 유닛 16건 통과 + 라우트 200 확인
- [ ] Playwright 등록→피드→마감 시나리오 (Phase 1 마지막 일괄)

### F-02 카카오톡 소셜로그인 (스텁) — F-03 과 통합
- [x] F-02 spec 작성 (`specs/F-02-auth.md` — F-03 통합)
- [x] users.service + session.store (Zustand persist localStorage) + useCurrentUser
- [x] `/login` 카카오 버튼 + 닉네임 입력 + 매칭/미매칭 안내
- [x] 헤더 `AuthAvatar` (비로그인 "로그인" · 로그인 시 닉네임)
- [x] 🧪 users.service / session.store 유닛 통과 + 라우트 200

### F-03 가입 인증 (초대 링크)
- [x] F-03 spec 작성 (F-02 와 같은 문서)
- [x] invites.service (발급/만료/사용/검증) + `/invite/[token]` 라우트
- [x] `/me` 마이페이지에서 초대 링크 발급 + 복사 + 발급 내역
- [x] SignupForm (약관/개인정보 동의 → 기본/추가 정보 → 가입 유형/성별/알림) + 닉네임 실시간 중복 체크
- [x] 🧪 invites.service / signup.schema 유닛 통과
- [ ] Playwright: 발급 → 새 브라우저 → 가입 → 자동 로그인 (Phase 1 마지막 일괄)

### F-04 평점·평판 시스템 (블랙리스트 폐기 · 평점으로 대체)
- [x] F-04 spec 작성 (`specs/F-04-ratings.md`)
- [x] applications service + ApplyForm/ApplicantsList/MyApplicationsList
- [x] ratings service + canRate 자격 검증 + Stars/AuthorStars/RatingForm
- [x] 프로필 페이지 `/u/[loginId]` + JobCard 작성자 옆 별점/링크 노출
- [x] 🧪 자격 검증·중복 차단·평균 계산 유닛 8건 통과 (총 42/42)

**완료 기준:** 신규 사용자가 초대 링크 → 가입 → 로그인 → 공고 등록 → 목록 노출까지 1분 안에 통과.

---

## 🚫 전체 Out of Scope

`FEATURES.md §9` 참조. 절대 구현 금지.

---

## 부록 A. specs 목록

| Phase | 파일 | 담당 기능 | 상태 |
|:-----:|------|----------|------|
| 1 | `specs/F-01-job-posting.md` | F-01 | ⬜ 미작성 |
| 1 | `specs/F-02-auth-kakao.md` | F-02 | ⬜ 미작성 |
| 1 | `specs/F-03-invite-signup.md` | F-03 | ⬜ 미작성 |
| 1 | `specs/F-04-ratings.md` | F-04 | ✅ |

## 부록 B. Phase × F-ID 매트릭스

| F-ID | 기능 | 우선 | Phase |
|:----:|------|:---:|:-----:|
| F-01 | 공고 올리기 | M | 1 |
| F-02 | 카카오톡 소셜로그인 | M | 1 |
| F-03 | 가입 인증(지인 추천만 가입가능) | M | 1 |
| F-04 | 평점·평판 시스템 (+ 신청) | M | 1 |
