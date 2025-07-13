import { useEffect, useState, useCallback } from "react";
import ProductReviewList from "./ProductReviewList";
import ProductReviewForm from "./ProductReviewForm";
import api from "../../../services/api";
import Spinner from "../../ui/Spinner/Spinner";
import type { Review } from "../../../types/review";

interface Props {
  productId: number;
}

const ProductReviews = ({ productId }: Props) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReviews = useCallback(async () => {
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
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

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
      <ProductReviewList
        reviews={reviews}
        onDelete={(id) => setReviews((prev) => prev.filter((r) => r.id !== id))}
        onUpdate={fetchReviews}
      />
      <ProductReviewForm
        productId={productId}
        onReviewSubmitted={fetchReviews}
      />
    </section>
  );
};
export default ProductReviews;
