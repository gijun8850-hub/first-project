import React from "react";

type LandingScreenProps = {
  onEnterDashboard: () => void;
};

export function LandingScreen({ onEnterDashboard }: LandingScreenProps) {
  return (
    <section
      className="coach-home-screen"
      data-home-theme="gym"
      data-home-tone="shared"
      data-screen="landing"
    >
      <button
        className="coach-home-entry coach-panel"
        data-action="enter-dashboard"
        onClick={onEnterDashboard}
        type="button"
      >
        <span className="coach-home-mark" aria-hidden="true" />
        <strong>주간체크</strong>
        <span className="coach-home-hint">눌러서 시작하기</span>
      </button>
    </section>
  );
}
