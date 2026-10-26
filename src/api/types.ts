export type Source = "보조금24" | "기업마당";

export type DeadlineStatus = "오늘마감" | "임박" | "진행중" | "상시" | "마감" | "미상";

/** 지원금봇 도구(find/search/detail/briefing)가 돌려주는 지원금 항목 */
export interface Benefit {
  service_id: string;
  name: string;
  source: Source;
  category: string;
  agency: string;
  agency_type?: string | null;
  exec_agency?: string | null;
  apply_period: string;
  target: string;
  summary: string;
  support?: string | null;
  criteria?: string | null;
  support_type?: string | null;
  apply_method?: string | null;
  contact?: string | null;
  phone?: string | null;
  hashtags?: string;
  detail_url: string;
  dday: number | null;
  deadline_status: DeadlineStatus;
}

/** set_profile 인자 */
export interface Profile {
  age: number | null;
  region_sido: string;
  region_sigungu: string;
  targets: string[];
  interests: string[];
}

/** deadline_briefing 응답 */
export interface Briefing {
  briefing_date: string;
  headline: string;
  urgent: Benefit[];
  upcoming: Benefit[];
  also_open: Benefit[];
}

export const DISCLAIMER =
  "본 정보는 보조금24·기업마당 등재 기준 주요 지원금을 안내한 것으로, 일부 지자체 사업은 등재 지연으로 누락될 수 있습니다. 신청 전 반드시 원문에서 자격요건과 신청기간을 확인하세요.";

export const SIDO_LIST = [
  "서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시", "대전광역시",
  "울산광역시", "세종특별자치시", "경기도", "강원특별자치도", "충청북도", "충청남도",
  "전북특별자치도", "전라남도", "경상북도", "경상남도", "제주특별자치도",
];

export const TARGET_OPTIONS = ["청년", "소상공인", "중소기업", "창업", "육아", "신혼", "고령", "구직", "농어업인"];

export const INTEREST_OPTIONS = ["금융", "창업", "주거", "인력", "경영", "교육", "기술", "생활안정"];
