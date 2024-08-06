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
