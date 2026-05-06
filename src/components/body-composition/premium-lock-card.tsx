import React from "react";

export function PremiumLockCard({
  slotId,
  title,
  copy,
  onPreviewPremium,
}: {
  slotId: "period-compare" | "coach-deep-dive" | "pdf-report";
  title: string;
  copy: string;
  onPreviewPremium: () => void;
}) {
  return (
    <section className="coach-panel coach-premium-lock" data-premium-lock={slotId}>
      <span className="coach-section-label">Premium</span>
      <strong>{title}</strong>
      <p>{copy}</p>
      <button className="coach-secondary-button" onClick={onPreviewPremium} type="button">
        Premium 보기
      </button>
    </section>
  );
}
