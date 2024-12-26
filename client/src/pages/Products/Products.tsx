import { AnimatePresence, motion } from 'framer-motion';
import debounce from 'lodash.debounce';
import {
  ChevronDown,
  ChevronUp,
  Heart,
  Search,
  ShoppingCart,
  Star,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchCategories,
  fetchProducts,
  fetchSubcategoriesByCategory,
} from '../../features/product/productSlice';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Category, Subcategory } from '../../types/type';

const Products = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error, categories, subcategories } =
    useAppSelector((state) => state.product);

  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );
  const [sortOption, setSortOption] = useState<string>('');
  const [inputQuery, setInputQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const queryParams: { sort?: string; category?: string; keyword?: string } =
      {};
    if (sortOption) queryParams.sort = sortOption;
    if (selectedCategories.length > 0)
      queryParams.category = selectedCategories.join(',');
    if (searchQuery) queryParams.keyword = searchQuery;

    dispatch(fetchProducts({ queryParams }));
  }, [dispatch, sortOption, selectedCategories, searchQuery]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategories.length > 0) {
      selectedCategories.forEach((categoryId) => {
        dispatch(fetchSubcategoriesByCategory(categoryId));
      });
    }
  }, [selectedCategories, dispatch]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId]
    );
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategories((prevSubcategories) =>
      prevSubcategories.includes(subcategoryId)
        ? prevSubcategories.filter((id) => id !== subcategoryId)
        : [...prevSubcategories, subcategoryId]
    );
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 800),
    []
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputQuery(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setInputQuery('');
    setSearchQuery('');
    debouncedSearch('');
  };

  const filteredSubcategories = subcategories.filter((subcategory) =>
    selectedCategories.includes(subcategory.category)
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className='bg-body-light dark:bg-body-dark min-h-screen'>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-8'>
          Our Products
        </h1>
        <div className='flex flex-col lg:flex-row gap-8'>
          <Sidebar
            categories={categories}
            subcategories={filteredSubcategories}
            selectedCategories={selectedCategories}
            selectedSubcategories={selectedSubcategories}
            handleCategoryChange={handleCategoryChange}
            handleSubcategoryChange={handleSubcategoryChange}
            showFilter={showFilter}
            setShowFilter={setShowFilter}
          />
          <div className='flex-1'>
            <div className='flex flex-col sm:flex-row justify-between items-center mb-6 gap-4'>
              <SearchBar
                inputQuery={inputQuery}
                handleSearchChange={handleSearchChange}
                clearSearch={clearSearch}
              />
              <SortDropdown
                sortOption={sortOption}
                handleSortChange={handleSortChange}
              />
            </div>
            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className='flex justify-center items-center h-screen'>
    <motion.div
      className='w-16 h-16 border-4 border-accent-light dark:border-accent-dark rounded-full border-t-transparent'
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className='text-center text-xl text-red-500 p-8'>
    <p>Error: {message}</p>
  </div>
);

const Sidebar = ({
  categories,
  subcategories,
  selectedCategories,
  selectedSubcategories,
  handleCategoryChange,
  handleSubcategoryChange,
  showFilter,
  setShowFilter,
}: {
  categories: Category[];
  subcategories: Subcategory[];
  selectedCategories: string[];
  selectedSubcategories: string[];
  handleCategoryChange: (categoryId: string) => void;
  handleSubcategoryChange: (subcategoryId: string) => void;
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
}) => (
  <motion.div
    className='w-full lg:w-64 bg-white dark:bg-dark-light rounded-lg shadow-md overflow-hidden'
    initial={{ height: 0 }}
    animate={{ height: showFilter ? 'auto' : '3rem' }}
    transition={{ duration: 0.3 }}
  >
    <div
      className='p-4 flex justify-between items-center cursor-pointer'
      onClick={() => setShowFilter(!showFilter)}
    >
      <h2 className='text-xl font-semibold text-text-primary-light dark:text-text-primary-dark'>
        Filters
      </h2>
      {showFilter ? (
        <ChevronUp className='text-text-primary-light dark:text-text-primary-dark' />
      ) : (
        <ChevronDown className='text-text-primary-light dark:text-text-primary-dark' />
      )}
    </div>
    <AnimatePresence>
      {showFilter && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='p-4'
        >
          <FilterSection
            title='Categories'
            items={categories}
            selectedItems={selectedCategories}
            handleChange={handleCategoryChange}
          />
          {selectedCategories.length > 0 && subcategories.length > 0 && (
            <FilterSection
              title='Subcategories'
              items={subcategories}
              selectedItems={selectedSubcategories}
              handleChange={handleSubcategoryChange}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const FilterSection = ({
  title,
  items,
  selectedItems,
  handleChange,
}: {
  title: string;
  items: { _id: string; name: string }[];
  selectedItems: string[];
  handleChange: (id: string) => void;
}) => (
  <div className='mb-4'>
    <h3 className='font-semibold mb-2 text-text-primary-light dark:text-text-primary-dark'>
      {title}
    </h3>
    <div className='space-y-2'>
      {items.map((item) => (
        <label
          key={item._id}
          className='flex items-center space-x-2 cursor-pointer'
        >
          <input
            type='checkbox'
            className='form-checkbox text-accent-light dark:text-accent-dark'
            checked={selectedItems.includes(item._id)}
            onChange={() => handleChange(item._id)}
          />
          <span className='text-text-secondary-light dark:text-text-secondary-dark'>
            {item.name}
          </span>
        </label>
      ))}
    </div>
  </div>
);

const SearchBar = ({
  inputQuery,
  handleSearchChange,
  clearSearch,
}: {
  inputQuery: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearch: () => void;
}) => (
  <div className='relative w-full sm:w-64'>
    <input
      type='text'
      value={inputQuery}
      onChange={handleSearchChange}
      placeholder='Search products...'
      className='w-full pl-10 pr-10 py-2 border border-border-light dark:border-border-dark rounded-full bg-input-light dark:bg-input-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark'
    />
    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark' />
    {inputQuery && (
      <button
        onClick={clearSearch}
        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light dark:hover:text-accent-dark'
      >
        <X size={18} />
      </button>
    )}
  </div>
);

const SortDropdown = ({
  sortOption,
  handleSortChange,
}: {
  sortOption: string;
  handleSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <select
    value={sortOption}
    onChange={handleSortChange}
    className='border border-border-light dark:border-border-dark rounded-full px-4 py-2 bg-input-light dark:bg-input-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark'
  >
    <option value=''>Sort By</option>
    <option value='price'>Price: Low to High</option>
    <option value='-price'>Price: High to Low</option>
    <option value='-createdAt'>Newest First</option>
    <option value='createdAt'>Oldest First</option>
  </select>
);

import { Product } from '../../types/type';
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const ProductGrid = ({ products }: { products: Product[] }) => (
  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
    {products.map((product) => (
      <ProductCard key={product._id} product={product} />
    ))}
  </div>
);

const ProductCard = ({ product }: { product: Product }) => (
  <motion.div
    className='group relative bg-white dark:bg-dark-light rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden'
    whileHover={{ y: -4 }}
  >
    <Link to={`/product/${product._id}`} className='block'>
      {/* Image Container */}
      <div className='relative aspect-[4/3] overflow-hidden'>
        <motion.img
          src={product.images[0]?.url || '/placeholder-image.jpg'}
          alt={product.name}
          className='w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500'
        />
        {/* Discount Badge */}
        {product?.discount?.isDiscounted && (
          <div className='absolute top-3 left-3 bg-accent-light dark:bg-accent-dark text-white px-3 py-1.5 rounded-full'>
            <span className='text-sm font-bold'>
              {Math.round(product.discount.discountPercent)}% OFF
            </span>
          </div>
        )}
        {/* Quick Action Buttons */}
        <div className='absolute right-3 top-3 flex flex-col gap-2 transform translate-x-12 group-hover:translate-x-0 transition-transform duration-300'>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className='p-2 rounded-full bg-white dark:bg-dark-light shadow-md hover:bg-accent-light dark:hover:bg-accent-dark text-text-primary-light dark:text-text-primary-dark hover:text-white transition-colors duration-200'
          >
            <Heart size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className='p-2 rounded-full bg-white dark:bg-dark-light shadow-md hover:bg-accent-light dark:hover:bg-accent-dark text-text-primary-light dark:text-text-primary-dark hover:text-white transition-colors duration-200'
          >
            <ShoppingCart size={20} />
          </motion.button>
        </div>
      </div>

      {/* Content Container */}
      <div className='p-4'>
        {/* Brand */}
        <p className='text-sm font-medium text-accent-light dark:text-accent-dark mb-1'>
          {product.brand}
        </p>

        {/* Title */}
        <h3 className='text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2 line-clamp-2 min-h-[3.5rem]'>
          {product.name}
        </h3>

        {/* Rating */}
        <div className='flex items-center gap-1 mb-3'>
          <div className='flex gap-0.5'>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${
                  i < Math.floor(product.ratings)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className='text-sm text-text-secondary-light dark:text-text-secondary-dark'>
            ({product.numOfReviews})
          </span>
        </div>

        {/* Price */}
        <div className='flex items-center gap-2'>
          <p className='text-2xl font-bold text-text-primary-light dark:text-text-primary-dark'>
            ₦{formatPrice(Math.round(product.price))}
          </p>
          {product?.discount?.isDiscounted && (
            <p className='text-sm text-text-secondary-light dark:text-text-secondary-dark line-through'>
              ₦
              {formatPrice(
                Math.round(
                  product.price / (1 - product.discount.discountPercent / 100)
                )
              )}
            </p>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className='w-full mt-4 bg-button-primary-light dark:bg-button-primary-dark text-white py-2.5 px-4 rounded-lg font-medium hover:bg-button-hover-light dark:hover:bg-button-hover-dark transition-colors duration-200 flex items-center justify-center gap-2'
        >
          <ShoppingCart size={18} />
          <span>Add to Cart</span>
        </motion.button>
      </div>
    </Link>
  </motion.div>
);

export default Products;
