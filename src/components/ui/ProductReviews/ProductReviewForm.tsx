import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import api from "../../../services/api";
import toast from "react-hot-toast";
import "./productReviewForm.css";

interface Props {
  productId: number;
  onReviewSubmitted?: () => void;
}

export default function ProductReviewForm({
  productId,
  onReviewSubmitted,
}: Props) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="review-message">
        <p className="review-message__text">
          You must be logged in to leave a review.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0 || comment.trim() === "") {
      toast.error("Please provide a rating and comment");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post("/api/reviews", {
        product_id: productId,
        rating,
        comment: comment.trim(),
      });

      toast.success("Review sent!");
      setRating(0);
      setComment("");
      onReviewSubmitted?.();
    } catch {
      toast.error("There was an error submitting your review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () =>
    Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`review-form__star ${i < rating ? "active" : ""}`}
        onClick={() => setRating(i + 1)}
      >
        ★
      </span>
    ));

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3 className="review-form__title">Leave a review</h3>

      <div className="review-form__stars">{renderStars()}</div>

      <textarea
        className="review-form__textarea"
        placeholder="Escribe tu reseña..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      ></textarea>

      <button
        className="review-form__submit"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Submit review"}
      </button>
    </form>
  );
}
