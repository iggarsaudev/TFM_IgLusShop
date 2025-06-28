import { useEffect, useState } from "react";
import api from "../../../services/api";
import "./productReviewList.css";

interface Review {
  id: number;
  comment: string;
  rating: number;
  created_at: string;
  user: {
    name: string;
  };
}

interface Props {
  productId: number;
}

export default function ProductReviewList({ productId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get(`/api/product/${productId}/reviews`);
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Unable to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) return <p className="reviews__loading">Loading reviews...</p>;
  if (error) return <p className="reviews__error">{error}</p>;

  return (
    <section className="reviews">
      <h2 className="reviews__title">Reviews</h2>

      {loading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="reviews__grid">
          {reviews.map((review) => (
            <div key={review.id} className="reviews__card">
              <p className="reviews__author">{review.user.name}</p>
              <div className="reviews__stars">
                {"★".repeat(review.rating).padEnd(5, "☆")}
              </div>
              <p className="reviews__content">{review.comment}</p>
              <p className="reviews__date">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
