import axios from "axios";
import { API_BASE_URL } from "@/shared/config/apiConfig";

const cartApiInstance = axios.create({
    baseURL: `${API_BASE_URL}/api/cart`,
    withCredentials: true
});

export const addItem = async ({ productId, ProductId, variantId, varientId, quantity = 1 }) => {
    const pId = productId || ProductId;
    const vId = variantId || varientId;
    const response = await cartApiInstance.post(`/add/${pId}/${vId}`, { quantity });
    return response.data;
};

export const getCart = async () => {
    const response = await cartApiInstance.get('/get');
    return response.data;
};

export const getCartAggregate = async () => {
    const response = await cartApiInstance.get('/aggregate');
    return response.data;
};

export const updateCartItem = async (itemId, quantity) => {
    const response = await cartApiInstance.put(`/update/${itemId}`, { quantity });
    return response.data;
};

export const removeCartItem = async (itemId) => {
    const response = await cartApiInstance.delete(`/remove/${itemId}`);
    return response.data;
};