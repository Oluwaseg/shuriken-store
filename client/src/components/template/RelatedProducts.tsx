import { motion } from 'framer-motion';
import { ArrowRight, Heart, ShoppingCart, Star } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RelatedProducts as RelatedProductType } from '../../types/type';

interface RelatedProductsProps {
  products: RelatedProductType[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  const navigate = useNavigate();

  const handleViewProduct = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <section className='my-24 px-4 sm:px-6 lg:px-8 bg-body-light dark:bg-body-dark'>
      <div className='max-w-7xl mx-auto'>
        <h2 className='text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8 text-center'>
          Discover Related Products
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
          {products.map((relatedProduct) => (
            <ProductCard
              key={relatedProduct.id}
              product={relatedProduct}
              onViewProduct={handleViewProduct}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface ProductCardProps {
  product: RelatedProductType;
  onViewProduct: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewProduct,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };
  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='bg-white dark:bg-dark-light rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='relative aspect-w-3 aspect-h-4'>
        <img
          src={product.images[0]?.url || '/placeholder-image.jpg'}
          alt={product.name}
          className='w-full h-full object-cover object-center'
        />
        <div className='absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewProduct(product.id)}
            className='bg-white text-text-primary-light px-4 py-2 rounded-full font-semibold hover:bg-accent-light hover:text-white transition-colors duration-300'
          >
            Quick View
          </motion.button>
        </div>
      </div>
      <div className='p-6'>
        <div className='flex justify-between items-start mb-2'>
          <h3 className='text-xl font-semibold text-text-primary-light dark:text-text-primary-dark truncate flex-grow'>
            {product.name}
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className='text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light dark:hover:text-accent-dark transition-colors duration-300'
          >
            <Heart className='w-6 h-6' />
          </motion.button>
        </div>
        <div className='flex items-center mb-2'>
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${
                index < Math.floor(product.ratings || 0)
                  ? 'text-accent-light dark:text-accent-dark fill-current'
                  : 'text-text-secondary-light dark:text-text-secondary-dark'
              }`}
            />
          ))}
          <span className='ml-2 text-sm text-text-secondary-light dark:text-text-secondary-dark'>
            ({product.numOfReviews})
          </span>
        </div>
        <p className='text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4 line-clamp-2'>
          {truncateText(product.description, 100)}
        </p>
        <div className='flex justify-between items-center mb-4'>
          <p className='text-2xl font-bold text-accent-light dark:text-accent-dark'>
            ₦{formatPrice(product.price)}
          </p>
          {product.discount?.isDiscounted && (
            <span className='text-sm text-text-secondary-light dark:text-text-secondary-dark line-through'>
              ₦
              {formatPrice(
                product.price * (1 - product.discount.discountPercent / 100)
              )}
            </span>
          )}
        </div>
        <div className='flex space-x-2'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='flex-grow bg-button-primary-light dark:bg-button-primary-dark text-white py-2 px-4 rounded-md hover:bg-button-hover-light dark:hover:bg-button-hover-dark transition-colors duration-300 flex items-center justify-center'
          >
            <ShoppingCart className='w-5 h-5 mr-2' />
            Add to Cart
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewProduct(product.id)}
            className='bg-input-light dark:bg-input-dark text-text-primary-light dark:text-text-primary-dark py-2 px-4 rounded-md hover:bg-border-light dark:hover:bg-border-dark transition-colors duration-300 flex items-center justify-center'
          >
            <ArrowRight className='w-5 h-5' />
          </motion.button>
        </div>
      </div>
      {isHovered && product.discount?.isDiscounted && (
        <div className='absolute top-4 left-4 bg-accent-light dark:bg-accent-dark text-white text-sm font-semibold py-1 px-2 rounded-full'>
          {product.discount.discountPercent}% OFF
        </div>
      )}
    </motion.div>
  );
};

export default RelatedProducts;
