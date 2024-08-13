import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import ImageCarousel from "../previews/ImageCarousel";

interface Category {
  id: string;
  name: string;
}

interface ProductData {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  brand: string;
}

const CreateProduct: React.FC = () => {
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fileInputKey, setFileInputKey] = useState<number>(Date.now());
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<{ categories: Category[] }>(
          "/api/category"
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
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
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("stock", productData.stock);
      formData.append("category", productData.category);
      formData.append("brand", productData.brand);

      images.forEach((img) => formData.append("images", img));

      const response = await axios.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("Product created successfully");
        navigate("/products");
      } else {
        toast.error("Error creating product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Error creating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster position="top-right" />
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-8 bg-white shadow-lg rounded-lg p-8"
      >
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">
          Create Product
        </h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
          <div className="col-span-full">
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
              className="mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="col-span-full">
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
              className="mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-900"
            >
              Price
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">
                $
              </span>
              <input
                type="number"
                name="price"
                id="price"
                value={productData.price}
                onChange={handleChange}
                required
                className="mt-2 block w-full rounded-md border border-gray-300 pl-8 p-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
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
              className="mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select stock quantity</option>
              {[...Array(100).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>
          </div>

          <div>
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
              className="mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
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
              className="mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="col-span-full">
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
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
            />
            {images.length > 0 && (
              <div className="mt-4">
                <ImageCarousel images={images} />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold text-gray-900"
            onClick={() => navigate("/products")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-gray-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-secondary hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            }`}
          >
            {loading ? "Submitting..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
