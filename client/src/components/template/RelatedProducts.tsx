import React from 'react';
import { BiArrowToRight } from 'react-icons/bi';
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
    <section className='my-24 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <h2 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center'>
          Related Products
        </h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8'>
          {products.map((relatedProduct) => (
            <div
              key={relatedProduct.id}
              className='group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out'
            >
              <div className='relative aspect-w-1 aspect-h-1'>
                <img
                  src={
                    relatedProduct.images[0]?.url || '/placeholder-image.jpg'
                  }
                  alt={relatedProduct.name}
                  className='w-full h-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300 ease-in-out'
                />
              </div>
              <div className='p-4'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate'>
                  {relatedProduct.name}
                </h3>
                <p className='text-xl font-bold text-indigo-600 dark:text-indigo-400'>
                  ${relatedProduct.price.toFixed(2)}
                </p>
                <button
                  onClick={() => handleViewProduct(relatedProduct.id)}
                  className='mt-3 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300 ease-in-out flex items-center justify-center group'
                >
                  <span>View Product</span>
                  <BiArrowToRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300 ease-in-out' />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
