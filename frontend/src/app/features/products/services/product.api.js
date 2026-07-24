import axios from "axios";

const productApiInstance = axios.create({
    baseURL : "/api/products",
    withCredentials : true
})

export async function createProduct(formData) {
    const response = await productApiInstance.post("/",formData)

    return response.data
}

export async function getSellerProduct() {
    const response = await productApiInstance.get("/seller")

    return response.data
}

export async function getAllProducts() {
    const response = await productApiInstance.get("/")
    return response.data
}

// export async function getProductById(id) {
//     const response = await productApiInstance.get(`/${id}`)
//     return response.data
// }

export async function getProductById(productId){
    const response = await productApiInstance.get(`/detail/${productId}`)
    return response.data
}

export async function addProductVarient(productId, newProductVarient) {
    const formData = new FormData()

    if (newProductVarient.images && newProductVarient.images.length > 0) {
        newProductVarient.images.forEach((img) => {
            if (img.file) {
                formData.append("images", img.file)
            }
        })
    }

    formData.append("stock", newProductVarient.stock || 0)
    const priceVal = newProductVarient.price?.amount ?? newProductVarient.price ?? 0
    formData.append("priceAmount", priceVal)

    if (newProductVarient.price?.currency) {
        formData.append("priceCurrency", newProductVarient.price.currency)
    }

    if (newProductVarient.attribute) {
        formData.append("attribute", typeof newProductVarient.attribute === 'string' ? newProductVarient.attribute : JSON.stringify(newProductVarient.attribute))
    }

    const response = await productApiInstance.post(`/${productId}/varients`, formData)
    return response.data
}