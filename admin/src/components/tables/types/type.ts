export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  images: { url: string }[];
  reviews?: {
    name: string;
    rating: number;
    comment: string;
    user: string;
    _id: string;
    createdAt: string;
  }[];
  ratings: number;
  numOfReviews: number;
  user: string;
  createdAt: string;
  id: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  product: string;
}

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
  avatar?: Avatar[];
  createdAt: string;
}

export interface Order {
  _id: string;
  shippingInfo: any;
  orderItems: OrderItem[];
  paymentInfo: any;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  paidAt: Date;
  deliveredAt?: Date;
  orderStatus: string;
  user: User;
  createdAt: Date;
}
export type OrderResponse = {
  success: boolean;
  order: Order;
};
