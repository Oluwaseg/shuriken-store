import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ImageCarousel from "../previews/Image";

const EditProductModal = ({ product, onClose, onUpdate }) => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
  });
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProductData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      brand: product.brand,
    });
    setImages(product.images);

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/category");
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewImages(Array.from(e.target.files));
    setFileInputKey(Date.now());
  };

  const handleRemoveImage = (index) => {
    setImagesToRemove([...imagesToRemove, images[index]]);
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("stock", productData.stock);
      formData.append("category", productData.category);
      formData.append("brand", productData.brand);

      images.forEach((img) => formData.append("images[]", img.url));

      newImages.forEach((img) => formData.append("images", img));

      imagesToRemove.forEach((img) =>
        formData.append("remove_images[]", img.url)
      );

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
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
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
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
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
                    className="block text-sm font-medium text-gray-900"
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
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-900"
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
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-900"
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
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Stock
                  </label>
                  <select
                    name="stock"
                    id="stock"
                    value={productData.stock}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                    className="block text-sm font-medium text-gray-900"
                  >
                    Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    value={productData.category}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1">
                  <label
                    htmlFor="brand"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    id="brand"
                    value={productData.brand}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="images"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Images
                  </label>
                  <input
                    type="file"
                    id="images"
                    name="images"
                    multiple
                    key={fileInputKey}
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
                  />
                  {images.length > 0 && (
                    <div className="mt-4">
                      <ImageCarousel
                        images={images}
                        onRemove={handleRemoveImage}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-x-6 mt-6">
                <button
                  type="button"
                  className="text-sm font-semibold text-gray-900"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-gray-300 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {loading ? "Submitting..." : "Update Product"}
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
