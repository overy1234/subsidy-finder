---
name: tossdesign
description: 토스풍(Toss Inspired) 한국형 디자인 시스템으로 화면·컴포넌트를 만들거나 고칠 때 사용. "토스 디자인", "토스 스타일", "토스풍"으로 바꿔 달라는 요청이나 흰 바탕·파란 강조의 미니멀한 모바일 금융 UI가 필요할 때 적용한다.
argument-hint: [만들거나 고칠 화면/컴포넌트 설명]
---

# Toss Inspired Korean Design System

Minimal mobile-first fintech. White canvas, confident blue, clear hierarchy.

## Design tokens

```yaml
version: alpha
name: Toss Inspired Korean Design System
colors:
  primary: "#0064FF"
  secondary: "#191F28"
  neutral: "#F2F4F6"
typography:
  display:
    fontFamily: Pretendard
    fontSize: 3.5rem
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  body:
    fontFamily: Pretendard
    fontSize: 1rem
    fontWeight: 500
    lineHeight: 1.6
rounded:
  sm: 8px
  md: 16px
  lg: 28px
spacing:
  sm: 8px
  md: 16px
  lg: 28px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.lg}"
    padding: 14px
  card:
    backgroundColor: "{colors.neutral}"
    textColor: "#191F28"
    rounded: "{rounded.md}"
    padding: 24px
```

## Overview

Toss style removes decoration and emphasizes trust, speed, and mobile clarity. Best for finance, onboarding, subscriptions, and account dashboards.

This is an independent design-system analysis based on publicly observable Korean digital product patterns. It is for inspiration and AI coding guidance only, and is not affiliated with or endorsed by Toss.

## Colors

- **Toss Blue (#0064FF)**: Primary action and link color
- **Ink (#191F28)**: Core text
- **Gray 700 (#4E5968)**: Secondary explanations
- **Gray 100 (#F2F4F6)**: Section background
- **White (#FFFFFF)**: Default canvas

## Typography

- **display**: 56px · 800 · -2px — 금융을 더 쉽게
- **title**: 24px · 700 · -0.4px — 필요한 정보만 선명하게
- **body**: 16px · 500 · 1.6 — 복잡한 절차를 한 화면에서 끝냅니다.

## Layout

Use a mobile-first layout with generous vertical rhythm, strong content grouping, and card surfaces that reflect the Toss inspired visual language.

## Components

- **FinanceCard**: 금액을 가장 크게, 설명을 그 아래 회색으로 두는 카드. 한 카드에 숫자 하나만 담아 금융 화면 특유의 판단 부담을 줄인다.
- **BlueCTA**: 화면 하단에 고정되는 파란 버튼. 한 화면에 하나만 두고 나머지 행동은 텍스트 링크로 낮춰 다음 단계를 헷갈리지 않게 한다.
- **AmountRow**: 항목명을 왼쪽, 금액을 오른쪽 끝에 정렬한 한 줄. 숫자를 우측 정렬하고 고정폭으로 처리해 자릿수가 달라도 세로선이 맞는다.

## Do's and Don'ts

**Do** use the palette, spacing, and component rhythm as a starting point.  
**Do** adapt the system to your own brand name and assets.  
**Don't** copy logos, proprietary illustrations, trademarked slogans, or exact production screens.  
**Don't** imply affiliation with Toss.

요청: $ARGUMENTS
