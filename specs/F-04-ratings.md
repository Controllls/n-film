# 스펙: F-04 평점·평판 시스템 (+ 신청 흐름)

> **담당 기능:** F-04 · **관련:** `FEATURES.md §5.4` · **Phase:** 1
> 본 문서는 기존 "사람 블랙리스트 관리"를 폐기하고 평점 시스템으로 대체.
> 신청 흐름이 평점의 "함께 일한 관계" 증명 근거라서 같은 문서에서 다룬다.

---

## 0. 왜 별도 스펙인가
평점은 **신뢰의 영구 데이터** 라 자격 검증·중복 방지·평균 계산·노출 위치가 한 묶음이고, 잘못 노출되면 명예훼손 위험이 있어 게이팅 규칙을 글로 못박는다.

## 1. 사용자 스토리
**감독·구인 담당자:** 신청자 명단에서 닉네임 옆 별점을 보고 누구를 부를지 빠르게 판단한다.
**스태프(구직자):** 모르는 감독·팀의 공고에서도 별점으로 신뢰도를 확인하고 신청한다.
**한 번 같이 일한 양측:** 촬영 후 서로 별점 1~5 + 한 줄 후기를 남긴다.

## 2. 진입 경로
```
공고 카드 작성자 닉네임 → 별점 표시
       클릭 → /u/[loginId] (프로필 + 받은 평점 목록)

JobCard 신청하기 (로그인 + 타인 공고) → /jobs/[id]/apply (신청 폼)
공고 작성자 → /jobs/[id]/applicants (신청자 명단 + 평점 남기기)
신청자 본인 → /me/applications (내 신청 + 작성자 평점 남기기)
```

## 3. 화면/동작 사양

### 3.1 신청 (`/jobs/[id]/apply`)
- 비로그인 → `/login` 리다이렉트
- 본인 공고면 "본인 공고에는 신청할 수 없습니다" 안내
- 마감된 공고면 "마감된 공고입니다" 안내
- 이미 신청한 공고면 "이미 신청을 제출했습니다" + 신청 내용 표시
- 공고의 `applyFields` 에 따라 입력 필드 동적 생성 (name 은 닉네임 자동, 나머지는 사용자 프로필에서 추정 채움 + 수정 가능)
- 제출 → application 저장 → "신청이 제출되었습니다" + `/jobs/[id]` 로
- **수락/거절 없음**: 작성자는 명단을 보고 카톡으로 직접 연락. 상태값은 `created` 뿐.

### 3.2 신청자 명단 (`/jobs/[id]/applicants`)
- 본인 공고 작성자만 접근 (비로그인 또는 타 사용자 → `/jobs/[id]`)
- 신청자 카드: 닉네임 + ⭐평균 (받은 평점) + 신청 데이터 표 + "평점 남기기" 버튼
- 평점 남기기 버튼은 `shootDate <= 오늘` 일 때만 활성. 그 전엔 "촬영 후 평점 가능" 비활성.
- 이미 남긴 신청자는 "수정 (별점 / 후기)" — Phase 1 에서는 1회 작성, 수정 X (단순화)

### 3.3 내 신청 (`/me/applications`)
- 로그인 사용자가 신청한 공고 목록
- 각 항목: 공고 요약 + 작성자 닉네임 + ⭐평균 + "평점 남기기" (shootDate 지난 경우만)

### 3.4 별점 폼 (모달 또는 페이지)
- 별 1~5 (1번 클릭으로 별 5개 칠해짐)
- 한 줄 후기 (선택, 최대 100자)
- 제출 → Rating 저장 → 평균 갱신 → 닉네임 옆 별점 즉시 반영

### 3.5 프로필 (`/u/[loginId]`)
- 닉네임 · 가입 유형 · ⭐평균 (N개) · 한 줄 자기소개 (선택 — 일단 미구현)
- 받은 평점 목록: 별점 · 후기 · 평가자 닉네임 · 공고 (역할/날짜) · 시점

### 3.6 JobCard 헤더 노출 변경
기존:
```
김감독 · 10분 전
```
신규:
```
김감독 ⭐4.5 (10) · 10분 전
```
- 평점 없으면 `(신규)` 표시
- 닉네임/별점은 `/u/[loginId]` 링크

## 4. 데이터 모델

```ts
type Application = {
  id: string;
  jobId: string;
  applicantId: string;
  applicantNickname: string;  // 비정규화
  data: Record<string, string>; // applyField → 입력값
  createdAt: string;
};

type Rating = {
  id: string;
  raterId: string;
  raterNickname: string;
  rateeId: string;
  rateeNickname: string;
  jobId: string;            // 어떤 공고에서 같이 일한 평가인가
  stars: number;            // 1..5 정수
  review: string | null;    // 100자 이내
  createdAt: string;
};

type RatingSummary = { average: number; count: number };
```

스토어:
- `applications.service` — Map<id, Application> + index by jobId / applicantId
- `ratings.service` — Map<id, Rating> + (raterId, rateeId, jobId) unique 키

## 5. 자격 검증 (canRate)

```
canRate(raterId, rateeId, jobId): boolean
  - raterId !== rateeId
  - jobId 존재
  - job.shootDate <= today
  - (rater 가 job 작성자 && ratee 가 그 job 의 신청자)
    OR (rater 가 그 job 의 신청자 && ratee 가 job 작성자)
  - 같은 (raterId, rateeId, jobId) 평점이 아직 없음
```

## 6. 엣지 케이스

| 상황 | 처리 |
|------|------|
| 본인 공고에 본인 신청 시도 | 폼 진입 차단 + 안내 |
| 비로그인 신청 시도 | `/login` 리다이렉트 |
| 같은 공고 중복 신청 | 차단 + 이미 신청함 표시 |
| 평점 자격 없음 (안 만난 사이) | 별점 버튼 비활성 + "함께 일한 기록이 없습니다" |
| shootDate 미래 | "촬영 후 평점 가능 (D-N)" 안내 |
| 별점만 + 후기 없음 | 통과 (후기 선택) |
| 한 줄 후기 100자 초과 | zod 차단 |

## 7. Out of Scope (이 기능 한정)

- 평점 수정·삭제 (Phase 1 단순화 — 1회 작성)
- 신청자 알림 (메일/푸시)
- 평점 신고/이의 제기
- 평점 가중치 (최근 가중 등)
- 카테고리별 별점 (시간·태도·실력 분리)
- 평점 비공개 옵션

## 8. 수락 기준

- [ ] `김정한` 로그인 → 타인 공고에서 "신청하기" → `/jobs/[id]/apply` → 폼에 닉네임 자동 + 추가 필드 채워서 제출 → `/jobs/[id]` 복귀 + 카드에 "이미 신청함" 표시
- [ ] 작성자(`경원준`) 로그인 → 자기 공고에서 "신청자 명단" 진입 → 김정한 목록 노출
- [ ] shootDate 가 오늘 또는 과거인 시드 공고에서만 "평점 남기기" 활성
- [ ] 별점 4 + 후기 "시간 잘 지키심" 제출 → 김정한 프로필에 ⭐4 (1) 표시
- [ ] JobCard 작성자 닉네임 옆에 별점 노출
- [ ] 같은 (작성자, 신청자, 공고) 조합 두 번째 별점 시도 → 차단
- [ ] 본인 공고에 "신청하기" 안 보임 (이미 F-02 통합으로 처리됨 — 유지)
