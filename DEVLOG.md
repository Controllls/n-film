# DEVLOG.md — 세션 메모리 (진행 파일)

> 하네스 가이드의 progress 파일. 세션 종료 시 `/log` 로 기록, 시작 시 먼저 읽는다.
> 컨텍스트 리셋을 넘어 결정·기술부채를 잇는 외부 메모리.

---

## 프로젝트 상태: **Phase 1 F-01~F-04 모두 구현 완료 (블랙리스트 → 평점으로 전환)**

### 현재 완료된 것
- Phase 0 인프라 전부 — Next.js 15 App Router · React 19 · TS strict · Tailwind · Vitest
- 디자인 토큰 + 공통 UI(Button · Input · Card · ComingSoon) — 흑백영화 톤 + 하늘색 accent
- `src/config/env.ts` zod 런타임 검증 + 스텁 모드 플래그 (`NEXT_PUBLIC_USE_STUBS`)
- 4개 라우트(`/`, `/jobs`, `/jobs/new`, `/login`) 빌드·렌더 200 OK 확인
- vitest 3/3 통과 (Button · env)

### 다음 할 일 (다음 세션은 여기부터)
1. **사용자 검증:** 김정한 로그인 → KHJ 시드 공고(어제 끝남) → 신청자 명단 → 평점 남기기 시나리오 직접 확인
2. MVP 수락 기준(FEATURES.md §10) 채우기 — 4 기능 다 됐으니 측정 가능한 시나리오로
3. Phase 1 마무리: Playwright E2E (전체 흐름 등록 → 가입 → 신청 → 평점)
4. Phase 2 준비: Supabase 실연동 (스텁 service 인터페이스 그대로 교체) + Kakao OAuth 키 발급
5. (선택) `git init` — 사용자 결정 대기

---

## 세션 기록 — 2026-06-10 (F-04 = 평점/평판 + 신청 흐름)

### 변경 의도
사용자가 인터뷰 중 "블랙리스트 → 평점 개념으로" 전환. F-04 spec 을 새로 쓰고 신청 흐름도 같이 묶음 (평점의 "함께 일한 관계" 증명 근거가 신청 기록이기 때문).

### 변경 (파일·내용)
- `specs/F-04-ratings.md` 신규, 기존 placeholder 폐기
- `FEATURES.md` §4·§5.4 / `PLAN.md` 매트릭스·체크박스 동기화
- `src/features/applications/` — 간단 신청 (수락/거절 없음). 시드 신청 1건 (김정한 → KHJ 공고)
- `src/features/ratings/` — Rating + canRate + summary + Stars/AuthorStars/RatingForm/ProfileView. 시드 평점 2건 (KHJ ↔ 김정한, 모두 KHJ 시드 공고에서)
- `src/features/jobs/lib/seed.ts` — KHJ 공고 `shootDate` 를 어제로 변경 (평점 데모 가능)
- `src/features/jobs/components/JobCard.tsx` — 작성자 닉네임에 `/u/[loginId]` 링크 + AuthorStars 옆에 표시 + isOwner 일 때 "신청자 명단" 버튼
- `src/features/jobs/components/JobsFeed.tsx` · `JobDetail.tsx` — 신청 클릭 → `/jobs/[id]/apply`, 명단 → `/jobs/[id]/applicants`
- `src/features/auth/components/MyPage.tsx` — 평점 요약 + 공개 프로필 / 내 신청 내역 링크
- `src/app/jobs/[id]/apply/page.tsx` · `applicants/page.tsx` · `/me/applications/page.tsx` · `/u/[loginId]/page.tsx` 신규
- 테스트 8건 추가 (applications 3 · ratings 5) → 총 42/42 통과

### 결정 (왜 — 트레이드오프)
- **블랙리스트 폐기**: 사용자가 명시적으로 방향 전환. 평점이 더 양방향 신뢰 데이터 + 명예훼손 리스크 적음. 블랙은 "차단" 강제 작용이라 잘못 등록 시 회복 어려움. 평점 평균은 다수의 평가로 자연 보정.
- **canRate 자격 = 신청 기록 기반**: "함께 일한 관계"의 증명. (작성자 ↔ 신청자) 양방향. 데이터 기반이라 어뷰징 어려움 (가짜 평점 매기려면 가짜 신청부터 만들어야).
- **수락/거절 없는 간단 신청**: 사용자 명시 선택. 영화업계 현실(카톡 연락)에 가장 가까움. 상태 머신 비용 없음.
- **평점 1회만 (수정 불가)**: Phase 1 단순화. 평점 수정·삭제는 명예 분쟁 이슈가 크니 별도 검토 가치. spec out-of-scope 명시.
- **KHJ 시드 공고를 어제로**: 데모 즉시 가능 (촬영 후 → 평점 가능). 김정한이 시드 신청자 → 시드 평점 2건이 미리 들어가 있음. 첫 접속에 별점이 보이는 경험.
- **AuthorLink → useQuery 로 nickname → loginId 매핑**: Job 데이터에 authorId/loginId 가 없어서. 추가 fetch 한 번 더 들지만 N+1 은 작은 카드 수에서 무시 가능. Supabase 전환 시 join 또는 비정규화로 해결.
- **/me/applications 분리**: /me 가 너무 복잡해지지 않게. 평점 남기기는 두 화면(내 신청·신청자 명단) 모두에서 가능.

### 알려진 이슈·미완성
- 카드/명단의 N 사용자에 대해 `findUserByNickname` 을 useQuery 로 호출 → 메모리 인덱스라 빠르지만 Supabase 전환 시 N+1 위험. join API 필요.
- 평점 시드 2건이 KHJ 시드 공고에 묶여 있어서, 그 공고가 closed 토글 등 영향받으면 시연 흐름이 살짝 어색할 수 있음.
- Playwright E2E 여전히 미작성.
- MVP 수락 기준 §10 비어 있음 — Phase 1 마무리에서 채울 예정.

### 다음 세션 첫 단계
1. 사용자 검증: 김정한 로그인 → /jobs 에서 KHJ 카드의 별점 확인 → 신청 흐름 + 평점 흐름 직접 시연
2. FEATURES.md §10 MVP 수락 기준 채우기 (측정 가능한 4개 시나리오)
3. Phase 1 마무리 Playwright 또는 Phase 2(Supabase 연동) 진입

---

## 세션 기록 — 2026-06-10 (F-02 + F-03 통합 구현 완료)

### 변경 의도
사용자 결정 "F-02 × F-03 같이 (시작부터 진짜 흐름)" + 필름메이커스 가입 양식 참조. 양식은 구조만 따라가서 엔필름용으로 간략화. 시드 사용자는 F-01 시드 공고 작성자(김정한·경원준·KHJ) 3명 그대로.

### 변경 (파일·내용)
- `specs/F-02-auth.md` — F-02 + F-03 통합 spec
- `src/features/auth/`
  - `types.ts` · `schemas.ts` (zod, 선택 필드 null 정규화) · `index.ts`
  - `content/terms.ts` — 엔필름 임시 약관 + 개인정보 처리방침
  - `lib/labels.ts` — 가입 유형/성별/메일링 옵션
  - `services/users.service.ts` — 인메모리 + 시드 3명 + 중복 체크
  - `services/invites.service.ts` — 7일 만료 + 1회용 토큰 + 상태(valid/expired/used/missing)
  - `store/session.store.ts` — Zustand persist (localStorage, partialize: currentUserId)
  - `hooks/useCurrentUser.ts` · `useLogin.ts` · `useSignup.ts` · `useInvites.ts`
  - `components/AuthAvatar.tsx` (헤더용) · `LoginScreen.tsx` · `TermsBox.tsx` · `SignupForm.tsx` · `InviteIssueCard.tsx` · `MyPage.tsx` · `InviteGate.tsx`
- `src/components/layout/MobileShell.tsx` — 헤더 우측에 AuthAvatar 자동 노출
- `src/app/login/page.tsx` — ComingSoon → LoginScreen
- `src/app/invite/[token]/page.tsx` — 신규: InviteGate
- `src/app/me/page.tsx` — 신규: MyPage
- F-01 통합:
  - `JobForm.tsx` — 로그인 사용자는 작성자 자동 채움 + 입력란 숨김
  - `JobsFeed.tsx` · `JobDetail.tsx` — isOwner = (user.nickname === job.authorName). 본인 공고는 신청 버튼 숨김, 타인은 신청 버튼만. 비로그인 신청 시 `/login` 이동.
- 테스트 추가 18건 (users 5 · invites 5 · signup schema 5 · session store 3) → 총 34/34 통과

### 결정 (왜 — 트레이드오프)
- **약관 본문 간략화 (Phase 1 임시본 명시)**: 사용자가 보내준 필름메이커스 약관/처리방침은 매우 김 + 본인인증·사업자등록·KOBIS 등 우리가 안 하는 외부 인증 언급 다수. 정식 출시 전 법적 검토가 필요한 문서라 임시본 + "정식본으로 교체" 안내가 더 안전.
- **닉네임 = 사실상의 로그인 식별자**: 스텁 모드에서 카카오 키 없으니 닉네임만으로 로그인. 아이디(loginId)는 가입 폼에 받지만 로그인 입력은 닉네임으로 통일 (실 카카오에서는 OAuth 토큰이 식별자 역할).
- **시드 user 3명 = F-01 시드 공고 작성자 매칭**: `김정한`으로 로그인 → 자기가 쓴 시드 공고에 isOwner 자동 true. nickname 매칭만으로 동작해 데이터 모델 변경 최소.
- **Zustand persist + 부분 직렬화 (`partialize`)**: localStorage 에 `currentUserId` 만 남김. `hydrated` 플래그는 메모리. SSR/CSR 미스매치 방지를 위해 사용처에서 `useHydrated()` 패턴.
- **`/me` 비로그인 접근 = 클라 useEffect 리다이렉트**: 서버 단계에 currentUserId 없음(클라 store) → server-side 가드 불가. Phase 1 한계.
- **AuthAvatar 헤더에 항상 노출**: action 슬롯과 별개. /jobs 페이지에서는 "+ 공고" + 아바타 둘 다 표시.

### 알려진 이슈·미완성
- 비로그인 `/me` 접근 시 server 첫 렌더는 200, 클라에서 `/login` 으로 리다이렉트 (깜빡임 한 프레임).
- 닉네임 실시간 중복 체크의 디바운스가 300ms — 빠르게 타이핑하면 메시지가 살짝 늦음.
- F-01 시드 공고는 인메모리, 시드 user 도 인메모리. 새로고침 시 둘 다 다시 생성되지만 ID 가 달라지므로 nickname 매칭으로 isOwner 유지.
- Playwright E2E 미작성.
- Out of Scope (CLAUDE.md §8) 와 정렬: "역할/권한 세분화" 안 함 — `kind` 는 단순 저장.

### 다음 세션 첫 단계
1. 사용자 검증: 김정한 로그인 → /me → 초대 발급 → 시크릿창에서 토큰 가입 → 자동 로그인
2. F-04 인터뷰 시작

---

## 세션 기록 — 2026-06-10 (F-01 구현 완료)

### 변경 의도
spec 확정 후 곧바로 구현. 사용자 추가 지시: "모바일 폭으로 PC에서도 모바일같이" → 전 화면 max-w-[480px] 고정 + 좌우 패딩 16px.

### 변경 (파일·내용)
- `src/features/jobs/`
  - `types.ts` · `schemas.ts` (zod 변환 포함) · `index.ts` (배럴)
  - `services/jobs.service.ts` — 인메모리 Map + `globalThis` HMR 지속 + `__resetForTest`
  - `lib/{format,dday,labels,seed}.ts` — 카톡 양식 조립, D-day, 한국어 라벨, 샘플 3건
  - `hooks/{useJobsQuery,useCreateJob,useToggleJobStatus}.ts` — TanStack Query
  - `components/{JobCard,JobForm,FeedFilters,JobsFeed,JobDetail}.tsx`
- `src/components/layout/MobileShell.tsx` — 480px 폭 헤더+컨테이너 공용
- `src/app/providers.tsx` — QueryClientProvider 클라 경계
- `src/app/layout.tsx` — Providers 래핑
- `src/app/{jobs/page,jobs/new/page,jobs/[id]/page,page}.tsx` — ComingSoon 자리 실제 구현으로 교체
- `tests/jobs.{format,service,dday}.test.ts` — 13건 추가 (총 16/16 통과)

### 결정 (왜 — 트레이드오프)
- **service `"use client"` + globalThis Map**: SSR 무관, 브라우저 메모리에 살아있음. HMR 후에도 유지. 새로고침 = 휘발(스펙대로). Supabase 전환 시 같은 함수 시그니처 유지.
- **첫 listJobs 호출에 시드 3건 자동 주입**: 빈 화면이 아니라 카톡 표본 그대로 보여 데모 즉시 가능. `globalThis.__nfilmJobsSeeded` 플래그로 1회만.
- **RHF + zod safeParse 수동 통합 (`@hookform/resolvers` 없이)**: 추가 의존성 회피. 코드는 onSubmit 에서 safeParse → setError 로 5줄 정도. 작은 폼이면 충분.
- **applyFields 의 "name" 강제 포함**: zod transform 으로 자동 prepend + 폼 UI는 "성함 (필수)" 칩으로 잠금 표시. 사용자가 끄지 못함.
- **본인/타인 구분 없이 isOwner=true로 일률 처리 (Phase 1)**: F-02 전이라 누가 작성자인지 모름. 임시로 모든 카드에 마감 토글·신청 버튼 둘 다 노출. 신청 클릭은 "로그인 필요" alert → `/login`.
- **모바일 폭 max-w-[480px] 고정 + MobileShell 공용**: 사용자 지시. 데스크탑에서도 폰 화면 시뮬. 추후 사용자가 직접 웹 디자인 손볼 예정.
- **JobCard = 피드 / 공유 / 폼 미리보기 공용**: 양식이 어디서나 동일하게 보임. isPreview prop 으로 액션 영역만 숨김.

### 알려진 이슈·미완성
- 인메모리 = 새로고침/탭 닫음 → 데이터 휘발 (수락기준에 명시됨)
- Playwright E2E 미작성 — Phase 1 마지막에 일괄 처리
- 신청 흐름 미연결 — F-02 의존
- 본인 공고 식별 부재 — F-02 후 isOwner 진짜 계산
- 카드 헤더의 "10분 전" 표시가 SSR/CSR 다를 수 있음 (Date.now). 현재는 useJobsQuery 가 클라에서 fetch 하므로 SSR에 카드 자체가 안 나옴 → 문제 없음

### 다음 세션 첫 단계
1. dev 띄워서 등록 → 피드 노출 → 마감 토글 흐름 사용자 확인
2. F-02 인터뷰 (`AskUserQuestion`): 스텁 로그인 입력 항목, 세션 저장 위치(zustand persist?), 로그아웃 동작
3. 인터뷰 후 `specs/F-02-auth-kakao.md` 작성 → 구현

---

## 세션 기록 — 2026-06-10 (F-01 spec 보강: 피드형 메인)

### 변경 의도
사용자 피드백: "메인화면에서 한번에 보고 신청. 상세 들어가는 거 아님." 카톡방 스크롤 감각 그대로.

### 변경 (파일·내용)
- `specs/F-01-job-posting.md` §2 진입경로 · §3.3 피드 · §3.4 공유 페이지 · §8 수락기준 재작성
- `FEATURES.md` §3 S-02 "공고 피드(메인)", S-03 "공유 링크"로 위상 변경

### 결정 (왜 — 트레이드오프)
- **상세 페이지를 죽이지는 않음 (`/jobs/[id]` 유지)**: 카톡·문자로 링크 공유할 때 단독 URL 필요. 디자인은 피드 카드 그대로 재사용 → 추가 비용 거의 없음.
- **신청은 인라인 (카드 안 버튼)**: 클릭 한 번이 곧 신청 진입. 비로그인은 `/login` 이동, 로그인은 모달/시트(F-02에서 결정).
- **무한 스크롤 채택**: 카톡 타임라인 감각에 페이지네이션 버튼은 어색.
- **카드 ≠ 요약, 카드 = 전체 양식**: 한 화면에 보이는 공고 수는 줄지만, 사용자가 진짜 원하는 정보(페이·콜타임·장소·받을 항목)가 한눈에. 필터로 노이즈 제거.

### 알려진 이슈·미완성
- 이전 세션 결정(카드 그리드 2~3열) 폐기, 무한 스크롤 1열로 변경.
- 카드 길이가 길어 데스크탑에서 여백이 클 수 있음 — 최대 폭 제한(예: 720px)으로 가독성 확보 예정.

### 다음 세션 첫 단계
spec 재확인 → 구현 들어가기 (피드 컴포넌트 = 자동조립 양식과 동일 컴포넌트 재사용).

---

## 세션 기록 — 2026-06-10 (F-01 인터뷰 + spec 확정)

### 변경 의도
사용자가 카톡방 실제 공고 표본(8건+)을 제공하며 "이 양식을 꼭 지켜야 한다"고 못박음. AskUserQuestion 4건으로 디자인 분기 확정 후 spec 작성.

### 변경 (파일·내용)
- `specs/F-01-job-posting.md` 신규 — 필드·자동조립·데이터모델·엣지케이스·수락기준 확정
- `FEATURES.md §3` 화면 인벤토리 S-01~S-07 채움
- `FEATURES.md §5.1` F-01 목적·플로우 + spec 링크
- `FEATURES.md §6` ERD 요약 + RLS 정책 초안

### 결정 (왜 — 트레이드오프)
- **구조화 필드 + 자동 조립 미리보기**: 카톡 표본 90%가 같은 양식을 씀 → 분해 가능 → 필터/정렬/통계가 카톡방 대비 진짜 가치. 자유도 일부 손실은 `notes` textarea 로 보상.
- **페이는 단일 텍스트로 저장 (shorthand 그대로)**: `12/20`, `오버+1`, `택 1.5` 등 파싱 시도하면 false negative 위험 큼. Phase 1은 텍스트 보존, Phase 2에서 옵셔널 파서 검토.
- **단발 공고만 Phase 1**: 표본의 90% + 빠른 검증. 장기(드라마)는 별도 양식이라 Phase 2로 분리.
- **신청 항목 체크박스**: 카톡 양식이 공고마다 미세하게 다름(`성별`, `거주지` 포함 여부 등). 작성자가 받을 정보 직접 고르는 게 현장 감각.
- **신청 흐름은 F-02 의존**: F-01 에서는 "신청하기" 버튼만 표시, 클릭 시 "로그인 필요" 안내. 로그인 후 신청 폼 채워주는 흐름은 F-02 완료 시 연결.
- **shoot_date 과거 날짜 허용**: 데이터 보정 용도(누락 공고 사후 등록) 케이스 있음. 다만 확인 모달 1회.
- **마감 자동화 보류**: 라스트 한 명 → 한 명 빠짐 → 다시 open 패턴이 잦아 자동 마감은 위험. 수동 토글만.

### 알려진 이슈·미완성
- F-01 코드 0줄. 사용자 spec 검토 + 구현 승인 대기.
- 인메모리는 새로고침/재시작 시 휘발 — 수락 기준에 명시.
- FEATURES.md §2(페르소나), §7(비기능), §8(엣지), §10(MVP 수락) 여전히 placeholder.
  → §10 은 F-01~F-04 다 정해진 뒤 한 번에 채우는 게 효율적이라 의도적 보류.

### 다음 세션 첫 단계
1. 사용자가 spec OK → 구현 시작
2. 또는 spec 수정 요청 → 반영 후 재확인

---

## 세션 기록 — 2026-06-10 (Phase 0 인프라 셋업)

### 변경 의도
사용자가 "전체 프로젝트 완성"을 요청. 하지만 FEATURES/PLAN/specs 가 거의 placeholder 상태였기에 CLAUDE.md §5·§6 에 따라 인터뷰 후 Phase 0 만 끝내는 것으로 합의.

### 변경 (파일·내용)
- `package.json` · `tsconfig.json` (strict + noUncheckedIndexedAccess) · `next.config.mjs` (typedRoutes on) · `tailwind.config.ts` (토큰 매핑) · `postcss.config.mjs` · `.eslintrc.json` · `.prettierrc.json` · `.gitignore` · `.env.example`
- `src/config/env.ts` — zod 클라/서버 분리 검증, `USE_STUBS` export
- `src/constants/theme.ts` — palette/spacing/radius/typography 토큰
- `src/lib/cn.ts` — 클래스 머지 헬퍼
- `src/components/ui/{Button,Input,Card,index}.tsx` — 토큰만 참조, focus-visible · aria-busy · 44px 터치 타깃
- `src/components/layout/ComingSoon.tsx` — Phase 0 자리표시 공용
- `src/app/{layout,page,globals.css}` — 랜딩 (엔필름 + CTA 2개 + 기능 3카드)
- `src/app/{jobs/page,jobs/new/page,login/page}.tsx` — typedRoutes 통과용 자리표시
- `vitest.config.ts` · `tests/{setup.ts,ui.button.test.tsx,config.env.test.ts}` — 스모크 테스트

### 결정 (왜 — 트레이드오프)
- **수동 셋업 > create-next-app**: 기존 .md 문서들과 충돌 회피 + 의존성 목록을 명시적으로 통제. 트레이드오프: 버전 핀 책임은 우리가 짊.
- **스텁 모드 디폴트(`USE_STUBS=true`)**: Supabase/Kakao 키 없이도 즉시 동작. service 레이어 인터페이스만 추후 교체. CLAUDE.md §3 "I/O 격리" 원칙과 맞물림.
- **eslint 8 + 레거시 config**: eslint 9 flat config 와 `eslint-config-next` 호환성 이슈 회피. 추후 마이그레이션은 별 작업.
- **typedRoutes on**: Link href 오타를 컴파일 타임에 잡음. 대가로 미존재 라우트 4개를 ComingSoon 자리표시로 만들었음 — 사용자가 첫 클릭 시 화면이 깨지지 않음.
- **next.config 의 `experimental.typedRoutes` → 최상위 `typedRoutes`**: Next 15.5 에서 stable 로 승격.
- **Pretendard 등 외부 폰트 import 보류**: 첫 빌드 가벼움 우선. system-ui 폴백 사용.

### 알려진 이슈·미완성
- `git init` 안 함 — 사용자 결정 대기 (자동 커밋 금지 원칙).
- specs/ 폴더에 `_TEMPLATE.md` 외 실제 spec 0개 — F-01~04 전부 인터뷰 후 작성 필요.
- `FEATURES.md` §2(페르소나)~§8(엣지 케이스) 여전히 placeholder — F-01 인터뷰 때 같이 채우는 게 효율적.
- 인메모리 service 구현 0줄 — Phase 1 첫 단계에서 작성.

### 다음 세션 첫 단계
1. `/build` 호출 → 세션 의식 수행
2. `AskUserQuestion` 으로 F-01 공고 올리기 spec 인터뷰
   - 필수 입력 필드 목록
   - 페이 단위(일급·회당·협의 가능)
   - 역할 카테고리(연출부·촬영부·조명부·미술부·동시녹음·헤어메이크업 등?)
   - 공고 마감일 자동 처리 여부
3. `specs/F-01-job-posting.md` 작성 후 `features/jobs/` 구현
