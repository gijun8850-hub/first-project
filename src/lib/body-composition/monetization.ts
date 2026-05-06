import type {
  AdRailViewModel,
  BodyCompositionAdSlot,
  BodyCompositionPlan,
} from "@/types/body-composition";

export const BODY_COMPOSITION_AD_ROTATION_MS = 8000;

export const BODY_COMPOSITION_AD_SLOTS: BodyCompositionAdSlot[] = [
  {
    id: "protein-01",
    sponsor: "Protein Lab",
    embedHtml:
      '<a class="coach-ad-link" href="https://example.com/protein-lab" target="_blank" rel="noreferrer"><strong>Protein Lab Whey</strong><span>운동 직후 회복용 24g 단백질</span></a>',
    fallbackTitle: "Protein Lab Whey",
    fallbackCopy: "운동 직후 회복용 24g 단백질",
    href: "https://example.com/protein-lab",
  },
  {
    id: "inbody-01",
    sponsor: "Fit Measure",
    embedHtml:
      '<a class="coach-ad-link" href="https://example.com/fit-measure" target="_blank" rel="noreferrer"><strong>주간 인바디 이용권</strong><span>체성분 리포트와 측정권 묶음</span></a>',
    fallbackTitle: "주간 인바디 이용권",
    fallbackCopy: "체성분 리포트와 측정권 묶음",
    href: "https://example.com/fit-measure",
  },
];

const FALLBACK_AD_SLOT: BodyCompositionAdSlot = {
  id: "fallback",
  sponsor: "Weekly Check",
  embedHtml: "",
  fallbackTitle: "추천 슬롯 준비 중",
  fallbackCopy: "보충제, 측정권, 운동 루틴 추천이 이 자리에 표시됩니다.",
  href: "#",
};

export function getNextAdSlotIndex(currentIndex: number, slotCount: number) {
  if (slotCount <= 1) {
    return 0;
  }

  return (currentIndex + 1) % slotCount;
}

export function buildAdRailViewModel({
  plan,
  activeIndex,
  slots,
}: {
  plan: BodyCompositionPlan;
  activeIndex: number;
  slots: BodyCompositionAdSlot[];
}): AdRailViewModel {
  if (plan === "premium") {
    return {
      mode: "premium",
      title: "Premium 활성화됨",
      copy: "광고 없이 코치 해석과 비교 기능을 더 깊게 볼 수 있습니다.",
    };
  }

  const slot = slots[activeIndex] ?? slots[0] ?? FALLBACK_AD_SLOT;

  return {
    mode: "free",
    title: "스폰서 추천",
    copy: slot.fallbackCopy,
    slot,
  };
}
