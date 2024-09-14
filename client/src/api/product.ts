import axiosInstance from "./axiosInstance";
import {
  ProductsApiResponse,
  Product,
  Review,
  QueryParams,
} from "../types/type";

export const getAllProducts = async (
  queryParams?: QueryParams
): Promise<ProductsApiResponse<Product[]>> => {
  const response = await axiosInstance.get<ProductsApiResponse<Product[]>>(
    "/products",
    { params: queryParams }
  );
  return response.data;
};

export const getProductById = async (
  id: string
): Promise<ProductsApiResponse<Product>> => {
  const response = await axiosInstance.get<ProductsApiResponse<Product>>(
    `/products/${id}`
  );
  return response.data;
};

export const getLatestProducts = async (): Promise<
  ProductsApiResponse<Product[]>
> => {
  const queryParams = {
    limit: 10,
    sort: "-createdAt",
  };
  const response = await axiosInstance.get<ProductsApiResponse<Product[]>>(
    "/products",
    { params: queryParams }
  );
  return response.data;
};

export const createOrUpdateReview = async (
  productId: string,
  rating: number,
  comment: string
): Promise<ProductsApiResponse<Review>> => {
  const response = await axiosInstance.put<ProductsApiResponse<Review>>(
    `/products/${productId}/reviews`,
    { rating, comment }
  );
  return response.data;
};

export const deleteReview = async (
  productId: string
): Promise<ProductsApiResponse<null>> => {
  const response = await axiosInstance.delete<ProductsApiResponse<null>>(
    `/products/${productId}/reviews`
  );
  return response.data;
};

export const getProductReviews = async (
  productId: string
): Promise<ProductsApiResponse<Review[]>> => {
  const response = await axiosInstance.get<ProductsApiResponse<Review[]>>(
    `/products/${productId}/reviews`
  );

  return response.data;
};

export const getTotalProducts = async (): Promise<
  ProductsApiResponse<number>
> => {
  const response = await axiosInstance.get<ProductsApiResponse<number>>(
    "/products/total"
  );
  return response.data;
};
