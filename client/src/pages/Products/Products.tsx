import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchProducts } from "../../features/product/productSlice";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const Products = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts({ queryParams: {} }));
  }, [dispatch]);

  if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (error)
    return <p className="text-center text-xl text-red-500">Error: {error}</p>;

  return (
    <>
      <div className="font-[sans-serif] py-4 mx-auto lg:max-w-7xl sm:max-w-full">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-12">
          Premium Sneakers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-gray-50 shadow-md overflow-hidden rounded-lg cursor-pointer hover:-translate-y-2 transition-all relative"
            >
              <div className="bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer absolute top-3 right-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16px"
                  className="fill-gray-800 inline-block"
                  viewBox="0 0 64 64"
                >
                  <path d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"></path>
                </svg>
              </div>
              <Link to={`/product/${product._id}`}>
                <div className="w-5/6 h-[260px] p-4 overflow-hidden mx-auto aspect-w-16 aspect-h-8">
                  <img
                    src={product.images[0]?.url || "/placeholder-image.jpg"}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-lg font-bold text-gray-800">
                    {product.name}
                  </h3>
                  <h4 className="text-lg text-gray-800 font-bold mt-2">
                    ${product.price}
                  </h4>
                  <p className="text-gray-600 text-sm mt-2">
                    {product.description}
                  </p>
                  <div className="flex space-x-2 mt-4">
                    {product.ratings > 0 ? (
                      <>
                        {[...Array(5)].map((_, index) => (
                          <FaStar
                            key={index}
                            className={`w-4 ${
                              index < product.ratings
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-gray-600">
                          {product.ratings}/5
                        </span>
                      </>
                    ) : (
                      <p className="text-gray-600">No Rating</p>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Products;
