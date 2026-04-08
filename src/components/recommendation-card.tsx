import { FeedbackButtons } from "@/components/feedback-buttons";
import { Recommendation } from "@/types/recommendation";

type RecommendationCardProps = {
  item: Recommendation;
  rank: number;
  sessionId: string;
};

export function RecommendationCard({
  item,
  rank,
  sessionId,
}: RecommendationCardProps) {
  return (
    <article className="restaurant-card">
      <div className="restaurant-top">
        <div>
          <h2>{item.name}</h2>
          <p className="card-subline">
            {item.categoryLabel} · 도보 {item.walkMinutes}분 · {formatPrice(item)}
          </p>
        </div>
        <div className="card-top-right">
          <span className={`status-pill status-${item.seatabilityLabel}`}>
            {toCrowdText(item.seatabilityLabel)}
          </span>
          <div className="rank-badge">{rank}</div>
        </div>
      </div>

      <p className="reason">{item.reason}</p>

      <div className="meta-row">
        <span className="chip">좌석 적합도 {item.seatabilityScore}</span>
        <span className="chip">2~4명 점심 기준</span>
        <span className="chip">{item.distanceMeters}m 이동</span>
      </div>

      <div className="feedback-panel">
        <FeedbackButtons restaurantId={item.restaurantId} sessionId={sessionId} />
      </div>
    </article>
  );
}

function formatPrice(item: Recommendation) {
  if (item.priceMin == null || item.priceMax == null) {
    return "가격 정보 없음";
  }

  return `${item.priceMin.toLocaleString("ko-KR")}원~${item.priceMax.toLocaleString(
    "ko-KR",
  )}원`;
}

function toCrowdText(label: Recommendation["seatabilityLabel"]) {
  if (label === "quiet") {
    return "한산";
  }

  if (label === "normal") {
    return "보통";
  }

  return "붐빔";
}
