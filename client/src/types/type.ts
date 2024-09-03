export interface Avatar {
  public_id: string;
  url: string;
  _id: string;
  id: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  avatar?: Avatar[];
  createdAt: string;
}

export interface AuthState {
  loading: boolean;
  userInfo: User | null;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
}

export interface ErrorResponse {
  message: string;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  [key: string]: string | number | undefined;
}

export interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  user: User;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  images: { url: string }[];
  reviews: Review[];
  ratings: number;
  numOfReviews: number;
  user: string;
  subcategory?: string;
  bestSeller: boolean;
  discount: {
    isDiscounted: boolean;
    discountPercent: number;
  };
  flashSale: {
    isFlashSale: boolean;
    flashSalePrice: string;
    flashSaleEndTime: string;
  };
  createdAt: string;
  id: string;
}

export interface ProductsApiResponse<T> {
  success: boolean;
  message?: string;
  products?: T;
  product?: T;
}

export interface Category {
  _id: string;
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Subcategory {
  _id: string;
  id: string;
  name: string;
  category: string;
  description: string;
  createdAt: string;
}

export interface CartItem {
  product: Product | string;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  user: string;
  items: CartItem[];
  total: number;
  tax: number;
  shipping: number;
}

// Shipping Information type
export interface ShippingInfo {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

// Order Item type
export interface OrderItem {
  product: Product | string;
  quantity: number;
}

// Order type
export interface Order {
  id: string;
  userId: string; // Reference to User ID
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  orderStatus:
    | "Pending"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled"
    | "Returned";
  paymentInfo?: {
    id: string;
    status: string;
  };
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}

// Checkout data response type
export interface CheckoutData {
  shippingInfo: ShippingInfo;
  items: CartItem[];
  total: number;
  tax: number;
  shipping: number;
}

// API Response type
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Paystack Payment Initialization Request type
export interface InitializePaymentRequest {
  orderId: string;
  email: string;
}

// Paystack Payment Initialization Response type
export interface InitializePaymentResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

// Payment Verification Response type
export interface VerifyPaymentResponse {
  status: string; // Paystack returns 'success', 'failed', etc.
  message: string;
  data: {
    reference: string;
    amount: number;
    currency: string;
    transaction_date: string;
    status: string;
    metadata: {
      userId: string;
      orderId: string;
      shippingInfo: ShippingInfo;
    };
  };
}
