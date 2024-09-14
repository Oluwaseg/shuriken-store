import axios from "axios";
import { CheckoutData, ApiResponse, ShippingInfo } from "../types/type";

// Initialize Checkout
export const initializeCheckout = async (
  userId: string,
  shippingInfo: ShippingInfo
): Promise<ApiResponse<CheckoutData>> => {
  const { data } = await axios.post<ApiResponse<CheckoutData>>(
    "/api/checkout",
    { userId, shippingInfo }
  );
  return data;
};
