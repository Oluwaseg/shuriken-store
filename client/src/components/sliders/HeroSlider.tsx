import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { fetchLatestProducts } from '../../features/product/productSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';

const HeroSlider: React.FC = () => {
  const dispatch = useAppDispatch();
  const { latestProducts, loading, error } = useAppSelector(
    (state) => state.product
  );

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    dispatch(fetchLatestProducts());
  }, [dispatch]);

  interface SliderSettings {
    dots: boolean;
    arrows: boolean;
    autoplay: boolean;
    autoplaySpeed: number;
    slidesToShow: number;
    slidesToScroll: number;
    dotsClass: string;
    customPaging: (i: number) => JSX.Element;
    beforeChange: (oldIndex: number, newIndex: number) => void;
  }

  const settings: SliderSettings = {
    dots: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: 'slick-dots custom-dots',
    customPaging: (i) => (
      <div
        className={`w-2 h-2 mx-1 rounded-full ${
          i === activeSlide
            ? 'bg-accent-light dark:bg-accent-dark'
            : 'bg-gray-300 dark:bg-gray-600 hover:bg-accent-light dark:hover:bg-accent-dark transition-colors duration-300'
        }`}
      />
    ),
    beforeChange: (_oldIndex, newIndex) => setActiveSlide(newIndex),
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-80 md:h-96 lg:h-112'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-light dark:border-accent-dark'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-80 md:h-96 lg:h-112'>
        <p className='text-center text-xl text-red-500'>
          Error loading products: {error}
        </p>
      </div>
    );
  }

  return (
    <div className='relative w-full'>
      <Slider {...settings}>
        {latestProducts.map((product, index) => (
          <div key={index} className='outline-none'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
              {/* Product Image */}
              <div className='relative overflow-hidden rounded-lg aspect-[4/3]'>
                <img
                  src={product.images[0]?.url || '/placeholder-image.jpg'}
                  alt={product.name}
                  className='object-cover w-full h-full rounded-lg transition-transform duration-500 hover:scale-105'
                />
              </div>

              {/* Product Info */}
              <div className='flex flex-col justify-center space-y-4 p-4'>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className='text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2'>
                    {product.name}
                  </h3>
                  <p className='text-text-secondary-light dark:text-text-secondary-dark text-lg mb-4'>
                    {product.description?.slice(0, 120)}...
                  </p>
                  <div className='flex items-center gap-4 mb-6'>
                    {product.discount?.isDiscounted ? (
                      <>
                        <span className='text-lg text-text-secondary-light dark:text-text-secondary-dark line-through'>
                          ₦{product.price.toLocaleString()}
                        </span>
                        <span className='text-2xl md:text-3xl font-bold text-accent-light dark:text-accent-dark'>
                          ₦
                          {(
                            product.price -
                            (product.price * product.discount.discountPercent) /
                              100
                          ).toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className='text-2xl md:text-3xl font-bold text-accent-light dark:text-accent-dark'>
                        ₦{product.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <a
                    href={`/product/${product._id}`}
                    className='inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-accent-light dark:bg-accent-dark rounded-full hover:bg-accent-secondary-light dark:hover:bg-accent-secondary-dark transition-colors duration-300'
                  >
                    Shop Now
                    <svg
                      className='w-5 h-5 ml-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M14 5l7 7m0 0l-7 7m7-7H3'
                      />
                    </svg>
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <style>{`
        .slick-dots {
          bottom: -30px;
        }
        .slick-dots li button:before {
          display: none;
        }
        .custom-dots {
          display: flex !important;
          justify-content: center;
          align-items: center;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;
