import { motion } from 'framer-motion';
import {
  ChevronDown,
  Heart,
  MessageSquare,
  ShoppingCart,
  Star,
  Trash2,
  User2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import RatingModal from '../../components/template/RatingModal';
import RelatedProducts from '../../components/template/RelatedProducts';
import { addOrUpdateCart } from '../../features/cart/cartSlice';
import {
  createReview,
  fetchProductById,
  fetchProductReviews,
  fetchRelatedProducts,
  removeReview,
} from '../../features/product/productSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Review, User } from '../../types/type';

const Product = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { product, loading, error, relatedProduct } = useAppSelector(
    (state) => state.product
  );
  const { reviews, reviewsLoading, reviewsError } = useAppSelector(
    (state) => state.product
  );
  const user = useAppSelector((state) => state.auth.userInfo);
  const [mainImage, setMainImage] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [existingReview, setExistingReview] = useState<{
    rating: number;
    comment: string;
  } | null>(null);
  const [showReviews, setShowReviews] = useState<boolean>(false);
  const [reviewsLimit, setReviewsLimit] = useState<number>(10);
  const [quantity, setQuantity] = useState<number>(1);

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchProductReviews(id));
      dispatch(fetchRelatedProducts(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product.images.length > 0) {
      setMainImage(product.images[0].url);
    }
  }, [product]);

  useEffect(() => {
    if (user && reviews.length > 0) {
      const userReview = reviews.find((review) => review.user._id === user._id);
      if (userReview) {
        setExistingReview({
          rating: userReview.rating,
          comment: userReview.comment,
        });
        setUserRating(userReview.rating);
      } else {
        setExistingReview(null);
      }
    }
  }, [user, reviews]);

  const handleSubmitReview = async (reviewData: {
    productId: string;
    rating: number;
    comment: string;
  }) => {
    try {
      await dispatch(createReview(reviewData)).unwrap();
      if (id) {
        dispatch(fetchProductById(id));
        dispatch(fetchProductReviews(id));
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleShowMoreReviews = () => {
    setReviewsLimit((prevLimit) => prevLimit + 10);
  };

  const handleDeleteReview = async () => {
    if (!id) {
      toast.error('Product ID is missing.');
      return;
    }
    try {
      await dispatch(removeReview(id || '')).unwrap();
      toast.success('Review deleted successfully');
      dispatch(fetchProductById(id));
      dispatch(fetchProductReviews(id));
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Error deleting review');
    }
  };

  const openReviewModal = () => {
    if (user) {
      setIsModalOpen(true);
    } else {
      toast.error('Please log in to leave a review.');
    }
  };

  const handleAddToCart = () => {
    if (product && product._id) {
      dispatch(
        addOrUpdateCart({
          userId: user ? user._id : undefined,
          productId: product._id,
          quantity,
          price: product.price,
        })
      )
        .unwrap()
        .then(() => {
          toast.success('Product added to cart successfully!');
        })
        .catch((error) => {
          toast.error(`Error adding product to cart: ${error}`);
        });
    } else {
      toast.error('Product not found.');
    }
  };

  if (loading)
    return (
      <div className='flex justify-center items-center h-screen'>
        <motion.div
          className='w-16 h-16 border-t-4 border-accent-light dark:border-accent-dark border-solid rounded-full'
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  if (error) return <p className='text-red-500 text-center'>Error: {error}</p>;

  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const ReviewCard = ({
    review,
    user,
    onDeleteReview,
  }: {
    review: Review;
    user: User;
    onDeleteReview: () => void;
  }) => {
    return (
      <motion.div
        key={review._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='bg-input-light dark:bg-input-dark dark:border dark:border-accent-dark rounded-lg p-6 transition-all duration-300 hover:shadow-md'
      >
        <div className='flex items-start space-x-4'>
          <div className='flex-shrink-0'>
            {review.user.avatar?.[0]?.url ? (
              <img
                src={review.user.avatar[0].url}
                alt={review.user.name}
                className='w-12 h-12 rounded-full object-cover border-2 border-accent-light dark:border-accent-dark'
              />
            ) : (
              <User2 className='w-12 h-12 text-text-secondary-light dark:text-text-secondary-dark' />
            )}
          </div>
          <div className='flex-grow'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-text-primary-light dark:text-text-primary-dark'>
                {review.user.name}
              </h3>
              <span className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
                {new Date(review.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className='flex items-center mt-1 mb-2'>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < review.rating
                      ? 'text-accent-light dark:text-accent-dark fill-current'
                      : 'text-text-secondary-light dark:text-text-secondary-dark'
                  }`}
                />
              ))}
            </div>
            <p className='text-text-primary-light dark:text-text-primary-dark leading-relaxed'>
              {review.comment}
            </p>
            {user && review.user._id === user._id && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='mt-4 inline-flex items-center text-red-500 hover:text-red-700 transition-colors duration-200'
                onClick={() => onDeleteReview()}
              >
                <Trash2 className='w-4 h-4 mr-2' />
                Delete Review
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className='bg-body-light dark:bg-body-dark min-h-screen transition-colors duration-300'>
      <div className='container mx-auto px-4 py-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='bg-white dark:bg-dark-light rounded-xl shadow-md overflow-hidden'
        >
          <div className='md:flex'>
            {/* Left Side - Product Images */}
            <div className='md:w-1/2 p-6'>
              <motion.img
                src={mainImage || '/placeholder-image.jpg'}
                alt={product?.name}
                className='w-full h-auto rounded-lg shadow-md'
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              <div className='mt-4 flex gap-3 overflow-x-auto'>
                {product?.images.map((img, index) => (
                  <motion.img
                    key={index}
                    src={img.url}
                    alt={`Thumbnail ${index + 1}`}
                    className='w-20 h-20 object-cover rounded-md cursor-pointer'
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setMainImage(img.url)}
                  />
                ))}
              </div>
            </div>

            {/* Right Side - Product Information */}
            <div className='md:w-1/2 p-6'>
              <h1 className='text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4'>
                {product?.name}
              </h1>

              <div
                className='flex items-center cursor-pointer mb-4'
                onClick={openReviewModal}
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={`w-5 h-5 ${
                      index < (product?.ratings || 0)
                        ? 'text-accent-light dark:text-accent-dark fill-current'
                        : 'text-text-secondary-light dark:text-text-secondary-dark'
                    }`}
                  />
                ))}
                <span className='ml-2 text-text-secondary-light dark:text-text-secondary-dark'>
                  ({product?.numOfReviews} reviews)
                </span>
              </div>

              <div className='text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4'>
                ₦
                {product?.price !== undefined
                  ? formatPrice(Math.round(product.price))
                  : 'N/A'}
                {product?.discount?.isDiscounted && (
                  <span className='text-text-secondary-light dark:text-text-secondary-dark ml-2 line-through text-lg'>
                    ₦
                    {formatPrice(
                      Math.round(
                        product.price /
                          (1 - product.discount.discountPercent / 100)
                      )
                    )}
                  </span>
                )}
              </div>

              <div className='text-text-primary-light dark:text-text-primary-dark mb-6'>
                <div
                  className={`leading-relaxed ${
                    isDescriptionExpanded ? '' : 'line-clamp-2'
                  }`}
                >
                  {product?.description}
                </div>
                {product?.description &&
                  product.description.split(' ').length > 20 && (
                    <button
                      onClick={toggleDescription}
                      className='text-accent-light dark:text-accent-dark font-medium mt-2'
                    >
                      {isDescriptionExpanded
                        ? 'Show less'
                        : 'Read full description below'}
                    </button>
                  )}
              </div>

              <div className='flex items-center space-x-4 mb-6'>
                <label
                  htmlFor='quantity'
                  className='text-text-primary-light dark:text-text-primary-dark font-medium'
                >
                  Quantity
                </label>
                <div className='relative'>
                  <select
                    id='quantity'
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className='block appearance-none w-full bg-input-light dark:bg-input-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-accent-light dark:focus:border-accent-dark'
                  >
                    {product?.stock ? (
                      Array.from({ length: product.stock }, (_, qty) => (
                        <option key={qty + 1} value={qty + 1}>
                          {qty + 1}
                        </option>
                      ))
                    ) : (
                      <option value={0}>Out of Stock</option>
                    )}
                  </select>
                  <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-primary-light dark:text-text-primary-dark'>
                    <ChevronDown className='w-4 h-4' />
                  </div>
                </div>
                {product?.stock !== undefined && (
                  <p className='text-text-secondary-light dark:text-text-secondary-dark'>
                    Stock left: {product.stock}
                  </p>
                )}
              </div>

              <div className='flex space-x-4 mb-6'>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  className='bg-button-primary-light dark:bg-button-primary-dark text-white px-6 py-2 rounded-md hover:bg-button-hover-light dark:hover:bg-button-hover-dark transition duration-300 flex items-center space-x-2'
                >
                  <ShoppingCart className='w-5 h-5' />
                  <span>Add to Cart</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='bg-input-light dark:bg-input-dark text-text-primary-light dark:text-text-primary-dark px-6 py-2 rounded-md hover:bg-border-light dark:hover:bg-border-dark transition duration-300 flex items-center space-x-2'
                >
                  <Heart className='w-5 h-5' />
                  <span>Wishlist</span>
                </motion.button>
              </div>

              <div className='text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-2'>
                <p>✓ 100% Original products</p>
                <p>✓ Cash on delivery available</p>
                <p>✓ Easy 7-day return & exchange policy</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Improved Product Description & Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='mt-12 bg-white dark:bg-dark-light rounded-xl shadow-md overflow-hidden'
        >
          <div className='flex border-b border-border-light dark:border-border-dark'>
            <button
              className={`py-4 px-6 font-semibold transition-colors duration-200 ${
                !showReviews
                  ? 'border-b-2 border-accent-light dark:border-accent-dark text-accent-light dark:text-accent-dark'
                  : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light dark:hover:text-accent-dark'
              }`}
              onClick={() => setShowReviews(false)}
            >
              Description
            </button>
            <button
              className={`py-4 px-6 font-semibold transition-colors duration-200 ${
                showReviews
                  ? 'border-b-2 border-accent-light dark:border-accent-dark text-accent-light dark:text-accent-dark'
                  : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light dark:hover:text-accent-dark'
              }`}
              onClick={() => setShowReviews(true)}
            >
              Reviews ({product?.numOfReviews})
            </button>
          </div>

          <div className='p-6'>
            {!showReviews ? (
              <p className='text-text-primary-light dark:text-text-primary-dark leading-relaxed'>
                {product?.description}
              </p>
            ) : (
              <div className='space-y-8'>
                {reviewsLoading ? (
                  <p>Loading reviews...</p>
                ) : reviewsError ? (
                  <p className='text-red-500'>
                    Error loading reviews: {reviewsError}
                  </p>
                ) : reviews.length > 0 ? (
                  <>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      {reviews.slice(0, reviewsLimit).map((review) => (
                        <ReviewCard
                          key={review._id}
                          review={review}
                          user={user as User}
                          onDeleteReview={handleDeleteReview}
                        />
                      ))}
                    </div>
                    {reviews.length > reviewsLimit && (
                      <div className='text-center mt-8'>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className='bg-button-primary-light dark:bg-button-primary-dark text-white px-6 py-2 rounded-md hover:bg-button-hover-light dark:hover:bg-button-hover-dark transition duration-300 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:ring-offset-2'
                          onClick={handleShowMoreReviews}
                        >
                          Show More Reviews
                        </motion.button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className='text-center py-8'>
                    <MessageSquare className='w-16 h-16 text-text-secondary-light dark:text-text-secondary-dark mx-auto mb-4' />
                    <p className='text-text-secondary-light dark:text-text-secondary-dark'>
                      No reviews yet. Be the first to review this product!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Related Products Section */}
        {relatedProduct && relatedProduct.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className='mt-12'
          >
            <RelatedProducts products={relatedProduct} />
          </motion.div>
        )}
      </div>

      {/* Render Modal */}
      {isModalOpen && (
        <RatingModal
          productId={id}
          onClose={() => setIsModalOpen(false)}
          userRating={userRating}
          setUserRating={setUserRating}
          onSubmitReview={handleSubmitReview}
          existingReview={existingReview}
        />
      )}
    </div>
  );
};

export default Product;
