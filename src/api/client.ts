import { MOCK_BENEFITS } from "./mockData";
import type { Benefit, Briefing, DeadlineStatus, Profile, Source } from "./types";

/** 지원금봇 MCP 도구 5개와 1:1로 대응하는 앱 API */
export interface BenefitApi {
  setProfile(profile: Profile): Promise<Profile>;
  findBenefits(opts: { category?: string; onlyOpen?: boolean }): Promise<Benefit[]>;
  searchBenefits(keyword: string, onlyOpen?: boolean): Promise<Benefit[]>;
  benefitDetail(serviceId: string, source: Source): Promise<Benefit>;
  deadlineBriefing(days?: number): Promise<Briefing>;
}

const PROFILE_KEY = "subsidy-finder:profile";

export function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

function saveProfile(profile: Profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // 저장소를 쓸 수 없는 환경에서는 메모리 상태만 유지
  }
}

// ---------- 공통 유틸 ----------

function today(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** "2026-10-13 ~ 2026-10-21", "2026.05.04~2026.05.20" 같은 기간에서 마감 D-day를 계산 */
export function withDeadline<T extends Omit<Benefit, "dday" | "deadline_status">>(b: T): Benefit {
  const dates = b.apply_period.match(/\d{4}[.-]\d{2}[.-]\d{2}/g);
  let dday: number | null = null;
  let status: DeadlineStatus;
  if (dates && dates.length > 0) {
    const end = new Date(dates[dates.length - 1].replace(/\./g, "-") + "T00:00:00");
    dday = Math.round((end.getTime() - today().getTime()) / 86_400_000);
    status = dday < 0 ? "마감" : dday === 0 ? "오늘마감" : dday <= 7 ? "임박" : "진행중";
  } else if (/상시|소진/.test(b.apply_period)) {
    status = "상시";
  } else {
    status = "미상";
  }
  return { ...b, dday, deadline_status: status };
}

function byDeadline(a: Benefit, b: Benefit) {
  const da = a.dday ?? Number.POSITIVE_INFINITY;
  const db = b.dday ?? Number.POSITIVE_INFINITY;
  return da - db;
}

const isOpen = (b: Benefit) => b.deadline_status !== "마감";

function haystack(b: Pick<Benefit, "name" | "target" | "hashtags" | "agency" | "exec_agency" | "summary" | "category">) {
  return [b.name, b.target, b.hashtags, b.agency, b.exec_agency, b.summary, b.category].join(" ");
}

/** "서울특별시" → "서울", "전북특별자치도" → "전북", "충청북도" → "충북" */
export function shortSido(sido: string) {
  const special: Record<string, string> = {
    충청북도: "충북", 충청남도: "충남", 전라북도: "전북", 전라남도: "전남", 경상북도: "경북", 경상남도: "경남",
  };
  if (special[sido]) return special[sido];
  if (sido.startsWith("전북")) return "전북";
  return sido.replace(/(특별자치시|특별자치도|특별시|광역시|도)$/, "");
}

const ALL_SIDO_SHORT = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

/** 프로필(지역·대상·나이)로 거르기 — 지원금봇 find_benefits의 동작을 흉내낸 로컬 버전 */
function matchesProfile(b: Benefit, p: Profile) {
  const text = haystack(b);
  if (p.region_sido) {
    const mine = shortSido(p.region_sido);
    const regions = ALL_SIDO_SHORT.filter((r) => text.includes(r));
    const national = b.agency_type === "중앙행정기관" && regions.length === 0;
    if (!national && regions.length > 0 && !regions.includes(mine)) return false;
  }
  if (p.age != null && /청년/.test(b.name) && p.age > 45) return false;
  if (p.targets.length > 0 && !p.targets.some((t) => text.includes(t))) return false;
  return true;
}

const delay = <T,>(value: T) => new Promise<T>((r) => setTimeout(() => r(value), 250));

// ---------- 목업 구현 (PlayMCP 응답 샘플 기반) ----------

const mockApi: BenefitApi = {
  async setProfile(profile) {
    saveProfile(profile);
    return delay(profile);
  },

  async findBenefits({ category = "", onlyOpen = true }) {
    const profile = loadProfile();
    const list = MOCK_BENEFITS.map(withDeadline)
      .filter((b) => (onlyOpen ? isOpen(b) : true))
      .filter((b) => (profile ? matchesProfile(b, profile) : true))
      .filter((b) => (category ? haystack(b).includes(category) : true))
      .sort(byDeadline);
    return delay(list);
  },

  async searchBenefits(keyword, onlyOpen = true) {
    // 여러 단어면 모두 포함된 것만 (AND), 영문은 대소문자 무시
    const tokens = keyword.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const list = MOCK_BENEFITS.map(withDeadline)
      .filter((b) => (onlyOpen ? isOpen(b) : true))
      .filter((b) => {
        const text = [haystack(b), b.support, b.criteria].join(" ").toLowerCase();
        return tokens.every((t) => text.includes(t));
      })
      .sort(byDeadline);
    return delay(list);
  },

  async benefitDetail(serviceId) {
    const found = MOCK_BENEFITS.find((b) => b.service_id === serviceId);
    if (!found) throw new Error("지원금 정보를 찾을 수 없어요.");
    return delay(withDeadline(found));
  },

  async deadlineBriefing(days = 14) {
    const profile = loadProfile();
    const open = MOCK_BENEFITS.map(withDeadline)
      .filter(isOpen)
      .filter((b) => (profile ? matchesProfile(b, profile) : true))
      .sort(byDeadline);
    const urgent = open.filter((b) => b.dday != null && b.dday <= 7 && b.dday <= days);
    const upcoming = open.filter((b) => b.dday != null && b.dday > 7 && b.dday <= days);
    const also_open = open.filter((b) => b.deadline_status === "상시");
    const total = urgent.length + upcoming.length;
    return delay({
      briefing_date: today().toLocaleDateString("sv-SE"), // 로컬 기준 YYYY-MM-DD
      headline: total > 0 ? `마감 임박 지원금 ${total}건 (D-${days} 이내)` : `D-${days} 이내 마감 지원금이 없어요`,
      urgent,
      upcoming,
      also_open,
    });
  },
};

// ---------- 원격 구현 ----------
// VITE_API_BASE_URL을 설정하면, 지원금봇 도구를 그대로 감싼 백엔드로 요청한다.
// 엔드포인트: POST {base}/tools/{tool_name}  body = 도구 인자(JSON), 응답 = 도구 결과(JSON)

function createRemoteApi(base: string): BenefitApi {
  async function call<T>(tool: string, args: Record<string, unknown>): Promise<T> {
    const res = await fetch(`${base}/tools/${tool}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args),
    });
    if (!res.ok) throw new Error(`요청에 실패했어요 (${res.status})`);
    return res.json() as Promise<T>;
  }
  return {
    async setProfile(profile) {
      saveProfile(profile);
      await call("set_profile", { ...profile });
      return profile;
    },
    async findBenefits({ category = "", onlyOpen = true }) {
      const r = await call<{ benefits: Benefit[] }>("find_benefits", { category, only_open: onlyOpen });
      return r.benefits;
    },
    async searchBenefits(keyword, onlyOpen = true) {
      const r = await call<{ benefits: Benefit[] }>("search_benefits", { keyword, only_open: onlyOpen });
      return r.benefits;
    },
    benefitDetail(serviceId, source) {
      return call<Benefit>("benefit_detail", { service_id: serviceId, source });
    },
    deadlineBriefing(days = 14) {
      return call<Briefing>("deadline_briefing", { days });
    },
  };
}

const base = import.meta.env.VITE_API_BASE_URL as string | undefined;

export const api: BenefitApi = base ? createRemoteApi(base) : mockApi;
export const isMock = !base;
