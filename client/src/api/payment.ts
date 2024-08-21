import axios from "axios";
import {
  InitializePaymentRequest,
  InitializePaymentResponse,
  ApiResponse,
  VerifyPaymentResponse,
} from "../types/type";

// Initialize Payment
export const initializePayment = async (
  request: InitializePaymentRequest
): Promise<ApiResponse<InitializePaymentResponse>> => {
  const { data } = await axios.post<ApiResponse<InitializePaymentResponse>>(
    "/api/payment/initialize",
    request
  );
  return data;
};

// Verify Payment
export const verifyPayment = async (
  reference: string
): Promise<ApiResponse<VerifyPaymentResponse>> => {
  const { data } = await axios.get<ApiResponse<VerifyPaymentResponse>>(
    `/api/payment/verify/${reference}`
  );
  return data;
};
