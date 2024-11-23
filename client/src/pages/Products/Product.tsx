import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FaHeart,
  FaRegStar,
  FaShoppingCart,
  FaStar,
  FaTrash,
  FaUserCircle,
} from 'react-icons/fa';
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
      // Dispatch the action to add or update the cart
      dispatch(
        addOrUpdateCart({
          userId: user ? user._id : undefined, // Pass user ID if logged in
          productId: product._id, // The product ID
          quantity, // The selected quantity
          price: product.price, // Product price
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
      <div className='flex justify-center items-center'>
        <div className='loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12'></div>{' '}
      </div>
    );
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='bg-gray-100 dark:bg-gray-900 py-10 transition-colors duration-300'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col md:flex-row gap-8'>
          {/* Left Side - Product Images */}
          <div className='md:w-1/2'>
            <div className='mb-4'>
              <img
                src={mainImage || '/placeholder-image.jpg'}
                alt={product?.name}
                className='w-full h-auto rounded-lg shadow-md'
              />
            </div>
            <div className='flex gap-3 overflow-x-auto'>
              {product?.images.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={`Thumbnail ${index + 1}`}
                  className='w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md cursor-pointer opacity-60 hover:opacity-100 transition duration-300'
                  onClick={() => setMainImage(img.url)}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Product Information */}
          <div className='md:w-1/2 space-y-6'>
            {/* Product Name */}
            <h1 className='text-4xl font-bold text-gray-900 dark:text-gray-100'>
              {product?.name}
            </h1>

            {/* Ratings - Modal Trigger */}
            <div
              className='flex items-center cursor-pointer'
              onClick={openReviewModal}
            >
              {Array.from({ length: 5 }, (_, index) =>
                index < (product?.ratings || 0) ? (
                  <FaStar key={index} className='text-yellow-500' />
                ) : (
                  <FaRegStar key={index} className='text-yellow-500' />
                )
              )}
              <span className='ml-2 text-gray-600 dark:text-gray-300'>
                ({product?.numOfReviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
              ${product?.price}
              {product?.discount?.isDiscounted && (
                <span className='text-gray-500 ml-2 line-through text-lg dark:text-gray-400'>
                  $
                  {(
                    product?.price /
                    (1 - product.discount.discountPercent / 100)
                  ).toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
              {product?.description}
            </p>

            {/* Quantity Selector */}
            <div className='flex items-center space-x-2'>
              <label
                htmlFor='quantity'
                className='text-gray-700 dark:text-gray-300 font-medium'
              >
                Select Quantity
              </label>
              <select
                id='quantity'
                value={quantity} // Set the value from the state
                onChange={(e) => setQuantity(Number(e.target.value))} // Update the state on change
                className='border border-gray-300 rounded-md px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
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

              {product?.stock !== undefined && (
                <p className='text-gray-600 dark:text-gray-400 ml-4'>
                  Stock left: {product.stock}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className='flex space-x-4'>
              <button
                onClick={handleAddToCart}
                className='bg-indigo-600 flex gap-2 items-center text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-300'
              >
                <FaShoppingCart />
                Add to Cart
              </button>

              <button className='bg-gray-200 flex gap-2 items-center text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition duration-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'>
                <FaHeart />
                Add to Wishlist
              </button>
            </div>

            {/* Extra Information */}
            <div className='text-sm text-gray-600 dark:text-gray-400 space-y-2'>
              <p>100% Original products</p>
              <p>Cash on delivery available on this product.</p>
              <p>Easy return and exchange policy within 7 days.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description & Reviews Section */}
      <div className='mt-16 mx-2'>
        <div className='flex space-x-4 border-b border-gray-300 dark:border-gray-700'>
          <button
            className={`py-2 px-4 ${
              !showReviews
                ? 'border-b-2 border-indigo-600 text-gray-700 dark:text-gray-200'
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => setShowReviews(false)}
          >
            Description
          </button>
          <button
            className={`py-2 px-4 ${
              showReviews
                ? 'border-b-2 border-indigo-600 text-gray-700 dark:text-gray-200'
                : 'text-gray-500 dark:text-gray-400'
            }`}
            onClick={() => setShowReviews(true)}
          >
            Reviews ({product?.numOfReviews})
          </button>
        </div>

        {/* Description Section */}
        {!showReviews ? (
          <div className='py-6 text-gray-700 dark:text-gray-300'>
            <p>{product?.description}</p>
          </div>
        ) : (
          <div className='py-6 text-gray-700 dark:text-gray-300'>
            {reviewsLoading ? (
              <p>Loading reviews...</p>
            ) : reviewsError ? (
              <p>Error loading reviews: {reviewsError}</p>
            ) : reviews.length > 0 ? (
              <>
                <div className='space-y-8'>
                  {reviews.slice(0, reviewsLimit).map((review) => (
                    <div
                      key={review._id}
                      className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg'
                    >
                      <div className='flex items-start space-x-4'>
                        <div className='flex-shrink-0'>
                          {review.user.avatar?.[0]?.url ? (
                            <img
                              src={review.user.avatar[0].url}
                              alt={review.user.name}
                              className='w-12 h-12 rounded-full object-cover border-2 border-indigo-500'
                            />
                          ) : (
                            <FaUserCircle className='w-12 h-12 text-gray-400 dark:text-gray-600' />
                          )}
                        </div>
                        <div className='flex-grow'>
                          <div className='flex items-center justify-between'>
                            <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
                              {review.user.name}
                            </h3>
                            <span className='text-sm text-gray-500 dark:text-gray-400'>
                              {new Date(review.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                }
                              )}
                            </span>
                          </div>
                          <div className='flex items-center mt-1 mb-2'>
                            {Array.from({ length: 5 }, (_, i) => (
                              <span key={i}>
                                {i < review.rating ? (
                                  <FaStar className='w-5 h-5 text-yellow-400' />
                                ) : (
                                  <FaRegStar className='w-5 h-5 text-gray-300 dark:text-gray-600' />
                                )}
                              </span>
                            ))}
                          </div>
                          <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                            {review.comment}
                          </p>
                          {user && review.user._id === user._id && (
                            <button
                              className='mt-4 inline-flex items-center text-red-500 hover:text-red-700 transition-colors duration-200'
                              onClick={() => handleDeleteReview()}
                            >
                              <FaTrash className='w-4 h-4 mr-2' />
                              Delete Review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {reviews.length > reviewsLimit && (
                    <div className='text-center'>
                      <button
                        className='bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                        onClick={handleShowMoreReviews}
                      >
                        Show More Reviews
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        )}
      </div>
      {/* Related Products Section */}
      <RelatedProducts products={relatedProduct || []} />
      {/* Render Modal */}
      {isModalOpen && (
        <RatingModal
          productId={id}
          onClose={() => setIsModalOpen(false)}
          userRating={userRating}
          setUserRating={setUserRating}
          onSubmitReview={handleSubmitReview}
          existingReview={existingReview || undefined}
        />
      )}
    </div>
  );
};

export default Product;
