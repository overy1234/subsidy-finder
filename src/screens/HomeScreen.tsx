import { useState } from "react";
import { api } from "../api/client";
import type { Benefit, Profile } from "../api/types";
import { INTEREST_OPTIONS } from "../api/types";
import { BenefitList, Chip, Disclaimer, Empty, ErrorView, FinanceCard, Loading, SearchBar, Toggle } from "../components/ui";
import { useAsync, useDebounced } from "../components/useAsync";

interface Props {
  profile: Profile | null;
  onSelect: (b: Benefit) => void;
  onEditProfile: () => void;
}

/** find_benefits(맞춤) + 상단 검색창은 search_benefits(키워드) */
export default function HomeScreen({ profile, onSelect, onEditProfile }: Props) {
  const [input, setInput] = useState("");
  const [onlyOpen, setOnlyOpen] = useState(true);
  const keyword = useDebounced(input.trim(), 300);

  return (
    <section className="screen">
      <header className="screen-header">
        <h1 className="title">{profile ? "나에게 맞는 지원금" : "지원금 찾기"}</h1>
      </header>

      <SearchBar value={input} onChange={setInput} />

      {keyword ? (
        <KeywordResults keyword={keyword} onlyOpen={onlyOpen} setOnlyOpen={setOnlyOpen} onSelect={onSelect} />
      ) : (
        <MatchedList profile={profile} onlyOpen={onlyOpen} setOnlyOpen={setOnlyOpen} onSelect={onSelect} onEditProfile={onEditProfile} />
      )}
    </section>
  );
}

interface ListProps {
  onlyOpen: boolean;
  setOnlyOpen: (v: boolean) => void;
  onSelect: (b: Benefit) => void;
}

/** 검색어가 있을 때 — search_benefits */
function KeywordResults({ keyword, onlyOpen, setOnlyOpen, onSelect }: ListProps & { keyword: string }) {
  const { data, error, loading } = useAsync(() => api.searchBenefits(keyword, onlyOpen), [keyword, onlyOpen]);

  return (
    <>
      <div className="list-header">
        <span className="count">
          {loading ? "찾는 중..." : <><strong className="count-strong">'{keyword}'</strong> 검색 결과 {data?.length ?? 0}건</>}
        </span>
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
        <Empty
          title={`'${keyword}'에 맞는 지원금이 없어요`}
          desc={onlyOpen ? "'접수 중만'을 끄거나 더 짧은 키워드로 검색해보세요." : "더 짧은 키워드로 검색해보세요."}
        />
      )}
    </>
  );
}

/** 검색어가 없을 때 — find_benefits (내 조건 맞춤) */
function MatchedList({ profile, onlyOpen, setOnlyOpen, onSelect, onEditProfile }: ListProps & { profile: Profile | null; onEditProfile: () => void }) {
  const [category, setCategory] = useState("");
  const { data, error, loading } = useAsync(() => api.findBenefits({ category, onlyOpen }), [category, onlyOpen, profile]);

  const categories = profile?.interests.length ? profile.interests : INTEREST_OPTIONS;
  const summary = profile
    ? [profile.age != null ? `만 ${profile.age}세` : "", [profile.region_sido, profile.region_sigungu].filter(Boolean).join(" "), ...profile.targets]
        .filter(Boolean)
        .join(" · ")
    : "";

  return (
    <>
      <FinanceCard
        label={profile ? "지금 받을 수 있는 지원금" : "지금 신청할 수 있는 지원금"}
        value={data && !loading ? data.length : "–"}
        unit="건"
        desc={
          <button className="text-link" onClick={onEditProfile}>
            {profile ? `${summary || "조건 없음"} · 수정` : "내 조건을 입력하면 맞춤으로 골라드려요 ›"}
          </button>
        }
      />

      <div className="chips-row">
        <Chip selected={category === ""} onClick={() => setCategory("")}>
          전체
        </Chip>
        {categories.map((c) => (
          <Chip key={c} selected={category === c} onClick={() => setCategory(c)}>
            {c}
          </Chip>
        ))}
      </div>

      <div className="list-header">
        <span className="count">마감 임박순</span>
        <Toggle checked={onlyOpen} onChange={setOnlyOpen} label="접수 중만" />
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorView message={error} />
      ) : data && data.length > 0 ? (
        <BenefitList items={data} onSelect={onSelect} />
      ) : (
        <Empty title="조건에 맞는 지원금이 없어요" desc="분야를 바꾸거나 내 조건을 넓혀보세요." />
      )}
      <Disclaimer />
    </>
  );
}
