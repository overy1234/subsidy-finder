/** HTML 엔티티와 줄바꿈 정리 */
export function clean(text?: string | null) {
  return (text ?? "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\r\n/g, "\n")
    .trim();
}

/** 지원금의 대표 금액 — 보조금24는 support, 기업마당은 요약의 지원내용 부분에서 찾는다 */
export function benefitAmount(b: { support?: string | null; summary: string }) {
  return extractAmount(b.support || b.summary.split("☞")[2] || b.summary);
}

/**
 * 지원내용 텍스트에서 대표 금액 하나를 뽑는다.
 * 예: "인건비(1인당 월 최대 150만원)" → { prefix: "월 최대", amount: "150만원" }
 */
export function extractAmount(text?: string | null): { prefix: string; amount: string } | null {
  const m = clean(text).match(/((?:연|월|1인당|업체당)?\s*(?:최대|최고)?)\s*([\d,]+(?:\.\d+)?\s*(?:억|천만|백만|만)?\s*원)/);
  if (!m) return null;
  return { prefix: m[1].trim(), amount: m[2].replace(/\s+/g, "") };
}
