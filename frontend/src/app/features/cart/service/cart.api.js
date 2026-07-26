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