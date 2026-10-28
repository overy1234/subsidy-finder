import { useEffect, useState } from "react";
import "./App.css";
import { loadProfile } from "./api/client";
import type { Benefit, Profile } from "./api/types";
import DeadlineScreen from "./screens/DeadlineScreen";
import DetailScreen from "./screens/DetailScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SearchScreen from "./screens/SearchScreen";

type Tab = "home" | "search" | "deadline" | "profile";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "home", label: "맞춤", icon: "M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z" },
  { key: "search", label: "검색", icon: "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm9 16l-4-4" },
  { key: "deadline", label: "마감임박", icon: "M12 7v5l3 2M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z" },
  { key: "profile", label: "내 조건", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 9a7 7 0 0 1 14 0" },
];

function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [detail, setDetail] = useState<Benefit | null>(null);
  const [profile, setProfile] = useState<Profile | null>(() => loadProfile());

  // 상세 화면은 history에 쌓아서 기기/앱 뒤로가기로 닫히게 한다
  useEffect(() => {
    const onPop = () => setDetail(null);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const openDetail = (b: Benefit) => {
    history.pushState({ detail: b.service_id }, "");
    setDetail(b);
    window.scrollTo(0, 0);
  };
  const goTab = (t: Tab) => {
    setTab(t);
    window.scrollTo(0, 0);
  };

  if (detail) {
    return (
      <main className="app">
        <DetailScreen benefit={detail} />
      </main>
    );
  }

  return (
    <main className="app has-nav">
      {tab === "home" && <HomeScreen profile={profile} onSelect={openDetail} onEditProfile={() => goTab("profile")} />}
      {tab === "search" && <SearchScreen onSelect={openDetail} />}
      {tab === "deadline" && <DeadlineScreen onSelect={openDetail} />}
      {tab === "profile" && (
        <ProfileScreen
          profile={profile}
          onSaved={(p) => {
            setProfile(p);
            goTab("home");
          }}
        />
      )}

      <nav className="tabbar" aria-label="메뉴">
        {TABS.map((t) => (
          <button key={t.key} className={`tab ${tab === t.key ? "tab-on" : ""}`} onClick={() => goTab(t.key)} aria-current={tab === t.key ? "page" : undefined}>
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d={t.icon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}

export default App;
