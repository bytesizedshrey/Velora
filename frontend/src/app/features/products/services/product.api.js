import { API_BASE_URL } from "@/shared/config/apiConfig";
import { createApiInstance } from "@/shared/config/axiosFactory";

const productApiInstance = createApiInstance(`${API_BASE_URL}/api/products`);

export async function createProduct(formData) {
    const response = await productApiInstance.post("/", formData);
    return response.data;
}

export async function getSellerProduct() {
    const response = await productApiInstance.get("/seller");
    return response.data;
}

export async function getAllProducts() {
    const response = await productApiInstance.get("/");
    return response.data;
}

export async function getProductById(productId){
    const response = await productApiInstance.get(`/detail/${productId}`);
    return response.data;
}

export async function addProductVariant(productId, newProductVariant) {
    const formData = new FormData();

    if (newProductVariant.images && newProductVariant.images.length > 0) {
        newProductVariant.images.forEach((img) => {
            if (img.file) {
                formData.append("images", img.file);
            }
        });
    }

    formData.append("stock", newProductVariant.stock || 0);
    const priceVal = newProductVariant.price?.amount ?? newProductVariant.price ?? 0;
    formData.append("priceAmount", priceVal);

    if (newProductVariant.price?.currency) {
        formData.append("priceCurrency", newProductVariant.price.currency);
    }

    if (newProductVariant.title) {
        formData.append("title", newProductVariant.title);
    }

    const attrs = newProductVariant.attributes || newProductVariant.attribute;
    if (attrs) {
        formData.append("attributes", typeof attrs === 'string' ? attrs : JSON.stringify(attrs));
    }

    const response = await productApiInstance.post(`/${productId}/variants`, formData);
    return response.data;
}

export const addProductVarient = addProductVariant;