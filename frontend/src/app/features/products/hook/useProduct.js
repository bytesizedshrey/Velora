import { useDispatch } from 'react-redux'
import {createProduct,getSellerProduct} from '../services/product.api'
import { setSellerProducts } from '../state/product.slice'

export const useProduct = () => {

    const dispatch = useDispatch()

    //create product
    async function  handleCreateProduct (formData) {
        const data = await createProduct(formData)
        return data.product
    }
    //see the product
    async function handleGetSellerProduct() {
        const data = await getSellerProduct()
        dispatch(setSellerProducts(data.products))
        return data.products
    }

    return {handleCreateProduct,handleGetSellerProduct}
}