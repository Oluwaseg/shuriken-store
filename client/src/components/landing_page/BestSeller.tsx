import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../../features/product/productSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

const BestSellers: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts({ queryParams: {} }));
  }, [dispatch]);

  const bestSellers = products
    .filter((product) => product.bestSeller)
    .slice(0, 8);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-light dark:border-accent-dark'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <p className='text-center text-xl text-red-500'>Error: {error}</p>
      </div>
    );
  }

  return (
    <section className='py-16 px-4 max-w-7xl mx-auto'>
      <div className='text-center mb-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='inline-flex flex-col items-center'
        >
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-8 h-[2px] bg-accent-light dark:bg-accent-dark'></div>
            <h2 className='text-text-primary-light dark:text-text-primary-dark text-sm font-medium uppercase tracking-wider'>
              Customer Favorites
            </h2>
            <div className='w-8 h-[2px] bg-accent-light dark:bg-accent-dark'></div>
          </div>
          <h3 className='text-3xl md:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4'>
            Best Sellers
          </h3>
          <p className='max-w-2xl text-text-secondary-light dark:text-text-secondary-dark'>
            Discover our most popular products that have won the hearts of
            customers. Don't miss out on these top-rated items!
          </p>
        </motion.div>
      </div>

      <motion.div
        variants={container}
        initial='hidden'
        animate='show'
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
      >
        {bestSellers.map((product) => (
          <motion.div
            key={product._id}
            variants={item}
            className='group relative bg-body-light dark:bg-body-dark rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300'
          >
            <div className='relative aspect-square overflow-hidden'>
              <img
                src={product.images[0]?.url || '/placeholder-image.jpg'}
                alt={product.name}
                className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500'
              />
              <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <div className='absolute inset-0 flex items-center justify-center gap-4'>
                  <Link
                    to={`/product/${product._id}`}
                    className='bg-accent-light dark:bg-accent-dark text-white p-3 rounded-full hover:scale-110 transition-transform duration-300'
                  >
                    <ShoppingBag size={20} />
                  </Link>
                  <button className='bg-white/90 dark:bg-gray-800/90 text-accent-light dark:text-accent-dark p-3 rounded-full hover:scale-110 transition-transform duration-300'>
                    <Heart size={20} />
                  </button>
                </div>
              </div>
              <div className='absolute top-2 left-2 bg-accent-light dark:bg-accent-dark text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center'>
                <Star size={14} className='mr-1' /> Best Seller
              </div>
            </div>

            <div className='p-4'>
              <Link to={`/product/${product._id}`}>
                <h4 className='text-text-primary-light dark:text-text-primary-dark font-medium mb-2 line-clamp-1 hover:text-accent-light dark:hover:text-accent-dark transition-colors duration-300'>
                  {product.name}
                </h4>
              </Link>
              <div className='flex items-center justify-between'>
                {product.discount?.isDiscounted ? (
                  <>
                    <p className='text-accent-light dark:text-accent-dark font-bold'>
                      $
                      {(
                        product.price -
                        (product.price * product.discount.discountPercent) / 100
                      ).toLocaleString()}
                    </p>
                    <p className='text-text-secondary-light dark:text-text-secondary-dark line-through text-sm'>
                      ${product.price.toLocaleString()}
                    </p>
                  </>
                ) : (
                  <p className='text-accent-light dark:text-accent-dark font-bold'>
                    ${product.price.toLocaleString()}
                  </p>
                )}
              </div>

              {product.stock <= 5 && product.stock > 0 && (
                <p className='text-red-500 text-sm mt-2'>
                  Only {product.stock} left in stock
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default BestSellers;
