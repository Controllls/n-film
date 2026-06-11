# 프로젝트 문서 템플릿 (하네스 에디션)

> Claude Code 와 장기적으로 협업하기 위한 문서 골격.
> Anthropic 의 **컨텍스트 엔지니어링** · **하네스 엔지니어링** 가이드를 반영해 설계.
> 새 프로젝트에 이 폴더를 복사한 뒤 `{{PLACEHOLDER}}` 만 채운다.

## 왜 이렇게 생겼나 (설계 원칙)

| 원칙 | 출처 | 이 템플릿에서의 반영 |
|------|------|---------------------|
| **최소 high-signal 토큰** — 항상 로드되는 파일은 짧게 | 컨텍스트 엔지니어링 | `CLAUDE.md` 를 린(lean)하게. 200줄 미만 목표 |
| **Just-in-time 컨텍스트** — 상세는 파일 경로로 위임, 필요할 때 로드 | 컨텍스트 엔지니어링 | 상세 규칙 → `docs/conventions.md`, 경로 한정 규칙 → `.claude/rules/` |
| **적정 고도** — brittle 하드코딩도, 막연함도 아닌 중간 | 컨텍스트 엔지니어링 | 강한 휴리스틱 + 유연성. `Out of Scope` 로 경계만 못박음 |
| **세션 간 메모리 / 노트테이킹** | 하네스 · 컨텍스트 | `DEVLOG.md` = 진행 파일. 세션 시작/종료 의식 |
| **한 번에 기능 하나 + 무결성** — 테스트를 통과시키려 고치지 않기 | 하네스 | `CLAUDE.md` §5 무결성 규칙 |
| **검증 후 완료** — 실행해서 눈으로 확인 | 하네스 | `/verify` 커맨드 + DoD |
| **반복 워크플로는 슬래시 커맨드로** | best practices | `.claude/commands/*` |
| **큰 기능은 먼저 인터뷰** | best practices | §6 AskUserQuestion 사용 |

## 파일 구조

```
CLAUDE.md                     # 항상 로드되는 린 코어 (정체성·명령어·핵심규칙·세션의식·무결성·지도)
docs/conventions.md           # 상세 컨벤션 (네이밍·타입·에러·상태·테스트) — 필요할 때 읽음
.claude/rules/components.md    # UI 파일 작업 시에만 적용되는 경로 한정 규칙 (frontmatter paths)
FEATURES.md                   # 무엇을 (기능 F-NN · 수락기준)
PLAN.md                       # 언제·어떤 순서로 (Phase · 체크박스)
DEVLOG.md                     # 왜 그렇게 결정했나 + 세션 메모리(진행 파일)
specs/_TEMPLATE.md            # 복잡한 기능 상세 스펙 골격
.claude/commands/             # /plan /build /log /review /verify
```

## 사용 순서

```
1. 이 폴더를 새 프로젝트 루트로 복사
2. CLAUDE.md  §1 정체성 + §0 명령어 + §8 Out of Scope 먼저
3. FEATURES.md §1 한 줄 + §4 F-NN 목록
4. PLAN.md     Phase 0~1 만
5. 나머지는 해당 작업 들어갈 때 (specs 포함)
6. DEVLOG.md   비워두고 세션 끝에 /log
```

## 출처
- Effective context engineering for AI agents — anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Effective harnesses for long-running agents — anthropic.com/engineering/effective-harnesses-for-long-running-agents
- Claude Code best practices — anthropic.com/engineering/claude-code-best-practices
