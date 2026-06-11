# docs/conventions.md — 상세 코드 컨벤션

> `CLAUDE.md §3` 에서 위임한 상세 규칙. **항상 로드되지 않는다** (컨텍스트 절약).
> 코드를 쓰기 직전, 관련 부분만 참조한다.

## 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `MemberCard.tsx` |
| 화면 파일 | kebab-case | `member-detail.tsx` |
| 훅 | camelCase, `use` prefix | `useMemberList` |
| 상수 | UPPER_SNAKE_CASE | `MAX_ITEMS` |
| 타입/인터페이스 | PascalCase | `Member` |
| DB 테이블/컬럼 | snake_case | `user_id` |
| 이벤트 핸들러 | `handle` prefix | `handleSubmit` |
| 불리언 | `is/has/can/should` | `isLoading` |

## 파일·함수 크기

- 같은 로직이 **3곳** 반복 → 공통 함수 추출
- 파일 **200줄 초과** → 분리 검토
- 함수 **50줄 초과** → 분리 검토

## 주석

- **무엇 대신 왜**. 코드가 하는 일은 이름으로, 주석은 이유·트레이드오프만.
- `// TODO:` 는 이슈 번호 필수 · `// HACK:` 는 PR 설명 필수

## 타입

- `strict: true`, 가능하면 `noUncheckedIndexedAccess: true`
- 런타임 경계(API 응답·폼)는 스키마 검증 → 타입은 추론(`z.infer` 등)

## 상태 관리 결정 트리

```
서버에서 오는 데이터? → 서버 상태 라이브러리
여러 화면 공유 UI 상태? → 글로벌 스토어
한 화면 내부? → useState
Form 입력값? → 폼 라이브러리
URL 반영? → 라우터 search params
```

## 데이터 레이어

- 모든 외부 I/O는 `lib/` 또는 `features/*/services/` 에 격리
- 서비스 함수는 **앱 타입** 반환 (DB row 그대로 노출 금지)
- 에러는 `throw` → 서버 상태 레이어가 `error` 로 노출

## 에러 처리

| 위치 | 전략 |
|------|------|
| 서비스 | `throw new Error(의미 있는 메시지)` |
| 훅 | 서버 상태 `error` 그대로 |
| 화면 | `error` 분기 → 재시도 + 사용자 메시지 |
| 전역 | Error Boundary + Logger |

## Git / 커밋

- 브랜치: `main`(보호) / `feat/*` / `fix/*` / `chore/*` / `refactor/*`
- Conventional Commits: `feat:` `fix:` `refactor:` `chore:` `docs:` `test:` `perf:`
- 커밋은 작동하는 단위로. Phase 시작 전 체크포인트 커밋.

## 환경변수

```
# .env (로컬만, .gitignore) — .env.example 은 커밋
{{PUBLIC_ 변수들}}
{{SECRET 은 서버로}}
```
- 런타임 설정은 `src/config/env.ts` 에서 스키마 검증 후 export

## 성능 / 테스트

- 무거운 계산은 메모이즈. 리스트·이미지 최적화.
- 커버리지 목표: utils 80% · 서비스 60% · 화면은 E2E
- PR 머지 전 test + lint + 타입체크 통과 필수

## Definition of Done

- [ ] 기능 작동 (실행해서 확인 — /verify)
- [ ] 타입 에러 없음 · Lint 통과
- [ ] 새 로직에 테스트 (최소 해피 패스)
- [ ] 에러·로딩 상태 처리
- [ ] PLAN.md 체크박스 갱신
- [ ] 변경 의도가 커밋 메시지에
