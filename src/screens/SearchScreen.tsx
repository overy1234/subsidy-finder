import { useState } from "react";
import { api } from "../api/client";
import type { Benefit } from "../api/types";
import { BenefitList, Chip, Disclaimer, Empty, ErrorView, Loading, SearchBar, Toggle } from "../components/ui";
import { useAsync, useDebounced } from "../components/useAsync";

const SUGGESTIONS = ["청년", "소상공인", "창업", "임차료", "인턴", "심리상담", "농업인", "이자"];

/** search_benefits — 키워드 검색 (내 조건과 무관) */
export default function SearchScreen({ onSelect }: { onSelect: (b: Benefit) => void }) {
  const [input, setInput] = useState("");
  const [onlyOpen, setOnlyOpen] = useState(true);
  const keyword = useDebounced(input.trim(), 300);

  return (
    <section className="screen">
      <header className="screen-header">
        <h1 className="title">지원금 검색</h1>
      </header>

      <SearchBar value={input} onChange={setInput} placeholder="예: 청년, 소상공인, 창업" />

      <div className="chips-row">
        {SUGGESTIONS.map((s) => (
          <Chip key={s} selected={keyword === s} onClick={() => setInput(s)}>
            {s}
          </Chip>
        ))}
      </div>

      {keyword ? (
        <SearchResults keyword={keyword} onlyOpen={onlyOpen} setOnlyOpen={setOnlyOpen} onSelect={onSelect} />
      ) : (
        <Empty title="찾고 싶은 지원금을 검색해보세요" desc="짧은 키워드 하나로 검색하면 더 잘 찾아요." />
      )}
    </section>
  );
}

function SearchResults({
  keyword,
  onlyOpen,
  setOnlyOpen,
  onSelect,
}: {
  keyword: string;
  onlyOpen: boolean;
  setOnlyOpen: (v: boolean) => void;
  onSelect: (b: Benefit) => void;
}) {
  const { data, error, loading } = useAsync(() => api.searchBenefits(keyword, onlyOpen), [keyword, onlyOpen]);
  return (
    <>
      <div className="list-header">
        <span className="count">{data ? `'${keyword}' 검색 결과 ${data.length}건` : " "}</span>
        <Toggle checked={onlyOpen} onChange={setOnlyOpen} label="접수 중만" />
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorView message={error} />
      ) : data && data.length > 0 ? (
        <>
          <BenefitList items={data} onSelect={onSelect} highlight={keyword} />
          <Disclaimer />
        </>
      ) : (
        <Empty title="검색 결과가 없어요" desc="다른 키워드로 검색하거나 '접수 중만'을 꺼보세요." />
      )}
    </>
  );
}
