import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useProduct } from '../hook/useProduct'
import ProductDetail from './ProductDetail'

const SellerProductDetails = () => {
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const { productId } = useParams()
    const { handleGetProductById, handleAddProductVarient } = useProduct()

    async function fetchProductDetails() {
        setLoading(true)
        try {
            const data = await handleGetProductById(productId)
            setProduct(data?.product || data)
        } catch (error) {
           console.error('Failed to fetch product details', error) 
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProductDetails()
    }, [productId]) 

    return (
        <ProductDetail productData={product} loadingState={loading} isSeller={true} />
    )
}

export default SellerProductDetails