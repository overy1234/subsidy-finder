import { useState } from "react";
import { api } from "../api/client";
import type { Profile } from "../api/types";
import { INTEREST_OPTIONS, SIDO_LIST, TARGET_OPTIONS } from "../api/types";
import { Chip } from "../components/ui";

const EMPTY: Profile = { age: null, region_sido: "", region_sigungu: "", targets: [], interests: [] };

/** set_profile — 나이·지역·대상·관심분야 저장 */
export default function ProfileScreen({ profile, onSaved }: { profile: Profile | null; onSaved: (p: Profile) => void }) {
  const [form, setForm] = useState<Profile>(profile ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (patch: Partial<Profile>) => {
    setForm((f) => ({ ...f, ...patch }));
    setSaved(false);
  };
  const toggle = (key: "targets" | "interests", value: string) =>
    update({ [key]: form[key].includes(value) ? form[key].filter((v) => v !== value) : [...form[key], value] });

  const save = async () => {
    setSaving(true);
    try {
      const p = await api.setProfile(form);
      onSaved(p);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="screen profile-form">
      <header className="screen-header">
        <h1 className="title">내 조건</h1>
        <p className="subtitle">입력한 조건으로 받을 수 있는 지원금만 골라드려요</p>
      </header>

      <div className="field">
        <label className="label" htmlFor="age">
          나이 (만)
        </label>
        <input
          id="age"
          className="input"
          type="number"
          inputMode="numeric"
          min={0}
          max={120}
          placeholder="예: 29"
          value={form.age ?? ""}
          onChange={(e) => update({ age: e.target.value === "" ? null : Number(e.target.value) })}
        />
      </div>

      <div className="field">
        <label className="label" htmlFor="sido">
          사는 곳
        </label>
        <div className="row">
          <select id="sido" className="input" value={form.region_sido} onChange={(e) => update({ region_sido: e.target.value })}>
            <option value="">시/도 선택</option>
            {SIDO_LIST.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            className="input"
            placeholder="시/군/구 (예: 강남구)"
            value={form.region_sigungu}
            onChange={(e) => update({ region_sigungu: e.target.value })}
            aria-label="시/군/구"
          />
        </div>
      </div>

      <div className="field">
        <span className="label">나는 이런 사람이에요</span>
        <div className="chips-wrap">
          {TARGET_OPTIONS.map((t) => (
            <Chip key={t} selected={form.targets.includes(t)} onClick={() => toggle("targets", t)}>
              {t}
            </Chip>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="label">관심 분야</span>
        <div className="chips-wrap">
          {INTEREST_OPTIONS.map((t) => (
            <Chip key={t} selected={form.interests.includes(t)} onClick={() => toggle("interests", t)}>
              {t}
            </Chip>
          ))}
        </div>
      </div>

      <div className="bottom-cta sticky above-nav">
        <button className="btn btn-primary btn-block" onClick={save} disabled={saving}>
          {saving ? "저장 중..." : saved ? "저장했어요 ✓" : "저장하고 맞춤 지원금 보기"}
        </button>
      </div>
    </section>
  );
}
