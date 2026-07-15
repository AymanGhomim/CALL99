import { useState } from "react";
import { Star } from "lucide-react";
import type { ProviderReview } from "../../types/entities";
import { useTranslation } from "react-i18next";

export default function ProviderReviewsCard({ reviews, onViewAll }: { reviews: ProviderReview[]; onViewAll?: () => void }) {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const visibleReviews = showAll ? reviews : reviews.slice(0, 2);

  const toggleReviews = () => {
    setShowAll((current) => !current);
    onViewAll?.();
  };

  return (
    <div className="mb-6 rounded-xl border border-[#f2e8e8] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-[#221b1b]">
          {t("provider.recentReviews")}
        </h3>

        <button
          type="button"
          onClick={toggleReviews}
          className="text-sm font-bold text-[#75262d] hover:underline"
        >
          {t(showAll ? "provider.showLess" : "provider.showAll")}
        </button>
      </div>

      <div className="space-y-5">
        {visibleReviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-[#f2e8e8] pb-5 text-left last:border-b-0 last:pb-0"
          >
            <div className="flex items-center justify-start gap-2">
              <h4 className="font-extrabold text-[#221b1b]">{review.name}</h4>
              <span className="text-xs text-gray-400">{review.date}</span>
            </div>

            <div className="mt-1.5 flex items-center justify-start gap-0.5 text-amber-400">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  size={13}
                  fill={index < review.rating ? "currentColor" : "none"}
                  strokeWidth={index < review.rating ? 0 : 1.5}
                  className={index < review.rating ? "" : "text-gray-300"}
                />
              ))}
            </div>

            <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
