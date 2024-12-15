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
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-dark-secondary bg-opacity-85'>
      <Toaster position='top-right' />
      <div className='bg-body-light dark:bg-dark-light rounded-lg shadow-lg w-full mx-4 my-4 md:max-w-3xl md:mx-auto max-h-[90vh] overflow-y-auto'>
        <div className='relative'>
          <button
            type='button'
            onClick={onClose}
            className='absolute top-4 right-4 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
          >
            <MdClose size={24} />
          </button>
          <div className='p-4 md:p-6'>
            <h2 className='text-2xl md:text-3xl font-semibold text-text-primary-light dark:text-text-primary-dark mb-6'>
              Edit Product
            </h2>
            <form
              onSubmit={handleSubmit}
              encType='multipart/form-data'
              className='space-y-6'
            >
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
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
                    value={productData.name || ''}
                    onChange={handleChange}
                    required={true}
                    className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-input-light dark:bg-input-dark dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm'
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
                    rows={4}
                    value={productData.description || ''}
                    onChange={handleChange}
                    required={true}
                    className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-input-light dark:bg-input-dark dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm'
                  />
                </div>

                <div className='col-span-full md:col-span-1'>
                  <label
                    htmlFor='price'
                    className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
                  >
                    Price
                  </label>
                  <div className='relative'>
                    <span className='absolute inset-y-0 left-0 pl-3 flex items-center text-text-secondary-light dark:text-text-secondary-dark text-sm'>
                      $
                    </span>
                    <input
                      type='number'
                      name='price'
                      id='price'
                      value={productData.price || ''}
                      onChange={handleChange}
                      required={true}
                      className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark pl-8 p-3 text-text-primary-light bg-input-light dark:bg-input-dark dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm'
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
                    value={productData.stock.toString() || ''}
                    onChange={handleChange}
                    required={true}
                    className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-input-light dark:bg-input-dark dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm'
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
                    value={productData.category || ''}
                    onChange={handleChange}
                    required={true}
                    className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-input-light dark:bg-input-dark dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm'
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
                    required={subcategories.length > 0}
                    className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-input-light dark:bg-input-dark dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm'
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
                    className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
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
                    className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-input-light dark:bg-input-dark dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm'
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
                    value={String(productData.bestSeller) || ''}
                    onChange={handleChange}
                    required={false}
                    className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-input-light dark:bg-input-dark dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm'
                  >
                    <option value='true'>Yes</option>
                    <option value='false'>No</option>
                  </select>
                </div>

                <div className='col-span-full'>
                  <label
                    htmlFor='images'
                    className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
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
                    className='mt-2 block w-full text-sm text-text-secondary-light dark:text-text-secondary-dark file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-input-light dark:file:bg-input-dark file:text-sm file:font-semibold file:text-text-primary-light dark:file:text-text-primary-dark hover:file:bg-border-light dark:hover:file:bg-border-dark'
                  />
                  <div className='mt-4 space-y-4'>
                    <div className='mt-4'>
                      <h3 className='text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2'>
                        New Images
                      </h3>
                      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                        {newImagePreviews.map((img, index) => (
                          <div
                            key={index}
                            className='relative aspect-square overflow-hidden rounded-lg border border-border-light dark:border-border-dark shadow-sm bg-input-light dark:bg-input-dark'
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
                              className='absolute top-2 right-2 bg-accent-light dark:bg-accent-dark text-white rounded-full p-1.5 hover:bg-accent-secondary-light dark:hover:bg-accent-secondary-dark transition-colors duration-300'
                            >
                              <MdDelete size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <ImageCarousel
                        images={productData.images || []}
                        onRemove={handleRemoveImage}
                        heading='Existing Images'
                      />
                    </div>
                  </div>
                </div>

                <div className='col-span-full'>
                  <label
                    htmlFor='discount.isDiscounted'
                    className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
                  >
                    Is Discounted
                  </label>
                  <select
                    name='discount.isDiscounted'
                    id='discount.isDiscounted'
                    value={String(productData.discount.isDiscounted) || ''}
                    onChange={handleChange}
                    required={false}
                    className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-input-light dark:bg-input-dark dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm'
                  >
                    <option value='true'>Yes</option>
                    <option value='false'>No</option>
                  </select>

                  {productData.discount.isDiscounted && (
                    <div className='mt-4'>
                      <label
                        htmlFor='discount.discountPercent'
                        className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
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
                        className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-input-light dark:bg-input-dark dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm'
                        placeholder='0'
                      />
                    </div>
                  )}
                </div>

                <div className='col-span-full'>
                  <label
                    htmlFor='flashSale.isFlashSale'
                    className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
                  >
                    Is Flash Sale
                  </label>
                  <select
                    name='flashSale.isFlashSale'
                    id='flashSale.isFlashSale'
                    value={String(productData.flashSale.isFlashSale) || ''}
                    onChange={handleChange}
                    required={false}
                    className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-input-light dark:bg-input-dark dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm'
                  >
                    <option value='true'>Yes</option>
                    <option value='false'>No</option>
                  </select>

                  {productData.flashSale.isFlashSale && (
                    <div className='space-y-4 mt-4'>
                      <div>
                        <label
                          htmlFor='flashSale.flashSalePrice'
                          className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
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
                          className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-input-light dark:bg-input-dark dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm'
                          placeholder='0'
                        />
                      </div>

                      <div>
                        <label
                          htmlFor='flashSale.flashSaleEndTime'
                          className='block text-sm font-medium text-text-primary-light dark:text-text-primary-dark'
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
                          className='mt-2 block w-full rounded-md border border-border-light dark:border-border-dark p-3 text-text-primary-light bg-input-light dark:bg-input-dark dark:text-text-primary-dark shadow-sm focus:border-accent-light focus:ring-accent-light dark:focus:border-accent-dark dark:focus:ring-accent-dark sm:text-sm'
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className='flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0 mt-6'>
                <button
                  type='button'
                  onClick={onClose}
                  className='inline-flex justify-center items-center px-4 py-2 border border-border-light dark:border-border-dark rounded-md text-base font-medium text-text-primary-light dark:text-text-primary-dark bg-body-light dark:bg-dark-light hover:bg-border-light dark:hover:bg-border-dark'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={loading}
                  className='inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md text-base font-medium text-white bg-button-primary-light dark:bg-button-primary-dark hover:bg-button-hover-light dark:hover:bg-button-hover-dark disabled:opacity-50 disabled:cursor-not-allowed'
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
