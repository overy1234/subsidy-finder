---
version: alpha
name: Naver Inspired Korean Design System
description: "Green-first Korean portal utility. Dense content grids, rounded search, service tiles."
colors:
  primary: "#03C75A"
  secondary: "#111111"
  neutral: "#FFFFFF"
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
    textColor: "#111111"
    rounded: "{rounded.md}"
    padding: 24px
---

## Overview

Naver style balances high-density information surfaces with a friendly green accent and modular cards. Best for search portals, content hubs, and local utility dashboards.

This is an independent design-system analysis based on publicly observable Korean digital product patterns. It is for inspiration and AI coding guidance only, and is not affiliated with or endorsed by Naver.

## Colors

- **Naver Green (#03C75A)**: Primary CTA, search focus, success accents
- **Ink (#111111)**: Headlines and primary text
- **Canvas (#FFFFFF)**: Main page background
- **Soft Mint (#E9F8F0)**: Utility highlights and service chips
- **Line (#E5E8EB)**: Card dividers and input borders

## Typography

- **display**: 56px · 800 · -2px — 검색에서 시작되는 모든 것
- **title**: 24px · 700 · -0.4px — 오늘의 인기 서비스
- **body**: 16px · 500 · 1.6 — 정보를 빠르게 찾고 비교합니다.

## Layout

Use a mobile-first layout with generous vertical rhythm, strong content grouping, and card surfaces that reflect the Naver inspired visual language.

## Components

- **SearchBar**: 화면 최상단을 가로지르는 둥근 검색창. 좌우 여백을 최소로 두고 폭을 최대한 넓혀, 검색이 이 서비스의 출발점임을 첫 화면에서 드러낸다.
- **ServiceTile**: 아이콘과 짧은 라벨을 세로로 쌓은 정사각 타일. 4열 또는 5열 그리드로 묶어 서비스 진입점을 한 화면에 모은다.
- **NewsCard**: 썸네일 좌측, 제목 2줄, 출처와 시간을 회색 소문자로 붙인 목록형 카드. 구분선 하나로만 나눠 스크롤 밀도를 유지한다.

## Do's and Don'ts

**Do** use the palette, spacing, and component rhythm as a starting point.  
**Do** adapt the system to your own brand name and assets.  
**Don't** copy logos, proprietary illustrations, trademarked slogans, or exact production screens.  
**Don't** imply affiliation with Naver.

요청: $ARGUMENTS
