import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { MdClose, MdDelete } from 'react-icons/md';
import apiClient from '../../services/apiClient';
import ImageCarousel from '../previews/Image';
import { Category, Product, Subcategory } from '../tables/types/type';

interface EditProductModalProps {
  product: Product;
  categories: Category[];
  onClose: () => void;
  onUpdate: (product: Product) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  onClose,
  onUpdate,
  categories,
}) => {
  const [productData, setProductData] = useState<Product>(product);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [fileInputKey, setFileInputKey] = useState<number>(Date.now());
  const [loading, setLoading] = useState<boolean>(false);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  useEffect(() => {
    setProductData(product);
  }, [product]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!productData.category) {
        setSubcategories([]);
        return;
      }

      try {
        const response = await apiClient.get<{ subcategories: Subcategory[] }>(
          `/subcategories/${productData.category}`
        );
        setSubcategories(response.data.subcategories);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchSubcategories();
  }, [productData.category]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith('discount.') || name.startsWith('flashSale.')) {
      const [mainKey, subKey] = name.split('.') as [keyof Product, string];

      if (mainKey === 'discount' || mainKey === 'flashSale') {
        setProductData((prev) => ({
          ...prev,
          [mainKey]: {
            ...prev[mainKey],
            [subKey]: value === '' ? null : value,
          },
        }));
      }
    } else {
      setProductData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImageUrls = files.map((file) => URL.createObjectURL(file));
    setNewImages(files);
    setNewImagePreviews(newImageUrls);
    setFileInputKey(Date.now());
  };

  const handleRemoveImage = (index: number) => {
    const imageToRemove = productData.images[index].url;
    setImagesToRemove((prev) => [...prev, imageToRemove]);
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    let calculatedDiscountedPrice = productData.price;
    if (productData.discount.isDiscounted) {
      calculatedDiscountedPrice =
        productData.price -
        (productData.price * productData.discount.discountPercent) / 100;
    }

    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', String(productData.price));
    formData.append('stock', String(productData.stock));
    formData.append('category', productData.category);
    formData.append('brand', productData.brand);
    formData.append('bestSeller', String(productData.bestSeller));

    formData.append(
      'discount.isDiscounted',
      String(productData.discount.isDiscounted)
    );
    if (productData.discount.isDiscounted) {
      formData.append(
        'discount.discountPercent',
        String(productData.discount.discountPercent)
      );
      formData.append(
        'discount.discountedPrice',
        String(calculatedDiscountedPrice)
      );
    }

    formData.append(
      'flashSale.isFlashSale',
      String(productData.flashSale.isFlashSale)
    );
    if (productData.flashSale.isFlashSale) {
      formData.append(
        'flashSale.flashSalePrice',
        String(productData.flashSale.flashSalePrice)
      );
      formData.append(
        'flashSale.flashSaleEndTime',
        productData.flashSale.flashSaleEndTime
      );
    }

    if (productData.subcategory) {
      formData.append('subcategory', productData.subcategory);
    }

    productData.images.forEach((img) => formData.append('images[]', img.url));
    newImages.forEach((img) => formData.append('images', img));
    imagesToRemove.forEach((img) => formData.append('removeImages', img));

    try {
      const response = await apiClient.put(
        `/products/${product._id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (response.data.success) {
        toast.success('Product updated successfully');
        onUpdate(response.data.product);
        onClose();
      } else {
        toast.error('Error updating product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className='fixed inset-0 bg-gray-500  bg-opacity-75 flex items-center justify-center z-[10] overflow-y-auto'>
      <Toaster position='top-right' />
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto z-[1000]'>
        <div className='relative'>
          <button
            type='button'
            onClick={onClose}
            className='absolute top-2 right-2 text-gray-500 dark:text-white hover:text-gray-700'
          >
            <MdClose size={24} />
          </button>
          <div className='p-6'>
            <h2 className='text-3xl font-semibold text-gray-900 dark:text-white mb-6'>
              Edit Product
            </h2>
            <form
              onSubmit={handleSubmit}
              encType='multipart/form-data'
              className='space-y-6'
            >
              <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
                <div className='col-span-full'>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Product Name
                  </label>
                  <input
                    type='text'
                    name='name'
                    id='name'
                    value={productData.name || ''}
                    onChange={handleChange}
                    required={true}
                    className='mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  />
                </div>

                <div className='col-span-full'>
                  <label
                    htmlFor='description'
                    className='block text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Description
                  </label>
                  <textarea
                    id='description'
                    name='description'
                    rows={4}
                    value={productData.description || ''}
                    onChange={handleChange}
                    required={true}
                    className='mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  />
                </div>

                <div>
                  <label
                    htmlFor='price'
                    className='block text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Price
                  </label>
                  <div className='relative'>
                    <span className='absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm'>
                      $
                    </span>
                    <input
                      type='number'
                      name='price'
                      id='price'
                      value={productData.price || ''}
                      onChange={handleChange}
                      required={true}
                      className='mt-2 block w-full rounded-md border border-gray-300 pl-8 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                      placeholder='0.00'
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor='stock'
                    className='block text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Stock
                  </label>
                  <select
                    name='stock'
                    id='stock'
                    value={productData.stock.toString() || ''}
                    onChange={handleChange}
                    required={true}
                    className='mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
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
                    className='block text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Category
                  </label>
                  <select
                    name='category'
                    id='category'
                    value={productData.category || ''}
                    onChange={handleChange}
                    required={true}
                    className='mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
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
                    className='block text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Subcategory
                  </label>
                  <select
                    name='subcategory'
                    id='subcategory'
                    value={productData.subcategory || ''}
                    onChange={handleChange}
                    required={subcategories.length > 0}
                    className='mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  >
                    <option value=''>Select a subcategory</option>
                    {subcategories.map((subcat) => (
                      <option key={subcat.id} value={subcat.id}>
                        {subcat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor='brand'
                    className='block text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Brand
                  </label>
                  <input
                    type='text'
                    name='brand'
                    id='brand'
                    value={productData.brand || ''}
                    onChange={handleChange}
                    required={false}
                    className='mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  />
                </div>

                <div>
                  <label
                    htmlFor='bestSeller'
                    className='block text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Best Seller
                  </label>
                  <select
                    name='bestSeller'
                    id='bestSeller'
                    value={String(productData.bestSeller) || ''}
                    onChange={handleChange}
                    required={false}
                    className='mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  >
                    <option value='true'>Yes</option>
                    <option value='false'>No</option>
                  </select>
                </div>

                <div className='col-span-2'>
                  <label
                    htmlFor='images'
                    className='block text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Product Images
                  </label>
                  <input
                    key={fileInputKey}
                    type='file'
                    id='images'
                    accept='image/*'
                    multiple
                    onChange={handleFileChange}
                    className='mt-1'
                  />
                  <div className='mt-4'>
                    <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                      New Images
                    </h3>
                    <div className='flex gap-4 mt-2'>
                      {newImagePreviews.map((img, index) => (
                        <div
                          key={index}
                          className='relative w-24 h-24 overflow-hidden rounded-md border border-gray-300 shadow-sm'
                        >
                          <img
                            src={img}
                            alt={`preview-${index}`}
                            className='object-cover w-full h-full'
                          />
                          <button
                            type='button'
                            onClick={() =>
                              setNewImagePreviews((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                            className='absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors duration-300'
                          >
                            <MdDelete size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='mt-2'>
                    <ImageCarousel
                      images={productData.images || []}
                      onRemove={handleRemoveImage}
                      heading='Existing Images'
                    />
                  </div>
                </div>

                <div className='col-span-full'>
                  <label
                    htmlFor='discount.isDiscounted'
                    className='block text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Is Discounted
                  </label>
                  <select
                    name='discount.isDiscounted'
                    id='discount.isDiscounted'
                    value={String(productData.discount.isDiscounted) || ''}
                    onChange={handleChange}
                    required={false}
                    className='mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  >
                    <option value='true'>Yes</option>
                    <option value='false'>No</option>
                  </select>

                  {productData.discount.isDiscounted && (
                    <>
                      <div className='mt-4'>
                        <label
                          htmlFor='discount.discountPercent'
                          className='block text-sm font-medium text-gray-900 dark:text-white'
                        >
                          Discount Percent
                        </label>
                        <input
                          type='number'
                          name='discount.discountPercent'
                          id='discount.discountPercent'
                          value={productData.discount.discountPercent || ''}
                          onChange={handleChange}
                          required={false}
                          className='mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                          placeholder='0'
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className='col-span-full'>
                  <label
                    htmlFor='flashSale.isFlashSale'
                    className='block text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Is Flash Sale
                  </label>
                  <select
                    name='flashSale.isFlashSale'
                    id='flashSale.isFlashSale'
                    value={String(productData.flashSale.isFlashSale) || ''}
                    onChange={handleChange}
                    required={false}
                    className='mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  >
                    <option value='true'>Yes</option>
                    <option value='false'>No</option>
                  </select>

                  {productData.flashSale.isFlashSale && (
                    <>
                      <div className='mt-4'>
                        <label
                          htmlFor='flashSale.flashSalePrice'
                          className='block text-sm font-medium text-gray-900 dark:text-white'
                        >
                          Flash Sale Price
                        </label>
                        <input
                          type='number'
                          name='flashSale.flashSalePrice'
                          id='flashSale.flashSalePrice'
                          value={productData.flashSale.flashSalePrice || ''}
                          onChange={handleChange}
                          required={productData.flashSale.isFlashSale || ''}
                          className='mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                          placeholder='0'
                        />
                      </div>

                      <div className='mt-4'>
                        <label
                          htmlFor='flashSale.flashSaleEndTime'
                          className='block text-sm font-medium text-gray-900 dark:text-white'
                        >
                          Flash Sale End Time
                        </label>
                        <input
                          type='datetime-local'
                          name='flashSale.flashSaleEndTime'
                          id='flashSale.flashSaleEndTime'
                          value={
                            productData.flashSale.flashSaleEndTime
                              ? formatDate(
                                  productData.flashSale.flashSaleEndTime
                                )
                              : ''
                          }
                          onChange={handleChange}
                          required={productData.flashSale.isFlashSale || ''}
                          className='mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className='flex justify-end'>
                <button
                  type='button'
                  onClick={onClose}
                  className='inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-500 hover:bg-gray-600'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={loading}
                  className='ml-3 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700'
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
