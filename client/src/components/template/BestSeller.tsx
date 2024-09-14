import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchProducts } from "../../features/product/productSlice";
import { Link } from "react-router-dom";

const BestSellers: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts({ queryParams: {} }));
  }, [dispatch]);

  const bestSellers = products
    .filter((product) => product.bestSeller)
    .slice(0, 10);

  if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (error)
    return <p className="text-center text-xl text-red-500">Error: {error}</p>;

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <div className="inline-flex gap-2 items-center mb-3">
          <p className="text-gray-400 prata dark:text-white">
            Best{" "}
            <span className="text-gray-700 font-medium dark:text-white">
              Sellers
            </span>
          </p>
          <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700 dark:bg-white"></p>
        </div>
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-700 dark:text-white">
          Explore our top-selling products. Don't miss out on the best deals!
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestSellers.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="text-gray-700 cursor-pointer border border-gray-300 p-3 rounded-md hover:border-gray-500 transition"
          >
            <div className="relative overflow-hidden h-0 pb-[100%]">
              <img
                src={product.images[0]?.url || "/placeholder-image.jpg"}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-contain hover:scale-110 transition ease-in-out"
              />
            </div>
            <p className="pt-3 pb-1 text-xs sm:text-sm text-gray-700 dark:text-white">
              {product.name}
            </p>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-white">
              ${product.price}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BestSellers;
