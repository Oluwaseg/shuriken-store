import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { FaPlus } from 'react-icons/fa';
import CreateProductModal from '../components/modals/CreateProductModal';
import ProductsTable from '../components/tables/ProductTable';

const Products: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const triggerRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Admin - Products</title>
          <meta name='description' content='Admin Products Page' />
        </Helmet>
      </HelmetProvider>
      <div className='p-4 h-full'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-semibold text-text-primary-light dark:text-text-primary-dark'>
            Product List
          </h2>
          <button
            onClick={openModal}
            className='px-4 py-2 bg-accent-light text-white font-semibold rounded-md shadow-sm hover:bg-accent-dark hover:bg-opacity-50 duration-200 focus:outline-none'
          >
            <FaPlus className='inline-block mr-2' /> Create a Product
          </button>
        </div>
        <div className='p-2 overflow-x-auto md:overflow-hidden'>
          <ProductsTable tableKey={refreshKey} />
        </div>
        {isModalOpen && (
          <CreateProductModal
            closeModal={closeModal}
            onSuccess={triggerRefresh}
          />
        )}
      </div>
    </>
  );
};

export default Products;
