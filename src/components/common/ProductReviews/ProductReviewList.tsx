import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import api from "../../../services/api";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner/Spinner";
import type { Review } from "../../../types/review";
import "./productReviewList.css";

interface Props {
  reviews: Review[];
  onDelete: (id: number) => void;
  onUpdate: () => void;
}

const ProductReviewList = ({
  reviews,
  onDelete,
  onUpdate,
}: Props) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editedComment, setEditedComment] = useState("");
  const [editedRating, setEditedRating] = useState(0);

  if (reviews.length === 0) {
    return (
      <div className="review-message">
        <p className="review-message__text">There are no reviews yet.</p>
      </div>
    );
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    setLoading(true);

    try {
      await api.delete(`/api/reviews/${id}`);
      toast.success("Review deleted");
      onDelete(id);
    } catch {
      toast.error("Error deleting review");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (review: Review) => {
    setEditingReview(review);
    setEditedComment(review.comment);
    setEditedRating(review.rating);
  };

  const closeEditModal = () => {
    setEditingReview(null);
    setEditedComment("");
    setEditedRating(0);
  };

  const submitEdit = async () => {
    if (!editingReview) return;

    try {
      await api.put(`/api/reviews/${editingReview.id}`, {
        comment: editedComment.trim(),
        rating: editedRating,
      });
      toast.success("Review updated");
      closeEditModal();
      onUpdate();
    } catch {
      toast.error("Error updating review");
    }
  };

  const renderStars = (selected: number, onChange: (n: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`reviews__star ${i < selected ? "active" : ""}`}
        onClick={() => onChange(i + 1)}
      >
        ★
      </span>
    ));
  };

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

            {user?.id === review.user.id && (
              <div className="reviews__actions">
                <button
                  className="reviews__btn reviews__btn--edit"
                  onClick={() => openEditModal(review)}
                >
                  Edit
                </button>
                <button
                  className="reviews__btn reviews__btn--delete"
                  onClick={() => handleDelete(review.id)}
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de edición */}
      {editingReview && (
        <div className="modal">
          <div className="modal__content">
            <h3>Edit review</h3>
            <div className="reviews__stars">
              {renderStars(editedRating, setEditedRating)}
            </div>
            <textarea
              className="reviews__edit-textarea"
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
            />
            <div className="reviews__actions">
              <button
                className="reviews__btn reviews__btn--save"
                onClick={submitEdit}
              >
                Save
              </button>
              <button
                className="reviews__btn reviews__btn--cancel"
                onClick={closeEditModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="loading-overlay">
          <Spinner />
        </div>
      )}
    </section>
  );
}

export default ProductReviewList;