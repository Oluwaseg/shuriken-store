import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaTrashAlt,
} from 'react-icons/fa';
import apiClient from '../../services/apiClient';
import EditProductModal from '../modals/EditProduct';
import { Category, Product } from './types/type';

const ProductsTable: React.FC<{ tableKey: number }> = ({ tableKey }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(20);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get<{ products: Product[] }>(
          '/products'
        );
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Error fetching products');
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await apiClient.get<{ categories: Category[] }>(
          '/category'
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Error fetching categories');
      }
    };

    fetchProducts();
    fetchCategories();
  }, [tableKey]);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleDelete = async (productId: string) => {
    try {
      await apiClient.delete(`/products/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product');
    }
  };

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <section className='container px-4 mx-auto'>
      <div className='flex flex-col'>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
            <div className='overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg'>
              {products.length === 0 ? (
                <p className='text-center py-4 text-gray-500 dark:text-gray-400'>
                  No products are available
                </p>
              ) : (
                <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                  <thead className='bg-gray-50 dark:bg-gray-800'>
                    <tr>
                      <th
                        scope='col'
                        className='py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'
                      >
                        <div className='flex items-center gap-x-3'>
                          <button className='flex items-center gap-x-2'>
                            <span>ID</span>
                          </button>
                        </div>
                      </th>
                      <th
                        scope='col'
                        className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'
                      >
                        Product ID
                      </th>
                      <th
                        scope='col'
                        className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'
                      >
                        Name
                      </th>
                      <th
                        scope='col'
                        className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'
                      >
                        Price
                      </th>
                      <th
                        scope='col'
                        className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 hidden md:table-cell'
                      >
                        Stock
                      </th>
                      <th
                        scope='col'
                        className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 hidden lg:table-cell'
                      >
                        Category
                      </th>
                      <th
                        scope='col'
                        className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400'
                      >
                        Images
                      </th>
                      <th
                        scope='col'
                        className='px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 hidden xl:table-cell'
                      >
                        Reviews
                      </th>
                      <th scope='col' className='relative py-3.5 px-4'>
                        <span className='sr-only'>Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900'>
                    {currentProducts.map((product, index) => (
                      <tr key={product._id}>
                        <td className='px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap'>
                          <div className='inline-flex items-center gap-x-3'>
                            <span>{index + 1}</span>
                          </div>
                        </td>
                        <td className='px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap'>
                          {product._id}
                        </td>
                        <td className='px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap'>
                          {truncateText(product.name, 10)}
                        </td>
                        <td className='px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap'>
                          ₦{product.price}
                        </td>
                        <td className='px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap hidden md:table-cell'>
                          {product.stock}
                        </td>
                        <td className='px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap hidden lg:table-cell'>
                          {categories.find(
                            (cat) => cat._id === product.category
                          )?.name || 'Unknown'}
                        </td>
                        <td className='px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap'>
                          {product.images.length} image
                          {product.images.length > 1 ? 's' : ''}
                        </td>
                        <td className='px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap hidden xl:table-cell'>
                          {product.reviews?.length ?? 0} review
                          {(product.reviews?.length ?? 0) > 1 ? 's' : ''}
                        </td>
                        <td className='px-4 py-4 text-sm whitespace-nowrap'>
                          <div className='flex items-center gap-x-6'>
                            <button
                              onClick={() => handleEdit(product)}
                              className='text-gray-500 transition-colors duration-200 dark:hover:text-indigo-500 dark:text-blue-400 hover:text-blue-600 focus:outline-none'
                            >
                              <FaEdit className='inline-block' />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className='text-red-500 transition-colors duration-200 dark:text-red-500 dark:hover:text-red-400  hover:text-red-600 focus:outline-none'
                            >
                              <FaTrashAlt className='inline-block' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {products.length > itemsPerPage && (
        <div className='flex items-center justify-between mt-6'>
          <a
            href='#'
            className='flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800'
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                handlePageChange(currentPage - 1);
              }
            }}
          >
            <FaChevronLeft className='w-5 h-5 rtl:-scale-x-100' />
            <span>Previous</span>
          </a>

          <div className='items-center hidden md:flex gap-x-3'>
            {Array.from({ length: totalPages }, (_, i) => (
              <a
                key={i}
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(i + 1);
                }}
                className={`px-3 py-1.5 text-xs font-medium transition-colors duration-200 border rounded-md ${
                  i + 1 === currentPage
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800'
                }`}
              >
                {i + 1}
              </a>
            ))}
          </div>

          <a
            href='#'
            className='flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800'
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) {
                handlePageChange(currentPage + 1);
              }
            }}
          >
            <FaChevronRight className='w-5 h-5 rtl:-scale-x-100' />
            <span>Next</span>
          </a>
        </div>
      )}

      {selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          categories={categories}
          onClose={() => setSelectedProduct(null)}
          onUpdate={(updatedProduct: Product) => {
            setProducts(
              products.map((p) =>
                p._id === updatedProduct._id ? updatedProduct : p
              )
            );
            setSelectedProduct(null);
          }}
        />
      )}
      <Toaster position='top-right' />
    </section>
  );
};

export default ProductsTable;
