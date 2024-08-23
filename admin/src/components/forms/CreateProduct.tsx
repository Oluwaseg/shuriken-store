import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import ImageCarousel from "../previews/ImageCarousel";

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
  bestSeller: boolean; // 'Yes' or 'No'
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

const CreateProduct: React.FC = () => {
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    subcategory: "",
    brand: "",
    bestSeller: false, // Default value
    discount: {
      isDiscounted: false,
      discountPercent: "0",
    },
    flashSale: {
      isFlashSale: false,
      flashSalePrice: "0.00",
      flashSaleEndTime: "",
    },
  });
  const [images, setImages] = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
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

  useEffect(() => {
    if (productData.category) {
      const fetchSubcategories = async () => {
        try {
          const response = await axios.get<{ subcategories: Subcategory[] }>(
            `/api/subcategories/${productData.category}`
          );
          setSubcategories(response.data.subcategories);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
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
    field: "discount" | "flashSale"
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
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("stock", productData.stock);
      formData.append("category", productData.category);
      if (productData.subcategory)
        formData.append("subcategory", productData.subcategory);
      formData.append("brand", productData.brand);
      formData.append("bestSeller", String(productData.bestSeller));

      formData.append(
        "discount.isDiscounted",
        String(productData.discount.isDiscounted)
      );
      formData.append(
        "discount.discountPercent",
        productData.discount.discountPercent
      );

      formData.append(
        "flashSale.isFlashSale",
        String(productData.flashSale.isFlashSale)
      );
      formData.append(
        "flashSale.flashSalePrice",
        productData.flashSale.flashSalePrice
      );
      formData.append(
        "flashSale.flashSaleEndTime",
        productData.flashSale.flashSaleEndTime
      );

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
        className="space-y-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8"
      >
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">
          Create Product
        </h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
          <div className="col-span-full">
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
              className="mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="col-span-full">
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
              className="mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-900 dark:text-white"
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
                className="mt-2 block w-full rounded-md border border-gray-300 pl-8 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
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
              className="mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select stock quantity</option>
              {[...Array(200).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>
          </div>

          <div>
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
              className="mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="subcategory"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Subcategory
            </label>
            <select
              name="subcategory"
              id="subcategory"
              value={productData.subcategory || ""}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
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
              className="mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="bestSeller"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Best Seller
            </label>
            <select
              name="bestSeller"
              id="bestSeller"
              value={productData.bestSeller ? "true" : "false"}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Discount
            </label>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="isDiscounted"
                name="isDiscounted"
                checked={productData.discount.isDiscounted}
                onChange={(e) => handleCheckboxChange(e, "discount")}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isDiscounted"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Is Discounted
              </label>
            </div>
            {productData.discount.isDiscounted && (
              <div className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="discountPercent"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Discount Percent
                  </label>
                  <input
                    type="number"
                    id="discountPercent"
                    name="discountPercent"
                    value={productData.discount.discountPercent}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Flash Sale
            </label>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="isFlashSale"
                name="isFlashSale"
                checked={productData.flashSale.isFlashSale}
                onChange={(e) => handleCheckboxChange(e, "flashSale")}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isFlashSale"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Is Flash Sale
              </label>
            </div>
            {productData.flashSale.isFlashSale && (
              <div className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="flashSalePrice"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Flash Sale Price
                  </label>
                  <input
                    type="number"
                    id="flashSalePrice"
                    name="flashSalePrice"
                    value={productData.flashSale.flashSalePrice}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label
                    htmlFor="flashSaleEndTime"
                    className="block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Flash Sale End Time
                  </label>
                  <input
                    type="datetime-local"
                    id="flashSaleEndTime"
                    name="flashSaleEndTime"
                    value={productData.flashSale.flashSaleEndTime}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-md border border-gray-300 p-3 text-gray-900 bg-primary dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="col-span-full">
            <label
              htmlFor="images"
              className="block text-sm font-medium text-gray-900 dark:text-white"
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
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200 "
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
            className="text-sm font-semibold text-gray-900 dark:text-white"
            onClick={() => navigate("/products")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-gray-300 ${
              loading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-secondary hover:bg-secondary hover:bg-opacity-75 duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-none ring-0"
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
