# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개요

`subsidy-finder`(지원금 찾기)는 **앱인토스(Apps in Toss)** 웹 미니앱입니다(React 19 + TypeScript + Vite, `@apps-in-toss/web-framework`). 사용자 조건에 맞는 정부·지자체 지원금(보조금24, 기업마당)을 찾아 줍니다. UI 문구와 코드 주석은 한국어로 쓰고, 사용자에게 보이는 문구는 해요체를 씁니다.

## 명령어

```bash
npm run dev       # Vite 개발 서버 (5173 포트, 앱인토스 devtools 플러그인 포함)
npm run build     # tsc -b && vite build && ait build  (타입 검사가 빌드에 포함됨)
npm run lint      # oxlint
npm run deploy    # ait deploy
```

테스트 러너는 설정되어 있지 않습니다. 플랫폼 설정(앱 이름, 브랜드 색상, 권한, `webBundleDir: dist`)은 `apps-in-toss.config.ts`에서 관리합니다. 미리보기 실행 설정은 `../.claude/launch.json`에 있습니다(이름 `subsidy-finder`, 상위 폴더 `C:\apptoss`에서 실행).

## 아키텍처

**API 계층은 지원금봇 MCP 도구와 1:1로 대응합니다.** `src/api/client.ts`의 `BenefitApi`는 PlayMCP 지원금봇 도구 5개(`set_profile`, `find_benefits`, `search_benefits`, `benefit_detail`, `deadline_briefing`)에 각각 대응하는 메서드를 가집니다. `src/api/types.ts`의 필드 이름(`service_id`, `apply_period`, `deadline_status` 등)은 도구 응답 형식인 snake_case를 그대로 유지합니다. camelCase로 바꾸지 마세요.

**목업/원격 구현은 환경 변수로 결정됩니다.** `VITE_API_BASE_URL`이 설정되어 있으면 `api`는 `createRemoteApi(...)`이고, 없으면 `mockApi`입니다.
- 원격: `POST {base}/tools/{tool_name}`, 요청 본문은 도구 인자 JSON, 응답은 도구 결과 JSON입니다.
- 목업: `src/api/mockData.ts`의 `MOCK_BENEFITS`(2026-10-21에 받은 실제 지원금봇 응답)를 거르면서 도구 동작을 로컬에서 흉내 냅니다. 지역·대상·나이 필터(`matchesProfile`), 여러 단어를 AND로 묶는 키워드 검색, 마감순 정렬, 250ms 인위적 지연이 들어 있습니다. 샘플의 마감일이 고정되어 있어서 시간이 지나면 많은 항목이 "마감"으로 표시됩니다.

**마감 상태는 저장하지 않고 계산합니다.** 원본 항목에는 `dday`/`deadline_status`가 없습니다. `withDeadline()`이 형식이 자유로운 `apply_period` 문자열(`2026-10-13 ~ 2026-10-21`, `2026.05.04~2026.05.20`)에서 마지막 날짜를 뽑아 오늘 기준으로 계산합니다. 날짜가 없으면 `상시`(상시/소진 문구가 있을 때) 또는 `미상`으로 처리합니다. 상태 값은 오늘마감 / 임박(7일 이내) / 진행중 / 상시 / 마감 / 미상입니다.

**프로필**은 두 구현 모두 `localStorage`(`subsidy-finder:profile`)에 저장합니다. 저장소를 쓸 수 없는 환경에서도 동작하도록 접근 코드를 try/catch로 감쌉니다. 프로필 상태는 `App.tsx`가 들고 있다가 화면에 내려줍니다.

**화면 이동**에는 라우터가 없습니다. `App.tsx`가 상태값으로 탭 화면 4개(맞춤/검색/마감임박/내 조건)를 전환합니다. 지원금 상세를 열 때 `history.pushState`를 호출하고 `popstate` 리스너로 닫기 때문에, 기기나 토스의 뒤로가기 버튼으로 목록에 돌아갈 수 있습니다. 덮어쓰는 화면을 새로 추가할 때도 이 방식을 따르세요.

**공용 UI와 훅:** `src/components/ui.tsx`에 재사용 컴포넌트(`BenefitCard`/`BenefitList`, `DdayBadge`, `FinanceCard`, `Highlight`, `Disclaimer`, 로딩/빈 결과/오류 화면)가 있습니다. `src/components/useAsync.ts`는 `useAsync(fn, deps)`(화면에서 `api.*`를 호출할 때 사용)와 `useDebounced`를 제공합니다. `src/api/format.ts`는 HTML 엔티티를 정리하고 대표 금액(예: "월 최대 150만원")을 뽑습니다. 보조금24 항목은 `support`에서, 기업마당 항목은 `summary`를 `☞`로 나눈 세 번째 부분에서 금액을 찾습니다.

지원금 목록을 보여주는 화면에는 `types.ts`의 `DISCLAIMER`를 함께 표시하세요.
