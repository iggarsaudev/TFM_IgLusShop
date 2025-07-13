import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner/Spinner";
import type { Review } from "../../../types/review";
import {
  useDeleteReview,
  useUpdateReview,
} from "../../../services/reviewService";
import "./productReviewList.css";

interface Props {
  reviews: Review[];
  onDelete: (id: number) => void;
  onUpdate: () => void;
}

const ProductReviewList = ({ reviews, onDelete, onUpdate }: Props) => {
  const { user } = useAuth();
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editedComment, setEditedComment] = useState("");
  const [editedRating, setEditedRating] = useState(0);

  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview(
    () => toast.success("Review deleted"),
    () => toast.error("Error deleting review")
  );

  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview(
    () => {
      toast.success("Review updated");
      closeEditModal();
      onUpdate();
    },
    () => toast.error("Error updating review")
  );

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    deleteReview(id);
    onDelete(id); // sigue notificando al padre
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

  const submitEdit = () => {
    if (!editingReview) return;
    updateReview({
      id: editingReview.id,
      comment: editedComment.trim(),
      rating: editedRating,
    });
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

  if (reviews.length === 0) {
    return (
      <div className="review-message">
        <p className="review-message__text">There are no reviews yet.</p>
      </div>
    );
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
                  disabled={isDeleting}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

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
                disabled={isUpdating}
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

      {(isDeleting || isUpdating) && (
        <div className="loading-overlay">
          <Spinner />
        </div>
      )}
    </section>
  );
};

export default ProductReviewList;
