import axios from "axios"

const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
})

export const addItem = async ({ productId, ProductId, varientId, quantity = 1 }) => {
    const pId = productId || ProductId
    const response = await cartApiInstance.post(`/add/${pId}/${varientId}`, { quantity })
    return response.data
}

export const getCart = async () => {
    const response = await cartApiInstance.get('/get')
    return response.data
}

export const updateCartItem = async (itemId, quantity) => {
    const response = await cartApiInstance.put(`/update/${itemId}`, { quantity })
    return response.data
}

export const removeCartItem = async (itemId) => {
    const response = await cartApiInstance.delete(`/remove/${itemId}`)
    return response.data
}