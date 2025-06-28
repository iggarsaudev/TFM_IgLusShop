import { useEffect, useState } from "react";
import ProductReviewList from "./ProductReviewList";
import ProductReviewForm from "./ProductReviewForm";
import api from "../../../services/api";
import Spinner from "../Spinner/Spinner";

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

export default function ProductReviews({ productId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/api/product/${productId}/reviews`);
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      setError("No se pudieron cargar las reseñas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  if (loading) {
    return (
      <section className="product-reviews">
        <Spinner />
      </section>
    );
  }

  return (
    <section className="product-reviews">
      {error && <p className="product-reviews__error">{error}</p>}
      {!error && <ProductReviewList reviews={reviews} />}
      <ProductReviewForm
        productId={productId}
        onReviewSubmitted={fetchReviews}
      />
    </section>
  );
}
