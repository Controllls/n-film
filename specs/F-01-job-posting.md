# 스펙: F-01 공고 올리기 (단발/1일 촬영)

> **담당 기능:** F-01 · **관련:** `FEATURES.md §5.1` · **Phase:** 1

---

## 0. 왜 별도 스펙인가
카톡방 표본 분석 결과 **현장에는 강한 양식 컨벤션**이 있고, 본 플랫폼의 차별화는 "카톡방 흩어진 공고를 한 곳에 모음 + 필터/정렬 가능". 구조화 필드 + 카톡 양식 자동 조립의 균형이 필요해 별도 스펙으로 고정.

## 1. 사용자 스토리
**구인 담당자 (감독·연출부장 등):** 카톡에 적던 양식과 똑같은 감각으로 공고를 등록하고, 시스템이 같은 모양으로 보여주길 원한다.
**구직자 (스태프):** 카톡방 스크롤 대신 역할·날짜·페이로 필터해 내게 맞는 공고만 본다.

## 2. 진입 경로
```
랜딩(/) → "공고 올리기" → /jobs/new
랜딩(/) → "공고 보기" → /jobs (피드: 양식 전체 + 인라인 신청)
                          ↳ 공유용 단독 링크 /jobs/[id] (카드 하나 그대로)
```
**원칙:** 카톡방 스크롤 감각. 상세 페이지로 들어가는 클릭 단계 없음.

## 3. 화면/동작 사양

### 3.1 `/jobs/new` 등록 폼

| 필드 | 타입 | 필수 | 비고 |
|------|------|:---:|------|
| `role` 역할/팀 | select | ✅ | 연출부 · 촬영부 · 조명부 · 그립 · 미술/아트팀 · 동시녹음 · 헤어메이크업 · 의상 · 제작부 · 데이터매니저 · 스크립터 · 기타 |
| `shoot_date` 촬영 날짜 | date | ✅ | YYYY-MM-DD, 과거 날짜 경고 (등록은 허용) |
| `headcount` 인원 | number | ✅ | 1~99 |
| `gender_pref` 성별 선호 | radio | ⬜ | 무관(기본) · 남 · 여 |
| `pay` 페이 | text | ✅ | 카톡 shorthand 그대로. placeholder `예: 12/20 오버 +1` |
| `transport` 교통비 | text | ⬜ | placeholder `예: 편도 3만, 택 왕복 3` |
| `call_time` 콜타임/집합 | text | ✅ | 시간 표기 자유 `예: 0500, 오전 5시, 미정` |
| `location` 집합 장소 | text | ✅ | `예: 남양주 뭉클스튜디오` |
| `end_time` 예상 종료 | text | ⬜ | `예: 밤 11시 예상` |
| `notes` 추가 메모 | textarea | ⬜ | 우대 조건·픽업 정보 등 자유 |
| `apply_fields` 받을 정보 | checkbox 그룹 | ✅(최소 1) | 성함(고정 on, 끄기 불가) · 나이 · 성별 · 연락처 · 경력 · 거주지 · 신체조건 · 운전면허 · 자유메모 |

### 3.2 자동 조립 미리보기 (등록 폼 우측/하단)

```
[{role} 구인]
날짜 : {M/D}
인원 : {headcount}명[ ({gender_pref})]
페이 : {pay}[ / {transport}]
콜타임 : {call_time} {location}
[종료 : {end_time}]
[{notes 각 줄 "- " 프리픽스}]

{apply_fields join " / "} 부탁드립니다
```

- 미리보기는 입력하면서 실시간 갱신
- 등록 직전 "이 모양으로 올릴게요" 확인 박스 1회 노출

### 3.3 `/jobs` 피드 — **메인 화면. 양식 전체가 한 번에 보인다.**

```
┌─────────────────────────────────────────────────────┐
│ [필터칩: 전체 · 연출부 · 촬영부 · 미술 · 내일만 · 마감제외]    │
│ [정렬: 촬영일 임박순 ▾]                               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ [연출부 구인]                  D-1  모집중 · 김감독·10분전 │
│ 날짜 : 6/11                                          │
│ 인원 : 1명 (남자)                                     │
│ 페이 : 12/20 오버 +1 / 택 왕복 3                       │
│ 콜타임 : 0500 남양주 뭉클스튜디오                       │
│ 종료 : 밤 11시 예상                                   │
│ - 운전면허 소지자 우대                                 │
│ - 동부권 거주 우선                                    │
│                                                     │
│ 성함 / 나이 / 경력 / 연락처 부탁드립니다                  │
│                                                     │
│ [공유]  [신청하기 →]                                  │
└─────────────────────────────────────────────────────┘
   (다음 공고가 바로 아래 같은 모양으로)
```

- **카드 = 자동 조립 양식 전체**. 클릭해서 들어가는 상세 페이지 없음.
- 카드 우상단: D-day(촬영일 기준) · 상태 배지(모집중/마감) · 작성자 · 등록 경과 시간
- 카드 우하단 액션:
  - 타인 공고: `[공유]` (URL 복사) · `[신청하기]`
  - 본인 공고: `[공유]` · `[수정]` · `[마감/재오픈]` · `[삭제]`
- "신청하기" 클릭 (Phase 1):
  - 비로그인 → "로그인이 필요합니다" 토스트 + `/login` 이동
  - 로그인 후 흐름은 F-02 에서 연결 (인라인 모달 또는 시트)
- 필터: 역할(다중 칩) · 날짜 범위 · "내일만" 빠른칩 · 마감 제외 토글 (기본 on)
- 정렬: 촬영일 임박순(기본) · 등록 최신순
- 페이지네이션: 무한 스크롤(20개 단위)
- 빈 상태: "조건에 맞는 공고가 없습니다" + 필터 초기화 버튼

### 3.4 `/jobs/[id]` — 공유용 단독 페이지

- 피드의 카드 **한 개를 그대로** 단독으로 표시 (별도 디자인 없음)
- 존재 이유: 카카오톡·문자로 링크 보낼 때 미리보기·딥링크용
- 상단에 "← 전체 공고 보기" 링크만 추가

## 4. 데이터 모델

```ts
// features/jobs/types.ts
type Role =
  | "directing" | "camera" | "lighting" | "grip" | "art"
  | "sound" | "makeup" | "costume" | "production"
  | "data" | "script" | "etc";

type GenderPref = "any" | "male" | "female";

type ApplyField =
  | "name" | "age" | "gender" | "contact" | "career"
  | "address" | "physical" | "license" | "note";

type Job = {
  id: string;                  // ulid
  role: Role;
  shootDate: string;           // ISO date "2026-06-11"
  headcount: number;           // 1..99
  genderPref: GenderPref;
  pay: string;                 // free text shorthand
  transport: string | null;
  callTime: string;
  location: string;
  endTime: string | null;
  notes: string | null;
  applyFields: ApplyField[];   // 최소 ["name"]
  status: "open" | "closed";
  authorId: string;
  authorName: string;          // 비정규화 (목록 빠르게)
  createdAt: string;           // ISO
};
```

```ts
// 인메모리 스토어 (Phase 1)
const jobs = new Map<string, Job>();
```

향후 Supabase 전환 시:
```sql
create table jobs (
  id text primary key,
  role text not null,
  shoot_date date not null,
  headcount int not null check (headcount between 1 and 99),
  gender_pref text not null default 'any',
  pay text not null,
  transport text,
  call_time text not null,
  location text not null,
  end_time text,
  notes text,
  apply_fields text[] not null,
  status text not null default 'open',
  author_id uuid not null references auth.users(id),
  author_name text not null,
  created_at timestamptz not null default now()
);
create index jobs_shoot_date_idx on jobs(shoot_date) where status = 'open';
```

## 5. 입출력 / 상태

| 입력 | 검증 (zod) | 결과 |
|------|----------|------|
| 빈 필수 필드 | 한국어 에러 메시지 inline | 등록 거부 |
| `headcount < 1` | "인원은 1 이상이어야 합니다" | 거부 |
| `apply_fields = []` | "성함은 기본 포함됩니다" — 자동 보정 | 보정 후 통과 |
| `shoot_date < 오늘` | "지난 날짜로 등록합니다" 확인 모달 | 사용자 OK 시 통과 |

상태:
- 로딩: 폼 제출 중 → 버튼 `isLoading`, 다른 입력 비활성
- 에러: service 에러 메시지 토스트 + 폼 유지
- 성공: `/jobs/[id]` 로 라우팅
- 빈 상태(목록): 위 3.3 참조

## 6. 엣지 케이스

| 상황 | 처리 |
|------|------|
| 동일 채팅방처럼 반복 등록 (같은 작성자, 같은 날짜) | 막지 않음. 다만 등록 직전 "같은 날짜 공고가 있어요" 인포만 노출 |
| 마감 후 사람 빠짐 (라스트 한 명) | 작성자가 `status` 토글로 다시 open 가능 |
| 인원 다 채워졌지만 마감 안 누름 | Phase 1 스코프 밖. 수동 마감만. (자동 마감은 F-04 이후 검토) |
| 페이 텍스트가 비정상적으로 김 | 100자 제한 |
| 미리보기에 markdown/HTML 의심 문자 | 텍스트만 표시 (이스케이프) |

## 7. Out of Scope (이 기능 한정)

- 장기 공고(드라마/장편) — Phase 2
- 신청 흐름 자체 — F-02 의존
- 알림(푸시·메일) — Phase 2+
- 사진/포스터 업로드
- 페이 shorthand 자동 파싱(`12/20` → 금액 객체) — Phase 2 검토. Phase 1은 텍스트로만 저장·표시
- 수정 이력 추적

## 8. 수락 기준

- [ ] 빈 폼 제출 시 모든 필수 필드에 한국어 에러 표시
- [ ] 양식대로 입력 → 미리보기가 카톡 양식과 시각적으로 동일 (역할·날짜·인원·페이·콜타임·장소·신청항목 라인 포함)
- [ ] 등록 후 `/jobs` 피드 최상단에 **양식 전체가 그대로** 노출 (요약 아님)
- [ ] 피드의 카드 클릭으로 페이지 이동 없음 — 신청 버튼이 카드 안에 인라인
- [ ] `/jobs/[id]` 새로고침 시 동일 데이터 유지 (인메모리 휘발은 알려진 한계 — DEVLOG에 명시)
- [ ] 마감 토글 후 카드에 "마감" 배지 + 신청 버튼 비활성
- [ ] 본인 공고가 아닌 경우 "신청하기" 버튼이 보이되 클릭 시 "로그인이 필요합니다" 안내
- [ ] 역할 다중 필터 적용 시 URL search param 반영 (`?role=directing,camera`)
- [ ] 공유 버튼 → `/jobs/[id]` URL 클립보드 복사
- [ ] Playwright: 등록 → 피드 노출 → 마감 토글 → 신청 버튼 비활성 전체 시나리오 통과
