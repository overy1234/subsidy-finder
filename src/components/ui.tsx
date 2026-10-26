import type { ReactNode } from "react";
import { benefitAmount } from "../api/format";
import type { Benefit } from "../api/types";
import { DISCLAIMER } from "../api/types";

export function DdayBadge({ benefit }: { benefit: Benefit }) {
  const { dday, deadline_status: status } = benefit;
  let label: string = status;
  let tone = "grey";
  if (status === "오늘마감") {
    label = "오늘 마감";
    tone = "red";
  } else if (dday != null && dday > 0) {
    label = `D-${dday}`;
    tone = dday <= 3 ? "red" : dday <= 7 ? "orange" : "blue";
  } else if (status === "상시") {
    label = "상시";
    tone = "green";
  } else if (status === "마감") {
    label = "마감";
  }
  return <span className={`badge badge-${tone}`}>{label}</span>;
}

/** 검색어에 해당하는 부분을 강조 */
export function Highlight({ text, keyword }: { text: string; keyword?: string }) {
  const tokens = (keyword ?? "").trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return <>{text}</>;
  const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "g"));
  return (
    <>
      {parts.map((p, i) => (tokens.includes(p) ? <mark key={i}>{p}</mark> : p))}
    </>
  );
}

export function BenefitCard({ benefit, onClick, highlight }: { benefit: Benefit; onClick: () => void; highlight?: string }) {
  const amount = benefitAmount(benefit);
  return (
    <button className="card" onClick={onClick}>
      <div className="card-top">
        <DdayBadge benefit={benefit} />
        <span className="card-meta">{benefit.exec_agency || benefit.agency}</span>
      </div>
      <p className="card-title">
        <Highlight text={benefit.name} keyword={highlight} />
      </p>
      {amount && (
        <p className="card-amount">
          {amount.prefix && <span className="card-amount-prefix">{amount.prefix}</span>}
          {amount.amount}
        </p>
      )}
    </button>
  );
}

export function BenefitList({ items, onSelect, highlight }: { items: Benefit[]; onSelect: (b: Benefit) => void; highlight?: string }) {
  return (
    <div className="list">
      {items.map((b) => (
        <BenefitCard key={b.service_id} benefit={b} onClick={() => onSelect(b)} highlight={highlight} />
      ))}
    </div>
  );
}

/** 돋보기 아이콘 + 입력 + 지우기 버튼 */
export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "지원금·기관·키워드 검색",
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}) {
  return (
    <form
      className="searchbar"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        (document.activeElement as HTMLElement | null)?.blur();
        onSubmit?.();
      }}
    >
      <svg className="searchbar-icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm9 16l-4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        className="searchbar-input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        enterKeyHint="search"
        aria-label="검색어"
      />
      {value && (
        <button type="button" className="searchbar-clear" onClick={() => onChange("")} aria-label="검색어 지우기">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="currentColor" />
            <path d="M9 9l6 6M15 9l-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </form>
  );
}

/** 숫자 하나를 가장 크게, 설명은 아래 회색으로 */
export function FinanceCard({ label, value, unit, desc, tone }: { label: string; value: ReactNode; unit?: string; desc?: ReactNode; tone?: "blue" | "ink" }) {
  return (
    <div className={`finance-card ${tone === "ink" ? "finance-ink" : ""}`}>
      <p className="finance-label">{label}</p>
      <p className="finance-value">
        {value}
        {unit && <span className="finance-unit">{unit}</span>}
      </p>
      {desc && <p className="finance-desc">{desc}</p>}
    </div>
  );
}

/** 항목명은 왼쪽, 값은 오른쪽 끝 정렬 */
export function AmountRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="amount-row">
      <span className="amount-label">{label}</span>
      <span className="amount-value">{value}</span>
    </div>
  );
}

export function Chip({ selected, onClick, children }: { selected?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button className={`chip ${selected ? "chip-on" : ""}`} onClick={onClick} aria-pressed={selected}>
      {children}
    </button>
  );
}

export function Loading() {
  return (
    <div className="list">
      {[0, 1, 2].map((i) => (
        <div key={i} className="card skeleton" />
      ))}
    </div>
  );
}

export function Empty({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <p className="empty-title">{title}</p>
      {desc && <p className="empty-desc">{desc}</p>}
      {action}
    </div>
  );
}

export function ErrorView({ message }: { message: string }) {
  return <Empty title="불러오지 못했어요" desc={message} />;
}

export function Disclaimer() {
  return <p className="disclaimer">{DISCLAIMER}</p>;
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle-track" />
      <span>{label}</span>
    </label>
  );
}
