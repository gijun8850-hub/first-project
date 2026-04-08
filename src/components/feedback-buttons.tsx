"use client";

import { useState } from "react";
import { CrowdLabel } from "@/types/recommendation";

type FeedbackButtonsProps = {
  restaurantId: number;
  sessionId: string;
};

type FeedbackResponse = {
  ok: boolean;
  persisted: boolean;
  storage?: "supabase" | "local";
};

export function FeedbackButtons({
  restaurantId,
  sessionId,
}: FeedbackButtonsProps) {
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(crowdLevel: CrowdLabel) {
    setIsPending(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantId,
          sessionId,
          crowdLevel,
        }),
      });

      const payload = (await response.json()) as FeedbackResponse | { error?: string };

      if (!response.ok) {
        setMessage("피드백 저장에 실패했습니다.");
        return;
      }

      const data = payload as FeedbackResponse;

      if (!data.persisted) {
        setMessage("피드백이 메모리 상태에만 남았습니다.");
        return;
      }

      setMessage(
        data.storage === "supabase"
          ? "피드백이 Supabase에 저장되었습니다."
          : "피드백이 로컬 파일에 저장되었습니다.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div>
      <strong>실제로 어땠나요?</strong>
      <div className="feedback-row">
        <button
          className="feedback-button"
          disabled={isPending}
          onClick={() => handleSubmit("quiet")}
          type="button"
        >
          한산했어요
        </button>
        <button
          className="feedback-button"
          disabled={isPending}
          onClick={() => handleSubmit("normal")}
          type="button"
        >
          보통이었어요
        </button>
        <button
          className="feedback-button"
          disabled={isPending}
          onClick={() => handleSubmit("busy")}
          type="button"
        >
          붐볐어요
        </button>
      </div>
      {message ? <p className="feedback-note">{message}</p> : null}
    </div>
  );
}
