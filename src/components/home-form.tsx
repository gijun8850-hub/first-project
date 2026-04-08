"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const DEFAULT_LOCATION = {
  label: "가천대역 주변",
  lat: 37.44864,
  lng: 127.12637,
};

export function HomeForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [groupSize, setGroupSize] = useState(2);
  const [foodCategory, setFoodCategory] = useState("korean");
  const [locationLabel, setLocationLabel] = useState(DEFAULT_LOCATION.label);
  const [coords, setCoords] = useState(DEFAULT_LOCATION);

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          label: "현재 위치",
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationLabel("현재 위치 사용 중");
      },
      () => {
        setCoords(DEFAULT_LOCATION);
        setLocationLabel(DEFAULT_LOCATION.label);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
      },
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams({
      lat: String(coords.lat),
      lng: String(coords.lng),
      groupSize: String(groupSize),
      foodCategory,
    });

    startTransition(() => {
      router.push(`/results?${params.toString()}`);
    });
  }

  return (
    <form className="picker-form picker-panel" onSubmit={handleSubmit}>
      <div className="picker-header">
        <div>
          <span className="picker-label">Lunch picker</span>
          <strong>오늘 뭐 먹지</strong>
        </div>
        <div className="picker-tags">
          <span className="picker-tag">가천대역</span>
          <span className="picker-tag">점심 기준</span>
        </div>
      </div>

      <p className="field-help">
        현재 위치, 인원 수, 음식 종류만 받습니다. 필터가 많아질수록 결정은
        다시 느려집니다.
      </p>

      <div className="field-grid">
        <div className="field field-location">
          <div className="field-topline">
            <label htmlFor="location">현재 위치</label>
            <span className="field-hint">역 주변 기본값 사용 가능</span>
          </div>
          <input id="location" readOnly value={locationLabel} />
          <button
            className="secondary-button"
            onClick={handleUseCurrentLocation}
            type="button"
          >
            현재 위치 사용
          </button>
        </div>

        <div className="field field-compact">
          <div className="field-topline">
            <label htmlFor="groupSize">인원 수</label>
            <span className="field-hint">2명~4명</span>
          </div>
          <select
            id="groupSize"
            onChange={(event) => setGroupSize(Number(event.target.value))}
            value={groupSize}
          >
            <option value={2}>2명</option>
            <option value={3}>3명</option>
            <option value={4}>4명</option>
          </select>
        </div>

        <div className="field field-compact">
          <div className="field-topline">
            <label htmlFor="foodCategory">음식 종류</label>
            <span className="field-hint">한식부터 시작 권장</span>
          </div>
          <select
            id="foodCategory"
            onChange={(event) => setFoodCategory(event.target.value)}
            value={foodCategory}
          >
            <option value="korean">한식</option>
            <option value="japanese">일식</option>
            <option value="chinese">중식</option>
            <option value="western">양식</option>
          </select>
        </div>
      </div>

      <div className="picker-footer">
        <p className="picker-note">
          지금은 가천대역 점심 흐름에 맞춘 MVP입니다.
        </p>
        <button className="primary-button" disabled={isPending} type="submit">
          {isPending ? "추천 계산 중..." : "오늘 뭐 먹지"}
        </button>
      </div>
    </form>
  );
}
