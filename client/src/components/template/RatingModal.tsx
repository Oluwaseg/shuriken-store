import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast"; // Import react-hot-toast

interface RatingModalProps {
  productId: string | undefined;
  onClose: () => void;
  userRating: number;
  setUserRating: React.Dispatch<React.SetStateAction<number>>;
  onSubmitReview: (reviewData: {
    productId: string;
    rating: number;
    comment: string;
  }) => Promise<void>;
  existingReview?: { rating: number; comment: string }; // Add this optional prop for editing
}

const RatingModal = ({
  productId,
  onClose,
  userRating,
  setUserRating,
  onSubmitReview,
  existingReview, // Now receiving this prop
}: RatingModalProps) => {
  const [comment, setComment] = useState<string>(existingReview?.comment || ""); // Pre-fill comment if editing
  const [loading, setLoading] = useState(false);

  // When opening the modal, pre-fill the rating if it's an existing review
  useEffect(() => {
    if (existingReview) {
      setUserRating(existingReview.rating);
    }
  }, [existingReview, setUserRating]);

  const submitReview = async () => {
    if (!productId) return;

    setLoading(true);

    try {
      await onSubmitReview({
        productId,
        rating: userRating,
        comment,
      });

      toast.success(
        existingReview
          ? "Review updated successfully!"
          : "Review created successfully!"
      );

      onClose();
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">
          {existingReview ? "Edit your review" : "Rate this product"}
        </h2>

        {/* Rating Selector */}
        <div className="flex items-center mb-4">
          {Array.from({ length: 5 }, (_, index) => (
            <FaStar
              key={index}
              className={`text-3xl cursor-pointer ${
                index < userRating ? "text-yellow-500" : "text-gray-300"
              }`}
              onClick={() => setUserRating(index + 1)}
            />
          ))}
        </div>

        {/* Comment Input */}
        <textarea
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
          placeholder="Leave a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-200 px-4 py-2 rounded-md"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md"
            onClick={submitReview}
            disabled={loading}
          >
            {loading ? "Submitting..." : existingReview ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
