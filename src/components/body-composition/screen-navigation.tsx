import React from "react";
import type { BodyCompositionRoute } from "@/types/body-composition";

type ScreenNavigationProps = {
  currentView: BodyCompositionRoute;
  onChangeView: (view: BodyCompositionRoute) => void;
};

const NAV_ITEMS: Array<{
  view: BodyCompositionRoute;
  label: string;
  description: string;
}> = [
  {
    view: "home",
    label: "홈",
    description: "연속 체크인과 상태",
  },
  {
    view: "progress",
    label: "진행",
    description: "그래프와 목표 변화",
  },
  {
    view: "history",
    label: "기록",
    description: "체크인 목록과 수정",
  },
  {
    view: "coach",
    label: "코치",
    description: "이번 주 해석과 액션",
  },
];

export function ScreenNavigation({
  currentView,
  onChangeView,
}: ScreenNavigationProps) {
  return (
    <nav
      className="coach-screen-nav"
      data-home-nav={currentView === "home" ? "true" : undefined}
      data-screen-nav="true"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = item.view === currentView;

        return (
          <button
            aria-current={isActive ? "page" : undefined}
            className={`coach-screen-nav-item ${
              isActive ? "coach-screen-nav-item-active" : ""
            }`}
            data-nav-target={item.view}
            key={item.view}
            onClick={() => onChangeView(item.view)}
            type="button"
          >
            <strong>{item.label}</strong>
            <span>{item.description}</span>
          </button>
        );
      })}
    </nav>
  );
}
