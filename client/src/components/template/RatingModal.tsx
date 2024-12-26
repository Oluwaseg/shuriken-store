import { AnimatePresence, motion } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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
  existingReview?: { rating: number; comment: string } | null;
}

const RatingModal = ({
  productId,
  onClose,
  userRating,
  setUserRating,
  onSubmitReview,
  existingReview,
}: RatingModalProps) => {
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset state when productId changes or modal is opened
    setUserRating(existingReview?.rating || 0);
    setComment(existingReview?.comment || '');
  }, [productId, existingReview, setUserRating]);

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
          ? 'Review updated successfully!'
          : 'Review created successfully!'
      );

      onClose();
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast.error('Failed to submit review, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className='bg-white dark:bg-dark-light rounded-lg shadow-lg p-8 max-w-lg w-full m-4'
        >
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark'>
              {existingReview ? 'Edit your review' : 'Rate this product'}
            </h2>
            <button
              onClick={onClose}
              className='text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors duration-200'
            >
              <X className='w-6 h-6' />
            </button>
          </div>

          <div className='flex items-center mb-6'>
            {Array.from({ length: 5 }, (_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setUserRating(index + 1)}
              >
                <Star
                  className={`w-8 h-8 ${
                    index < userRating
                      ? 'text-accent-light dark:text-accent-dark fill-current'
                      : 'text-text-secondary-light dark:text-text-secondary-dark'
                  }`}
                />
              </motion.button>
            ))}
          </div>

          <textarea
            className='w-full border border-border-light dark:border-border-dark rounded-lg p-3 mb-6 bg-input-light dark:bg-input-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:border-transparent transition-all duration-200'
            placeholder='Leave a comment...'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />

          <div className='flex justify-end space-x-4'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='bg-input-light dark:bg-input-dark text-text-primary-light dark:text-text-primary-dark px-4 py-2 rounded-md transition-colors duration-200'
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='bg-button-primary-light dark:bg-button-primary-dark text-white px-4 py-2 rounded-md transition-colors duration-200 hover:bg-button-hover-light dark:hover:bg-button-hover-dark'
              onClick={submitReview}
              disabled={loading}
            >
              {loading ? 'Submitting...' : existingReview ? 'Update' : 'Submit'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RatingModal;
