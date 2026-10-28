import { Device } from "@apps-in-toss/web-framework";
import { api } from "../api/client";
import { benefitAmount, clean } from "../api/format";
import type { Benefit } from "../api/types";
import { AmountRow, DdayBadge, Disclaimer, ErrorView, FinanceCard } from "../components/ui";
import { useAsync } from "../components/useAsync";

/**
 * 기업마당 요약은 "소개☞대상☞지원내용" 형태라 나눠서 보여주고,
 * 보조금24는 target/support 필드를 그대로 쓴다.
 */
function sections(b: Benefit) {
  const parts = clean(b.summary).split("☞").map((s) => s.trim());
  return {
    oneLine: parts[0],
    target: clean(b.criteria || (b.source === "보조금24" ? b.target : parts[1]) || b.target),
    support: clean(b.support || parts[2]),
  };
}

/** benefit_detail — 지원사업 상세. 뒤로가기는 토스 내비게이션 바가 맡는다 (App의 popstate로 닫힘) */
export default function DetailScreen({ benefit }: { benefit: Benefit }) {
  const { data, error, loading } = useAsync(() => api.benefitDetail(benefit.service_id, benefit.source), [benefit.service_id]);
  const b = data ?? benefit;
  const s = sections(b);
  const amount = benefitAmount(b);

  return (
    <section className="screen detail">
      <header className="detail-header">
        <DdayBadge benefit={b} />
        <h1 className="detail-title">{b.name}</h1>
        {s.oneLine && <p className="detail-lead">{s.oneLine}</p>}
      </header>

      {error && <ErrorView message={error} />}

      <div className={loading ? "detail-body is-loading" : "detail-body"}>
        {amount && <FinanceCard label="지원 금액" value={amount.amount} desc={amount.prefix ? `${amount.prefix} 기준 · 자세한 금액은 아래에서 확인하세요` : "자세한 금액은 아래에서 확인하세요"} />}

        <div className="rows">
          <AmountRow label="신청 기간" value={b.apply_period} />
          <AmountRow label="소관 기관" value={b.agency} />
          {b.exec_agency && <AmountRow label="수행 기관" value={b.exec_agency} />}
          <AmountRow label="분야" value={b.category} />
          <AmountRow label="출처" value={b.source} />
        </div>

        <DetailBlock title="누가 받을 수 있나요?" body={s.target} />
        <DetailBlock title="무엇을 지원하나요?" body={s.support} />
        <DetailBlock title="어떻게 신청하나요?" body={clean(b.apply_method)} />
        <DetailBlock title="문의" body={clean(b.contact || b.phone)} />

        <Disclaimer />
      </div>

      <div className="bottom-cta sticky">
        <button className="btn btn-primary btn-block" onClick={() => openOriginal(b.detail_url)}>
          원문 보고 신청하기
        </button>
      </div>
    </section>
  );
}

/** 토스 WebView에서는 target="_blank"가 동작하지 않아 SDK로 기본 브라우저를 연다 (공공기관 원문 링크는 오픈 정책상 허용) */
function openOriginal(url: string) {
  Device.openURL(url).catch(() => window.open(url, "_blank", "noopener,noreferrer"));
}

function DetailBlock({ title, body }: { title: string; body?: string | null }) {
  if (!body) return null;
  return (
    <div className="block">
      <h2 className="block-title">{title}</h2>
      <p className="block-body">{body}</p>
    </div>
  );
}
