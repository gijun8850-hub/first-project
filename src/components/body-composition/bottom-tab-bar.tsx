import React from "react";
import type { BodyCompositionRoute } from "@/types/body-composition";

const TAB_ITEMS: Array<{ view: BodyCompositionRoute; label: string }> = [
  { view: "home", label: "홈" },
  { view: "progress", label: "진행" },
  { view: "history", label: "기록" },
  { view: "coach", label: "코치" },
];

export function BottomTabBar({
  currentView,
  onChangeView,
}: {
  currentView: BodyCompositionRoute;
  onChangeView: (view: BodyCompositionRoute) => void;
}) {
  return (
    <nav className="coach-bottom-tabs" data-bottom-tabs="true">
      {TAB_ITEMS.map((item) => {
        const isActive = item.view === currentView;

        return (
          <button
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "coach-bottom-tab coach-bottom-tab-active"
                : "coach-bottom-tab"
            }
            data-tab-target={item.view}
            key={item.view}
            onClick={() => onChangeView(item.view)}
            type="button"
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
