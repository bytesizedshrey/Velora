import { useDispatch } from 'react-redux'
import { createProduct, getAllProducts, getSellerProduct, getProductById } from '../services/product.api'
import { setProducts, setSellerProducts } from '../state/product.slice'

export const useProduct = () => {
    const dispatch = useDispatch()

    // create product
    async function handleCreateProduct(formData) {
        const data = await createProduct(formData)
        return data.product
    }

    // see seller products
    async function handleGetSellerProduct() {
        const data = await getSellerProduct()
        dispatch(setSellerProducts(data.products))
        return data.products
    }

    // see all products
    async function handleGetAllProducts() {
        const data = await getAllProducts()
        dispatch(setProducts(data.products))
        return data.products
    }

    // get single product by id
    async function handleGetProductById(productId) {
        const data = await getProductById(productId)
        return data.product
    }

    return { handleCreateProduct, handleGetSellerProduct, handleGetAllProducts, handleGetProductById }
}