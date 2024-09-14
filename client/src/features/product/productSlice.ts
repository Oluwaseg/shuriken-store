import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllProducts,
  getProductById,
  getLatestProducts,
  createOrUpdateReview,
  deleteReview,
  getProductReviews,
  getTotalProducts,
} from "../../api/product";
import {
  getAllCategories,
  getCategoryById,
  getCategoriesWithProductCount,
  getAllSubcategories,
  getSubcategoriesByCategory,
  getSubcategoryById,
} from "../../api/category";
import {
  ProductsApiResponse,
  Product,
  Review,
  QueryParams,
  Category,
  Subcategory,
} from "../../types/type";

interface ProductState {
  products: Product[];
  latestProducts: Product[];
  product: Product | null;
  reviews: Review[];
  totalProducts: number;
  categories: Category[];
  subcategories: Subcategory[];
  category: Category | null;
  subcategory: Subcategory | null;
  loading: boolean;
  error: string | null;
  reviewsLoading: boolean; // Specific to reviews
  reviewsError: string | null;
  reviewSubmissionLoading: boolean;
  reviewSubmissionError: string | null;
}

const initialState: ProductState = {
  products: [],
  latestProducts: [],
  product: null,
  reviews: [],
  totalProducts: 0,
  categories: [],
  subcategories: [],
  category: null,
  subcategory: null,
  loading: false,
  error: null,
  reviewsLoading: false,
  reviewsError: null,
  reviewSubmissionLoading: false,
  reviewSubmissionError: null,
};

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (
    params: { queryParams?: QueryParams } = { queryParams: undefined },
    { rejectWithValue }
  ) => {
    try {
      const response: ProductsApiResponse<Product[]> = await getAllProducts(
        params.queryParams
      );
      if (response.success) {
        return response.products;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Fetch product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response: ProductsApiResponse<Product> = await getProductById(id);
      if (response.success) {
        return response.product;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// fetch 10 latest products
export const fetchLatestProducts = createAsyncThunk(
  "products/fetchLatestProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response: ProductsApiResponse<Product[]> =
        await getLatestProducts();
      if (response.success) {
        return response.products;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Fetch product reviews
export const fetchProductReviews = createAsyncThunk(
  "products/fetchProductReviews",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response: ProductsApiResponse<Review[]> = await getProductReviews(
        productId
      );
      if (response.success) {
        return response.reviews;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Create or update a review
export const createReview = createAsyncThunk(
  "products/createReview",
  async (
    {
      productId,
      rating,
      comment,
    }: { productId: string; rating: number; comment: string },
    { rejectWithValue }
  ) => {
    try {
      const response: ProductsApiResponse<Review> = await createOrUpdateReview(
        productId,
        rating,
        comment
      );
      if (response.success) {
        return response.review;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Delete a review
export const removeReview = createAsyncThunk(
  "products/removeReview",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response: ProductsApiResponse<null> = await deleteReview(productId);
      if (response.success) {
        return response.products;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Fetch total number of products
export const fetchTotalProducts = createAsyncThunk(
  "products/fetchTotalProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response: ProductsApiResponse<number> = await getTotalProducts();
      if (response.success) {
        return response.products;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response: ProductsApiResponse<Category[]> =
        await getAllCategories();

      if (response.success) {
        return response.categories;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Fetch category by ID
export const fetchCategoryById = createAsyncThunk(
  "products/fetchCategoryById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response: ProductsApiResponse<Category> = await getCategoryById(id);
      if (response.success) {
        return response.categories;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Fetch categories with product count
export const fetchCategoriesWithProductCount = createAsyncThunk(
  "products/fetchCategoriesWithProductCount",
  async (_, { rejectWithValue }) => {
    try {
      const response: ProductsApiResponse<Category[]> =
        await getCategoriesWithProductCount();
      if (response.success) {
        return response.categories;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Fetch all subcategories
export const fetchSubcategories = createAsyncThunk(
  "products/fetchSubcategories",
  async (_, { rejectWithValue }) => {
    try {
      const response: ProductsApiResponse<Subcategory[]> =
        await getAllSubcategories();
      if (response.success) {
        return response.subcategories;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Fetch subcategories by category ID
export const fetchSubcategoriesByCategory = createAsyncThunk(
  "products/fetchSubcategoriesByCategory",
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response: ProductsApiResponse<Subcategory[]> =
        await getSubcategoriesByCategory(categoryId);
      if (response.success) {
        return response.subcategories;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

// Fetch subcategory by ID
export const fetchSubcategoryById = createAsyncThunk(
  "products/fetchSubcategoryById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response: ProductsApiResponse<Subcategory> =
        await getSubcategoryById(id);
      if (response.success) {
        return response.subcategories;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload ?? null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch latest products
      .addCase(fetchLatestProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.latestProducts = action.payload || [];
      })
      .addCase(fetchLatestProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchProductReviews.pending, (state) => {
        state.reviewsLoading = true; // Set reviewsLoading to true
        state.reviewsError = null; // Reset reviewsError
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.reviewsLoading = false; // Set reviewsLoading to false
        state.reviews = action.payload || [];
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.reviewsLoading = false; // Set reviewsLoading to false
        state.reviewsError = action.payload as string; // Set reviewsError
      })

      // Create or update review
      .addCase(createReview.pending, (state) => {
        state.reviewSubmissionLoading = true;
        state.reviewSubmissionError = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        if (action.payload) {
          state.reviewSubmissionLoading = false;
          state.reviews = [...state.reviews, action.payload];
        }
      })
      .addCase(createReview.rejected, (state, action) => {
        state.reviewSubmissionLoading = false;
        state.reviewSubmissionError = action.payload as string;
      })

      // Delete review
      .addCase(removeReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(
          (review) => review._id !== action.meta.arg
        );
      })
      .addCase(removeReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch total number of products
      .addCase(fetchTotalProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.totalProducts = action.payload ?? 0;
      })
      .addCase(fetchTotalProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch category by ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload ?? null;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch categories with product count
      .addCase(fetchCategoriesWithProductCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesWithProductCount.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload || [];
      })
      .addCase(fetchCategoriesWithProductCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch subcategories
      .addCase(fetchSubcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = action.payload || [];
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch subcategories by category ID
      .addCase(fetchSubcategoriesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubcategoriesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = action.payload || [];
      })
      .addCase(fetchSubcategoriesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch subcategory by ID
      .addCase(fetchSubcategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubcategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategory = action.payload ?? null;
      })
      .addCase(fetchSubcategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;
