"use client";

import { useEffect, useState } from "react";
import { Recommendation, RecommendResponse } from "@/types/recommendation";
import { LoadingState } from "@/components/loading-state";
import { RecommendationCard } from "@/components/recommendation-card";

type ResultsClientProps = {
  lat: number;
  lng: number;
  groupSize: number;
  foodCategory: string;
};

export function ResultsClient({
  lat,
  lng,
  groupSize,
  foodCategory,
}: ResultsClientProps) {
  const [items, setItems] = useState<Recommendation[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [storage, setStorage] = useState<RecommendResponse["storage"]>("local");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadRecommendations() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lat,
            lng,
            groupSize,
            foodCategory,
          }),
        });

        const payload = (await response.json()) as RecommendResponse | { error?: string };

        if (!response.ok) {
          throw new Error(
            "error" in payload
              ? payload.error ?? "추천을 불러오지 못했습니다."
              : "추천을 불러오지 못했습니다.",
          );
        }

        const data = payload as RecommendResponse;

        if (!active) {
          return;
        }

        setItems(data.recommendations);
        setSessionId(data.sessionId);
        setStorage(data.storage);
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "추천을 불러오는 중 문제가 발생했습니다.",
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadRecommendations();

    return () => {
      active = false;
    };
  }, [foodCategory, groupSize, lat, lng]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <section className="empty-state">
        <strong>추천을 불러오지 못했습니다.</strong>
        <p className="subtle">{error}</p>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="empty-state">
        <strong>조건에 맞는 식당이 부족합니다.</strong>
        <p className="subtle">
          필터를 바꾸거나 음식 종류를 넓혀서 다시 시도해 주십시오.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="results-context">
        <span className="results-context-label">저장 위치</span>
        <strong>{storage === "supabase" ? "Supabase" : "로컬 파일"}</strong>
        <p className="subtle">
          이번 추천 요청은{" "}
          {storage === "supabase" ? "원격 DB" : ".local-data"}에 기록됩니다.
        </p>
      </section>

      <section className="card-grid">
        {items.map((item, index) => (
          <RecommendationCard
            item={item}
            key={item.restaurantId}
            rank={index + 1}
            sessionId={sessionId}
          />
        ))}
      </section>
    </>
  );
}
