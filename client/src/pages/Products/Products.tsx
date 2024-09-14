import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  fetchProducts,
  fetchCategories,
  fetchSubcategoriesByCategory,
} from "../../features/product/productSlice";
import { Link } from "react-router-dom";
import { FaArrowRight, FaStar, FaStarHalf, FaRegStar } from "react-icons/fa6";
import { CiSearch, CiCircleRemove } from "react-icons/ci";
import debounce from "lodash.debounce";

const Products = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error, categories, subcategories } =
    useAppSelector((state) => state.product);

  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );
  const [sortOption, setSortOption] = useState<string>("");
  const [inputQuery, setInputQuery] = useState(""); // Separate state for input value
  const [searchQuery, setSearchQuery] = useState(""); // State for debounced query

  // Fetch products when filters, sort, or search query changes
  useEffect(() => {
    const queryParams: { sort?: string; category?: string; keyword?: string } =
      {};
    if (sortOption) queryParams.sort = sortOption;
    if (selectedCategories.length > 0)
      queryParams.category = selectedCategories.join(",");
    if (searchQuery) queryParams.keyword = searchQuery;

    dispatch(fetchProducts({ queryParams }));
  }, [dispatch, sortOption, selectedCategories, searchQuery]);

  // Fetch categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch subcategories based on selected categories
  useEffect(() => {
    if (selectedCategories.length > 0) {
      selectedCategories.forEach((categoryId) => {
        dispatch(fetchSubcategoriesByCategory(categoryId));
      });
    }
  }, [selectedCategories, dispatch]);

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId]
    );
  };

  // Handle subcategory change
  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategories((prevSubcategories) =>
      prevSubcategories.includes(subcategoryId)
        ? prevSubcategories.filter((id) => id !== subcategoryId)
        : [...prevSubcategories, subcategoryId]
    );
  };

  // Handle sort change
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  // Debounce search input to avoid excessive API calls
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 800),
    []
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputQuery(value); // Update input value immediately
    debouncedSearch(value); // Update debounced query with delay
  };

  // Clear search input and display all products
  const clearSearch = () => {
    setInputQuery(""); // Clear input value
    setSearchQuery(""); // Clear debounced query
    debouncedSearch(""); // Trigger fetching all products
  };

  // Find subcategories for selected categories
  const filteredSubcategories = subcategories.filter((subcategory) =>
    selectedCategories.includes(subcategory.category)
  );

  if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (error)
    return <p className="text-center text-xl text-red-500">Error: {error}</p>;

  const renderRatingStars = (ratings: number) => {
    const fullStars = Math.floor(ratings);
    const halfStars = ratings % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;
    return (
      <>
        {Array(fullStars)
          .fill(0)
          .map((_, idx) => (
            <FaStar key={`full-${idx}`} className="text-yellow-400" />
          ))}
        {halfStars === 1 && <FaStarHalf className="text-yellow-400" />}
        {Array(emptyStars)
          .fill(0)
          .map((_, idx) => (
            <FaRegStar key={`empty-${idx}`} className="text-gray-300" />
          ))}
      </>
    );
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
        <div className="min-w-60">
          <p
            className="my-2 text-xl flex items-center cursor-pointer gap-2"
            onClick={() => setShowFilter(!showFilter)}
          >
            FILTERS
            <FaArrowRight
              className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            />
          </p>

          <div
            className={`border border-gray-300 pl-5 py-3 mt-6 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">Categories</p>
            <div className="flex flex-col gap-2 text-xs font-light text-gray-700">
              {categories.map((category) => (
                <p key={category._id} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    className="w-3"
                    id={category._id}
                    value={category._id}
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => handleCategoryChange(category._id)}
                  />
                  <label htmlFor={category._id}>{category.name}</label>
                </p>
              ))}
            </div>
          </div>

          {selectedCategories.length > 0 &&
            filteredSubcategories.length > 0 && (
              <div
                className={`border border-gray-300 pl-5 py-3 my-5 ${
                  showFilter ? "" : "hidden"
                } sm:block`}
              >
                <p className="mb-3 text-sm font-medium">Subcategories</p>
                <div className="flex flex-col gap-2 text-xs font-light text-gray-700">
                  {filteredSubcategories.map((subcategory) => (
                    <p
                      key={subcategory._id}
                      className="flex gap-2 items-center"
                    >
                      <input
                        type="checkbox"
                        className="w-3"
                        id={subcategory._id}
                        value={subcategory._id}
                        checked={selectedSubcategories.includes(
                          subcategory._id
                        )}
                        onChange={() =>
                          handleSubcategoryChange(subcategory._id)
                        }
                      />
                      <label htmlFor={subcategory._id}>
                        {subcategory.name}
                      </label>
                    </p>
                  ))}
                </div>
              </div>
            )}
        </div>
        <div className="flex-1 py-12 bg-white sm:py-16 lg:py-20">
          <div className="flex justify-between text-base sm:text-2xl mb-4">
            <div className="relative flex items-center">
              <CiSearch size={24} className="absolute left-3 text-gray-500" />
              <input
                type="text"
                value={inputQuery} // Use inputQuery for immediate input value
                onChange={handleSearchChange}
                placeholder="Search..."
                className="border border-gray-300 rounded px-8 py-1 text-sm w-full pl-12"
              />
              {inputQuery && (
                <CiCircleRemove
                  size={20}
                  className="absolute right-3 text-gray-500 cursor-pointer"
                  onClick={clearSearch}
                />
              )}
            </div>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="">Sort By</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="createdAt">Newest First</option>
              <option value="-createdAt">Oldest First</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-10 lg:mt-8 lg:gap-4 lg:grid-cols-4">
            {products.map((product) => (
              <div key={product._id} className="relative group border">
                <Link to={`/product/${product._id}`} title={product.name}>
                  <div className="overflow-hidden aspect-square">
                    <img
                      className="object-cover w-full h-full transition-all duration-300 group-hover:scale-90"
                      src={product.images[0]?.url || "/placeholder-image.jpg"}
                      alt={product.name}
                    />
                  </div>

                  <div className="flex items-start justify-between mt-4 space-x-4 p-2">
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                        {product.name}
                        <p>{product.brand}</p>
                      </h3>
                      <div className="flex items-center mt-2.5 space-x-px">
                        {renderRatingStars(product.ratings)}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-900 sm:text-sm md:text-base">
                        ${product.price}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
