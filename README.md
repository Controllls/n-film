# 엔필름 (n-film)

> 촬영 현장 인력 구인구직 웹 서비스.
> 감독이 필요한 인원을 필요할 때마다 공고로 올리고, 일이 필요한 사람은 공고에 신청한다.

카톡방에 흩어진 단발 촬영 공고를 한 곳에 모으는 게 목표. 양식은 현장 컨벤션 그대로 쓰고,
지인 추천 기반 가입과 평점·평판으로 모르는 사이에서도 신뢰 판단이 가능하도록 설계했다.

---

## 누구를 위한 서비스인가

- **감독 / 구인 담당자** — 필요한 역할·인원·일정으로 공고를 올리고 신청자를 받는다.
- **촬영 기술 인력** — 공고 피드에서 조건을 보고 바로 신청한다.

---

## 핵심 기능 (MVP)

| ID | 기능 | 설명 |
|----|------|------|
| F-01 | **공고 올리기** | 구조화 폼 입력 → 자동 조립 미리보기 → 등록 |
| F-02 | **카카오 소셜 로그인** | 카카오 OAuth (Phase 1 은 스텁, 키 발급 후 동일 인터페이스로 교체) |
| F-03 | **지인 추천 가입** | 기존 회원의 초대 토큰 없이는 가입 불가 (신뢰형 가입) |
| F-04 | **평점·평판 시스템** | 함께 일한 양측이 별점 1~5 + 한 줄 후기를 남김 |

## 화면 구성

| 경로 | 화면 | 설명 |
|------|------|------|
| `/` | 랜딩 | 브랜드 + CTA + 기능 카드 |
| `/jobs` | 공고 피드 (메인) | 양식 전체 카드 + 인라인 신청 · 필터 · 정렬 |
| `/jobs/[id]` | 공고 공유 링크 | 카드 하나 그대로 (공유·딥링크용) |
| `/jobs/new` | 공고 등록 | 구조화 폼 + 자동 조립 미리보기 |
| `/login` | 로그인 | 카카오 로그인 |
| `/invite/[token]` | 초대 가입 | 토큰 검증 후 가입 폼 |
| `/me` | 마이페이지 | 내 공고 · 초대 링크 발급 |

---

## 기술 스택

| 레이어 | 선택 |
|--------|------|
| Frontend | Next.js (App Router) |
| Language | TypeScript (strict) |
| State (client) | Zustand |
| State (server) | TanStack Query v5 |
| Backend | Route Handlers + Supabase |
| DB | PostgreSQL |
| Forms | React Hook Form + Zod |
| Styling | Tailwind CSS |
| Testing | Vitest + RTL + Playwright |

> Phase 1 은 외부 서비스 없이 **인메모리 스텁**으로 동작한다 (`NEXT_PUBLIC_USE_STUBS=true`).

---

## 시작하기

```bash
npm install        # 의존성 설치
cp .env.example .env.local   # 환경변수 (스텁 모드는 값 비워도 동작)
npm run dev        # 개발 서버
```

기타 명령:

```bash
npm test           # 테스트
npm run lint       # 린트
npx tsc --noEmit   # 타입체크
```

환경변수는 `.env.example` 참고. 실제 키는 `.env.local` 에 넣으며 커밋되지 않는다.

---

## 프로젝트 문서

| 파일 | 내용 |
|------|------|
| `CLAUDE.md` | 핵심 규칙 (정체성·스택·컨벤션·세션 의식) |
| `FEATURES.md` | 기능 명세 (F-NN · 수락기준) |
| `PLAN.md` | 작업 순서 (Phase · 체크박스) |
| `DEVLOG.md` | 결정 이유 + 세션 메모리 |
| `specs/*.md` | 기능별 상세 동작 |
| `docs/conventions.md` | 상세 코딩 컨벤션 |

---

## 부록 — 문서 구조를 이렇게 만든 이유

이 저장소의 문서 골격(`CLAUDE.md` · `FEATURES.md` · `PLAN.md` · `DEVLOG.md` · `specs/` · `.claude/`)은
**Claude Code 와 장기적으로 협업하기 위한 템플릿**을 기반으로 한다.
Anthropic 의 컨텍스트 엔지니어링 · 하네스 엔지니어링 가이드를 반영해 설계했다.

| 원칙 | 반영 |
|------|------|
| **최소 high-signal 토큰** — 항상 로드되는 파일은 짧게 | `CLAUDE.md` 를 린하게 유지 |
| **Just-in-time 컨텍스트** — 상세는 필요할 때 로드 | 상세 규칙 → `docs/`, 경로 한정 규칙 → `.claude/rules/` |
| **적정 고도** — 강한 휴리스틱 + 유연성 | `Out of Scope` 로 경계만 못박음 |
| **세션 간 메모리** | `DEVLOG.md` = 진행 파일, 세션 시작/종료 의식 |
| **한 번에 기능 하나 + 무결성** | `CLAUDE.md §5` 무결성 규칙 |
| **검증 후 완료** | `/verify` 커맨드 + 수락기준 |
| **반복 워크플로는 슬래시 커맨드로** | `.claude/commands/*` |

참고:
- Effective context engineering for AI agents — anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Effective harnesses for long-running agents — anthropic.com/engineering/effective-harnesses-for-long-running-agents
- Claude Code best practices — anthropic.com/engineering/claude-code-best-practices
