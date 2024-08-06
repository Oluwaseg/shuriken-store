import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import EditProductModal from "../modals/EditProduct";
import { Product, Category } from "./types/type"; // Ensure you have these types defined

const ProductsTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<{ products: Product[] }>(
          "/api/products"
        );
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Error fetching products");
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get<{ categories: Category[] }>(
          "/api/category"
        );
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Error fetching categories");
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleDelete = async (productId: string) => {
    try {
      await axios.delete(`/api/products/${productId}`);
      setProducts(products.filter((product) => product._id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product");
    }
  };

  return (
    <div className="px-3 py-2 max-w-5xl mx-auto">
      {products.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-lg font-medium text-gray-900 mb-4">
            No products available
          </p>
          <button
            onClick={() => navigate("/products/create")}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-gray-300 hover:bg-indigo-700"
          >
            Create Product
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Images
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Reviews
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product, index) => (
                <tr key={product._id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product._id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {product.description || "No description"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${product.price}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    {product.stock}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {categories.find((cat) => cat._id === product.category)
                      ?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.images.length} image
                    {product.images.length > 1 ? "s" : ""}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    {product.reviews?.length ?? 0} review
                    {(product.reviews?.length ?? 0) > 1 ? "s" : ""}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      <FaEdit className="inline-block mr-1" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrashAlt className="inline-block mr-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
};

export default ProductsTable;
