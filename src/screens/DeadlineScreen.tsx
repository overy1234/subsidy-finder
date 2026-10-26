import { useState } from "react";
import { api } from "../api/client";
import type { Benefit } from "../api/types";
import { BenefitList, Chip, Disclaimer, Empty, ErrorView, FinanceCard, Loading } from "../components/ui";
import { useAsync } from "../components/useAsync";

const DAY_OPTIONS = [7, 14, 30];

/** deadline_briefing — 마감 임박 브리핑 */
export default function DeadlineScreen({ onSelect }: { onSelect: (b: Benefit) => void }) {
  const [days, setDays] = useState(14);
  const { data, error, loading } = useAsync(() => api.deadlineBriefing(days), [days]);

  return (
    <section className="screen">
      <header className="screen-header">
        <h1 className="title">마감 임박</h1>
        <p className="subtitle">놓치기 전에 확인하세요</p>
      </header>

      <div className="chips-row">
        {DAY_OPTIONS.map((d) => (
          <Chip key={d} selected={days === d} onClick={() => setDays(d)}>
            {d}일 이내
          </Chip>
        ))}
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorView message={error} />
      ) : data ? (
        <>
          <FinanceCard
            tone="ink"
            label={`${data.briefing_date} 브리핑 · ${days}일 이내`}
            value={data.urgent.length + data.upcoming.length}
            unit="건 마감 예정"
            desc={data.urgent.length > 0 ? `이번 주 안에 ${data.urgent.length}건이 마감돼요` : "이번 주 안에 마감되는 건 없어요"}
          />

          {data.urgent.length > 0 && (
            <>
              <h2 className="section-title">⏰ 7일 안에 마감</h2>
              <BenefitList items={data.urgent} onSelect={onSelect} />
            </>
          )}

          {data.upcoming.length > 0 && (
            <>
              <h2 className="section-title">다가오는 마감</h2>
              {data.urgent.length === 0 && <p className="hint">7일 내 마감은 없지만 곧 다가오는 마감이에요.</p>}
              <BenefitList items={data.upcoming} onSelect={onSelect} />
            </>
          )}

          {data.also_open.length > 0 && (
            <>
              <h2 className="section-title">언제든 신청 가능 (상시 접수)</h2>
              <BenefitList items={data.also_open} onSelect={onSelect} />
            </>
          )}

          {data.urgent.length + data.upcoming.length + data.also_open.length === 0 && (
            <Empty title="마감이 다가오는 지원금이 없어요" desc="기간을 늘려서 확인해보세요." />
          )}
          <Disclaimer />
        </>
      ) : null}
    </section>
  );
}
