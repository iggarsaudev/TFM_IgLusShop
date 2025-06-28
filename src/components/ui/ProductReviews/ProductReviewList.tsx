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
  reviews: Review[];
}

export default function ProductReviewList({ reviews }: Props) {
  if (reviews.length === 0) {
    return <p>There are no reviews yet.</p>;
  }

  return (
    <section className="reviews">
      <h2 className="reviews__title">Reviews</h2>

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
    </section>
  );
}
