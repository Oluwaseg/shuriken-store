import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import ImageCarousel from "../previews/Image";
import { Product, Category } from "../tables/types/type";

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

  useEffect(() => {
    setProductData(product);
  }, [product]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductData((prev: Product) => ({ ...prev, [name]: value }));
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
    setProductData((prev: Product) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", String(productData.price));
      formData.append("stock", String(productData.stock));
      formData.append("category", productData.category);
      formData.append("brand", productData.brand);

      productData.images.forEach((img) => formData.append("images[]", img.url));
      newImages.forEach((img) => formData.append("images", img));
      imagesToRemove.forEach((img) => formData.append("remove_images[]", img));

      const response = await axios.put(
        `/api/products/${product._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        toast.success("Product updated successfully");
        onUpdate(response.data.product);
        onClose();
      } else {
        toast.error("Error updating product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error updating product");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-gray-500  bg-opacity-75 flex items-center justify-center z-[10] overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto z-[1000]">
        <div className="relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 dark:text-white hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="p-6">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
              Edit Product
            </h2>
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="col-span-1">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={productData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full dark:bg-gray-800 rounded-md border border-gray-300 p-3 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={productData.description}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full dark:bg-gray-800 rounded-md border border-gray-300 p-3 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    value={productData.price}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full dark:bg-gray-800 rounded-md border border-gray-300 p-3 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Stock
                  </label>
                  <select
                    name="stock"
                    id="stock"
                    value={productData.stock}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full dark:bg-gray-800 rounded-md border border-gray-300 p-3 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select stock quantity</option>
                    {[...Array(100).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={productData.category}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full dark:bg-gray-800 rounded-md border border-gray-300 p-3 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="brand"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    id="brand"
                    value={productData.brand}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full dark:bg-gray-800 rounded-md border border-gray-300 p-3 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="images"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Product Images
                  </label>
                  <input
                    key={fileInputKey}
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="mt-1"
                  />
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      New Images
                    </h3>
                    <div className="flex gap-4 mt-2">
                      {newImagePreviews.map((img, index) => (
                        <div
                          key={index}
                          className="relative w-24 h-24 overflow-hidden rounded-md border border-gray-300 shadow-sm"
                        >
                          <img
                            src={img}
                            alt={`preview-${index}`}
                            className="object-cover w-full h-full"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setNewImagePreviews((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors duration-300"
                          >
                            <MdDelete size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2">
                    <ImageCarousel
                      images={productData.images}
                      onRemove={handleRemoveImage}
                      heading="Existing Images"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {loading ? "Updating..." : "Update Product"}
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
