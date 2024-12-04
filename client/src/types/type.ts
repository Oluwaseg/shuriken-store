export interface Avatar {
  public_id: string;
  url: string;
  _id: string;
  id: string;
}

export interface User {
  isAdmin: boolean;
  _id: string;
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatar?: Avatar[];
  role: string;
  shippingInfo: ShippingInfo;
  createdAt: string;
  birthday?: Date;
  bio?: string;
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
  brand: string;
  images: { url: string }[];
  reviews: Review[];
  ratings: number;
  numOfReviews: number;
  category: Category[];
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

export interface RelatedProducts {
  id: string;
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brand: string;
  images: { url: string }[];
  reviews: Review[];
  ratings: number;
  numOfReviews: number;
  category: Category[];
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
}

export interface ProductsApiResponse<T> {
  success: boolean;
  message?: string;
  products?: T;
  product?: T;
  categories?: T;
  subcategories?: T;
  review?: T;
  reviews?: T;
  relatedProduct?: T;
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
  user: User[] | string;
  items: CartItem[];
  total: number;
  tax: number;
  shipping: number;
}

// Shipping Information type
export interface ShippingInfo {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phoneNo: string;
}

// Payment Information type
export interface PaymentInfo {
  id: string;
  status: string;
}

// Order Item type
export interface OrderItem {
  product: Product | string;
  name: string; // Product name
  price: number; // Price per item
  quantity: number;
  image: string;
  id: string;
}

// Order type
export interface Order {
  id: string;
  _id: string;
  user: User | string;
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  orderStatus:
    | 'Pending Verification'
    | 'Pending'
    | 'Processing'
    | 'Packaging'
    | 'Shipped'
    | 'Delivered'
    | 'Cancelled'
    | 'Returned';
  paymentInfo?: PaymentInfo;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
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
  cart?: T;
  orders?: T;
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
