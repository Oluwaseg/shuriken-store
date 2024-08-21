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
  ProductsApiResponse,
  Product,
  Review,
  QueryParams,
} from "../../types/type";

interface ProductState {
  products: Product[];
  latestProducts: Product[];
  product: Product | null;
  reviews: Review[];
  totalProducts: number;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  latestProducts: [],
  product: null,
  reviews: [],
  totalProducts: 0,
  loading: false,
  error: null,
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

      // Fetch product reviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload || [];
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create or update review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        if (action.payload) {
          state.loading = false;
          state.reviews = [...state.reviews, action.payload];
        }
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
      });
  },
});

export default productSlice.reducer;
