import { API_BASE_URL } from "@/shared/config/apiConfig";
import { createApiInstance } from "@/shared/config/axiosFactory";

const paymentApiInstance = createApiInstance(`${API_BASE_URL}/api/payments`);

export const createPaymentOrder = async () => {
    const response = await paymentApiInstance.post("/create-order");
    return response.data;
};

export const verifyPaymentOrder = async (payload) => {
    const response = await paymentApiInstance.post("/verify", payload);
    return response.data;
};
