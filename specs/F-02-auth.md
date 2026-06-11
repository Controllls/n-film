# 스펙: F-02 카카오톡 소셜로그인 (스텁) + F-03 초대 링크 가입

> **담당 기능:** F-02 + F-03 통합 · **관련:** `FEATURES.md §5.2-5.3` · **Phase:** 1
> 두 기능을 함께 다루는 이유: 사용자 결정 "시작부터 진짜 흐름". 가입 게이팅이 없으면 F-02 만으로는 신뢰형 플랫폼 검증이 안 됨.

---

## 0. 왜 별도 스펙인가
"지인 추천만 가입"이 본 제품의 신뢰 기반(=차별점). 가입 게이팅과 로그인이 동일 데이터 모델(`users`, `invites`)을 공유하기에 별도 스펙으로 묶음.

## 1. 사용자 스토리
**기존 회원:** 카카오 한 번으로 빠르게 로그인하고 공고를 올린다.
**신규 사용자 (지인 추천):** 친구에게 받은 초대 링크를 누르면 가입 폼이 열리고, 동의 후 가입하면 자동 로그인된다.
**신규 사용자 (직접 진입):** "초대 링크가 필요합니다" 안내를 받고 가까운 회원에게 요청한다.

## 2. 진입 경로
```
랜딩(/) 헤더 "로그인" → /login → 카카오로 시작 (스텁) → 이름 입력
   ↳ 매칭 user 있음 → 로그인 완료 → 이전 페이지
   ↳ 매칭 user 없음 → "초대 링크가 필요합니다" 안내

회원이 카톡 공유 → /invite/[token]
   ↳ 토큰 유효 → 가입 폼 (약관 동의 → 기본/추가 정보 → 가입)
   ↳ 토큰 만료/사용됨/없음 → 에러 화면

로그인 상태 헤더 아바타 → /me (마이페이지) → 초대 발급 / 로그아웃
```

## 3. 화면/동작 사양

### 3.1 `/login` — 카카오 로그인 (스텁)
- 큰 노란 "카카오로 시작" 버튼 (실제 카카오 색상)
- 클릭 → 이름 입력 한 필드 노출 → "로그인" 버튼
- 매칭 user 발견 → session.store 에 currentUser 저장 → `router.back()` 또는 `/jobs`
- 매칭 없음 → 인라인 안내 "초대 링크가 필요합니다. 가까운 엔필름 회원에게 받아주세요."
- (스텁 안내 박스) "실제 카카오 OAuth 는 키 발급 후 같은 인터페이스로 교체됩니다."

### 3.2 `/invite/[token]` — 초대 검증 + 가입 폼
- 토큰 만료/사용됨/없음 → 에러 카드 + "홈으로"
- 유효 토큰 → SignupForm 표시. 헤더에 "○○○ 님이 초대했어요" 표기

#### SignupForm 단계
1. **약관 동의 박스** — 이용약관 + 개인정보 처리방침 두 스크롤 박스 + 동의 체크 두 개
2. **기본 정보 (필수)**
   - 이름
   - 이메일
   - 아이디 (영문 시작, 영문/숫자/_/- 3~20자) — 로그인 식별자 (스텁에서는 닉네임이 식별자라 후순위 검증)
   - 닉네임 (실시간 중복 체크)
3. **추가 정보 (선택)**
   - 전화번호
   - 홈페이지 (포트폴리오 링크 자리)
   - 생일 (년/월/일)
4. **가입 유형**: 개인회원 / 사업자회원 (단순 저장. Phase 1 권한 차이 없음 — CLAUDE.md §8 "역할 권한 세분화" Out of Scope)
5. **성별**: 남 / 여 / 미선택
6. **알림 설정**: 메일링 수신 예 / 아니오
7. 제출 → user 생성 + invite 토큰 used 처리 + 자동 로그인 → `/jobs`

### 3.3 `/me` — 마이페이지
- 프로필 카드 (닉네임 · 가입 유형 · 가입일)
- 초대 링크 발급 카드: "초대 링크 발급" 버튼 → 토큰 생성 → URL 표시 + "복사" 버튼
- 내가 가진 초대 토큰 목록 (만료/사용 상태 표시)
- 내 공고 목록 (간단)
- 로그아웃 버튼

### 3.4 헤더 통합 (`MobileShell`)
- 비로그인: "로그인" 링크
- 로그인: 닉네임 + 작은 아바타 동그라미 → 클릭 시 `/me`

## 4. 데이터 모델

```ts
type UserKind = "personal" | "business";
type Gender = "male" | "female" | "unspecified";
type NotifyEmail = "yes" | "no";

type User = {
  id: string;
  loginId: string;       // 아이디 (소문자)
  nickname: string;      // 닉네임 (표시명)
  name: string;
  email: string;
  phone: string | null;
  homepage: string | null;
  birth: string | null;  // YYYY-MM-DD
  kind: UserKind;
  gender: Gender;
  notifyEmail: NotifyEmail;
  agreedTermsAt: string;     // ISO
  agreedPrivacyAt: string;   // ISO
  createdAt: string;
  invitedById: string | null;
};

type InviteToken = {
  token: string;            // 22자 ulid 풍
  issuedById: string;
  issuedAt: string;
  expiresAt: string;        // +7일
  usedById: string | null;
  usedAt: string | null;
};

type Session = {
  currentUserId: string | null;
};
```

스토어:
- `users.service` — Map<id, User> + index by loginId/nickname (중복 체크)
- `invites.service` — Map<token, InviteToken>
- `session.store` (Zustand persist localStorage) — `{ currentUserId }`

시드:
- F-01 시드 공고의 작성자 3명(`김정한`, `경원준`, `KHJ`)을 user 로 등록. 닉네임 = 그 이름.
- 시드 공고의 `authorName` 은 그대로 두되, 시드 시 user.id 를 알아내 공고의 `authorId` 에 매핑.

## 5. 입출력 / 상태

| 입력 | 검증 (zod) | 결과 |
|------|----------|------|
| 약관/개인정보 미동의 | 인라인 에러 | 제출 차단 |
| 아이디 형식 오류 | "영문 시작, 영문/숫자/_/- 3~20자" | 차단 |
| 닉네임 중복 | 입력 디바운스 후 "이미 사용 중인 닉네임입니다" | 차단 |
| 이메일 형식 오류 | 표준 zod email | 차단 |
| 토큰 만료/사용됨 | 에러 화면 | 가입 불가 |

상태:
- 닉네임 중복 체크: 디바운스 300ms, 별도 query
- 가입 제출: pending 시 버튼 isLoading
- 토큰 검증: useInviteToken query (enabled by token)

## 6. 엣지 케이스

| 상황 | 처리 |
|------|------|
| 같은 브라우저 다중 로그인 시도 | 마지막 로그인만 유지 (계정 전환은 §8 Out of Scope, 로그아웃 후 재로그인) |
| 자기가 발급한 토큰으로 자기가 가입 시도 | 가능 (같은 user 로 다시 만들지는 않음 — loginId 중복으로 차단) |
| 만료된 토큰 클릭 | 에러 카드 + "토큰을 발급한 분에게 다시 요청해주세요" |
| 사용된 토큰 재클릭 | 동일 에러 |
| 비로그인 상태에서 `/me` 접근 | `/login` 리다이렉트 |
| Zustand persist 의 localStorage 가 잠금/disabled | 세션은 휘발 — 새로고침 시 로그아웃 (graceful) |
| 시드 사용자(김정한 등) 로 누가 가입 시도 | 이미 존재 — 로그인하라 안내 |

## 7. Out of Scope (이 기능 한정)

- 비밀번호 (스텁이라 닉네임만으로 로그인) — 실연동 시 카카오 OAuth 로 대체
- 2단계 인증, 본인인증, 사업자 인증, 영화인(KOBIS) 인증 — CLAUDE.md §8
- 계정 전환, 다중 세션 — §8
- 이메일 검증 메일 — Phase 2+
- 비밀번호 재설정 — 비밀번호 자체가 없음
- 회원 탈퇴 흐름의 데이터 보존 정책 — Phase 2+ (현재는 그냥 store 에서 삭제)

## 8. 수락 기준

- [ ] 비로그인 → `/login` → 시드 이름("김정한") 입력 → 로그인 성공 → 헤더에 닉네임 표시
- [ ] 신규 이름 → "초대 링크가 필요합니다" 안내
- [ ] 로그인 상태 → `/me` → "초대 링크 발급" 클릭 → URL 노출 + 클립보드 복사
- [ ] 발급된 URL 새 시크릿창에서 열면 가입 폼 표시, 헤더에 발급자 닉네임
- [ ] 약관/개인정보 미동의 시 제출 차단
- [ ] 닉네임 중복("김정한") 입력 시 인라인 에러
- [ ] 가입 완료 후 자동 로그인 + `/jobs` 이동
- [ ] 같은 토큰 재클릭 시 "이미 사용된 초대" 에러
- [ ] 로그아웃 → 헤더 "로그인" 으로 복귀
- [ ] 시드 사용자("김정한")로 로그인 후 그 사람이 쓴 공고에 "수정 / 마감 / 삭제" 버튼 노출, 타인 공고는 "신청하기"(여전히 alert) 만
- [ ] localStorage 영속: 새로고침 후에도 로그인 유지
