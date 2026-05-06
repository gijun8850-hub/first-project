"use client";

import React, { useEffect, useState } from "react";
import {
  BODY_COMPOSITION_AD_ROTATION_MS,
  buildAdRailViewModel,
  getNextAdSlotIndex,
} from "@/lib/body-composition/monetization";
import type {
  BodyCompositionAdSlot,
  BodyCompositionPlan,
} from "@/types/body-composition";

export function AdRail({
  plan,
  slots,
}: {
  plan: BodyCompositionPlan;
  slots: BodyCompositionAdSlot[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [plan, slots.length]);

  useEffect(() => {
    if (plan === "premium" || slots.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => getNextAdSlotIndex(current, slots.length));
    }, BODY_COMPOSITION_AD_ROTATION_MS);

    return () => window.clearInterval(timer);
  }, [plan, slots.length]);

  const viewModel = buildAdRailViewModel({ plan, activeIndex, slots });

  if (viewModel.mode === "premium") {
    return (
      <section className="coach-ad-rail coach-ad-rail-premium" data-ad-rail="premium">
        <div className="coach-ad-status">
          <span className="coach-section-label">Premium</span>
          <strong>{viewModel.title}</strong>
          <p>{viewModel.copy}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="coach-ad-rail coach-ad-rail-free"
      data-ad-rail="free"
      data-ad-slot={viewModel.slot.id}
    >
      <span className="coach-section-label">스폰서 추천</span>
      {viewModel.slot.embedHtml ? (
        <div
          className="coach-ad-slot"
          dangerouslySetInnerHTML={{ __html: viewModel.slot.embedHtml }}
        />
      ) : (
        <a className="coach-ad-fallback" data-ad-fallback="true" href={viewModel.slot.href}>
          <strong>{viewModel.slot.fallbackTitle}</strong>
          <span>{viewModel.slot.fallbackCopy}</span>
        </a>
      )}
    </section>
  );
}
