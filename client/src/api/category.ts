import axiosInstance from "./axiosInstance";
import { Category, Subcategory, ProductsApiResponse } from "../types/type";

export const getAllCategories = async (): Promise<
  ProductsApiResponse<Category[]>
> => {
  const response = await axiosInstance.get<ProductsApiResponse<Category[]>>(
    "/category"
  );
  return response.data;
};

export const getCategoryById = async (
  id: string
): Promise<ProductsApiResponse<Category>> => {
  const response = await axiosInstance.get<ProductsApiResponse<Category>>(
    `/category/${id}`
  );
  return response.data;
};

export const getCategoriesWithProductCount = async (): Promise<
  ProductsApiResponse<Category[]>
> => {
  const response = await axiosInstance.get<ProductsApiResponse<Category[]>>(
    "/categories"
  );
  return response.data;
};

export const getAllSubcategories = async (): Promise<
  ProductsApiResponse<Subcategory[]>
> => {
  const response = await axiosInstance.get<ProductsApiResponse<Subcategory[]>>(
    "/subcategories"
  );
  return response.data;
};

export const getSubcategoriesByCategory = async (
  categoryId: string
): Promise<ProductsApiResponse<Subcategory[]>> => {
  const response = await axiosInstance.get<ProductsApiResponse<Subcategory[]>>(
    `/subcategories/${categoryId}`
  );
  return response.data;
};

export const getSubcategoryById = async (
  id: string
): Promise<ProductsApiResponse<Subcategory>> => {
  const response = await axiosInstance.get<ProductsApiResponse<Subcategory>>(
    `/subcategory/${id}`
  );
  return response.data;
};
