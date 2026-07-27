import axios from "axios";

const paymentApiInstance = axios.create({
  baseURL: "/api/payments",
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
