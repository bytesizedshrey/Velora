import axios from "axios";
import { API_BASE_URL } from "@/shared/config/apiConfig";

const paymentApiInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/payments`,
  withCredentials: true,
});

export const createPaymentOrder = async () => {
  const response = await paymentApiInstance.post("/create-order");
  return response.data;
};

export const verifyPaymentOrder = async (payload) => {
  const response = await paymentApiInstance.post("/verify", payload);
  return response.data;
};
