import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { MdClose } from 'react-icons/md';
import apiClient from '../../services/apiClient';
import ImageCarousel from '../previews/ImageCarousel';

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
}

interface ProductData {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  subcategory?: string;
  brand: string;
  bestSeller: boolean;
  discount: {
    isDiscounted: boolean;
    discountPercent: string;
  };
  flashSale: {
    isFlashSale: boolean;
    flashSalePrice: string;
    flashSaleEndTime: string;
  };
}
interface CreateProductModalProps {
  closeModal: () => void;
  onSuccess: () => void;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({
  closeModal,
  onSuccess,
}) => {
  const [productData, setProductData] = useState<ProductData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    subcategory: '',
    brand: '',
    bestSeller: false,
    discount: {
      isDiscounted: false,
      discountPercent: '0',
    },
    flashSale: {
      isFlashSale: false,
      flashSalePrice: '0.00',
      flashSaleEndTime: '',
    },
  });
  const [images, setImages] = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [fileInputKey, setFileInputKey] = useState<number>(Date.now());
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get<{ categories: Category[] }>(
          '/category'
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (productData.category) {
      const fetchSubcategories = async () => {
        try {
          const response = await apiClient.get<{
            subcategories: Subcategory[];
          }>(`/subcategories/${productData.category}`);
          setSubcategories(response.data.subcategories);
        } catch (error) {
          console.error('Error fetching subcategories:', error);
        }
      };

      fetchSubcategories();
    }
  }, [productData.category]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name in productData.discount) {
      setProductData({
        ...productData,
        discount: { ...productData.discount, [name]: value },
      });
    } else if (name in productData.flashSale) {
      setProductData({
        ...productData,
        flashSale: { ...productData.flashSale, [name]: value },
      });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: 'discount' | 'flashSale'
  ) => {
    const { checked, name } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      [field]: { ...prevState[field], [name]: checked },
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
      setFileInputKey(Date.now());
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('stock', productData.stock);
      formData.append('category', productData.category);
      if (productData.subcategory)
        formData.append('subcategory', productData.subcategory);
      formData.append('brand', productData.brand);
      formData.append('bestSeller', String(productData.bestSeller));

      formData.append(
        'discount.isDiscounted',
        String(productData.discount.isDiscounted)
      );
      formData.append(
        'discount.discountPercent',
        productData.discount.discountPercent
      );

      formData.append(
        'flashSale.isFlashSale',
        String(productData.flashSale.isFlashSale)
      );
      formData.append(
        'flashSale.flashSalePrice',
        productData.flashSale.flashSalePrice
      );
      formData.append(
        'flashSale.flashSaleEndTime',
        productData.flashSale.flashSaleEndTime
      );

      images.forEach((img) => formData.append('images', img));

      const response = await apiClient.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success('Product created successfully');
        closeModal();
        onSuccess();
      } else {
        toast.error('Error creating product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75'>
      <div className='bg-body-light dark:bg-dark-light rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto'>
        <div
          className='bg-dark-secondary fixed inset-0'
          onClick={closeModal}
        ></div>
        <div className='relative bg-body-light dark:bg-dark-light rounded-lg shadow-lg p-6 max-w-4xl w-full z-10'>
          <button
            onClick={closeModal}
            className='absolute top-4 right-4 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
          >
            <MdClose size={24} />
          </button>
          <Toaster position='top-right' />
          <form
            onSubmit={handleSubmit}
            encType='multipart/form-data'
            className='space-y-4 bg-body-light dark:bg-dark-light'
          >
            <h2 className='text-3xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-6'>
              Create Product
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
              <div className='col-span-full'>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
                >
                  Product Name
                </label>
                <input
                  type='text'
                  name='name'
                  id='name'
                  value={productData.name}
                  onChange={handleChange}
                  required
                  placeholder='Enter product name'
                  className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-body-light dark:bg-dark-light dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm focus:outline-none'
                />
              </div>

              <div className='col-span-full'>
                <label
                  htmlFor='description'
                  className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
                >
                  Description
                </label>
                <textarea
                  id='description'
                  name='description'
                  rows={3}
                  value={productData.description}
                  onChange={handleChange}
                  required
                  placeholder='Enter product description'
                  className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-body-light dark:bg-dark-light dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm focus:outline-none'
                />
              </div>

              <div>
                <label
                  htmlFor='price'
                  className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
                >
                  Price
                </label>
                <div className='relative'>
                  <span className='absolute inset-y-0 left-0 pl-3 flex items-center text-text-secondary-light dark:text-text-secondary-dark text-sm'>
                    ₦
                  </span>
                  <input
                    type='number'
                    name='price'
                    id='price'
                    value={productData.price}
                    onChange={handleChange}
                    required
                    className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark pl-8 p-3 text-text-primary-light bg-body-light dark:bg-dark-light dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm focus:outline-none'
                    placeholder='0.00'
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='stock'
                  className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
                >
                  Stock
                </label>
                <select
                  name='stock'
                  id='stock'
                  value={productData.stock}
                  onChange={handleChange}
                  required
                  className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-body-light dark:bg-dark-light dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm focus:outline-none'
                >
                  <option value=''>Select stock quantity</option>
                  {[...Array(200).keys()].map((num) => (
                    <option key={num + 1} value={num + 1}>
                      {num + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor='category'
                  className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
                >
                  Category
                </label>
                <select
                  name='category'
                  id='category'
                  value={productData.category}
                  onChange={handleChange}
                  required
                  className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-body-light dark:bg-dark-light dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm focus:outline-none'
                >
                  <option value=''>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor='subcategory'
                  className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
                >
                  Subcategory
                </label>
                <select
                  name='subcategory'
                  id='subcategory'
                  value={productData.subcategory || ''}
                  onChange={handleChange}
                  className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-body-light dark:bg-dark-light dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm focus:outline-none'
                >
                  <option value=''>Select a subcategory</option>
                  {subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor='brand'
                  className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
                >
                  Brand
                </label>
                <input
                  type='text'
                  name='brand'
                  id='brand'
                  value={productData.brand}
                  onChange={handleChange}
                  required
                  placeholder='Enter product brand'
                  className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-body-light dark:bg-dark-light dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm focus:outline-none'
                />
              </div>

              <div>
                <label
                  htmlFor='bestSeller'
                  className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
                >
                  Best Seller
                </label>
                <select
                  name='bestSeller'
                  id='bestSeller'
                  value={productData.bestSeller ? 'true' : 'false'}
                  onChange={handleChange}
                  required
                  className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-body-light dark:bg-dark-light dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm focus:outline-none'
                >
                  <option value='false'>No</option>
                  <option value='true'>Yes</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'>
                  Discount
                </label>
                <div className='flex items-center mt-2'>
                  <input
                    type='checkbox'
                    id='isDiscounted'
                    name='isDiscounted'
                    checked={productData.discount.isDiscounted}
                    onChange={(e) => handleCheckboxChange(e, 'discount')}
                    className='h-4 w-4 text-accent-light dark:text-accent-dark focus:ring-accent-light dark:focus:ring-accent-dark border-border-light dark:border-border-dark rounded'
                  />
                  <label
                    htmlFor='isDiscounted'
                    className='ml-2 text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
                  >
                    Is Discounted
                  </label>
                </div>
                {productData.discount.isDiscounted && (
                  <div className='mt-4 space-y-4'>
                    <div>
                      <label
                        htmlFor='discountPercent'
                        className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
                      >
                        Discount Percent
                      </label>
                      <input
                        type='number'
                        id='discountPercent'
                        name='discountPercent'
                        value={productData.discount.discountPercent}
                        onChange={handleChange}
                        className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-body-light dark:bg-dark-light dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm focus:outline-none'
                        placeholder='0'
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'>
                  Flash Sale
                </label>
                <div className='flex items-center mt-2'>
                  <input
                    type='checkbox'
                    id='isFlashSale'
                    name='isFlashSale'
                    checked={productData.flashSale.isFlashSale}
                    onChange={(e) => handleCheckboxChange(e, 'flashSale')}
                    className='h-4 w-4 text-accent-light dark:text-accent-dark focus:ring-accent-light dark:focus:ring-accent-dark border-border-light dark:border-border-dark rounded'
                  />
                  <label
                    htmlFor='isFlashSale'
                    className='ml-2 text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
                  >
                    Is Flash Sale
                  </label>
                </div>
                {productData.flashSale.isFlashSale && (
                  <div className='mt-4 space-y-4'>
                    <div>
                      <label
                        htmlFor='flashSalePrice'
                        className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
                      >
                        Flash Sale Price
                      </label>
                      <input
                        type='number'
                        id='flashSalePrice'
                        name='flashSalePrice'
                        value={productData.flashSale.flashSalePrice}
                        onChange={handleChange}
                        className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-body-light dark:bg-dark-light dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm focus:outline-none'
                        placeholder='0.00'
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='flashSaleEndTime'
                        className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
                      >
                        Flash Sale End Time
                      </label>
                      <input
                        type='datetime-local'
                        id='flashSaleEndTime'
                        name='flashSaleEndTime'
                        value={productData.flashSale.flashSaleEndTime}
                        onChange={handleChange}
                        className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-body-light dark:bg-dark-light dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm focus:outline-none'
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className='col-span-full'>
                <label
                  htmlFor='images'
                  className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
                >
                  Images
                </label>
                <input
                  type='file'
                  id='images'
                  name='images'
                  multiple
                  key={fileInputKey}
                  onChange={handleFileChange}
                  className='mt-2 block w-full text-sm text-text-secondary-light dark:text-text-secondary-dark file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-input-light dark:file:bg-input-dark file:text-sm file:font-semibold hover:file:bg-border-light dark:hover:file:bg-border-dark '
                />
                {images.length > 0 && (
                  <div className='mt-4'>
                    <ImageCarousel images={images} />
                  </div>
                )}
              </div>
            </div>

            <div className='flex items-center justify-end gap-x-6'>
              <button
                type='button'
                className='text-sm font-semibold text-text-primary-light dark:text-text-primary-dark'
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={loading}
                className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-gray-300 ${
                  loading
                    ? 'bg-accent-secondary-light dark:bg-accent-secondary-dark cursor-not-allowed'
                    : 'bg-button-primary-light dark:bg-button-primary-dark hover:bg-button-hover-light dark:hover:bg-button-hover-dark duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-none ring-0'
                }`}
              >
                {loading ? 'Submitting...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;
