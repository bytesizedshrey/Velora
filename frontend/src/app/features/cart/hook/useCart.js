import { useDispatch, useSelector } from "react-redux"
import { addItem, getCart, updateCartItem, removeCartItem } from "../service/cart.api"
import { createPaymentOrder, verifyPaymentOrder } from "../service/payment.api"
import { setCart, setLoading, setError } from "../state/cart.slice"

export const useCart = () => {
    const dispatch = useDispatch()
    const cartState = useSelector(state => state.cart)

    async function handleAddItem({ productId, variantId, varientId, quantity = 1 }) {
        try {
            dispatch(setLoading(true))
            const vId = variantId || varientId
            const data = await addItem({ productId, variantId: vId, quantity })
            if (data?.cart) {
                dispatch(setCart(data.cart))
            }
            return data
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message
            dispatch(setError(errorMsg))
            throw err
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetCart() {
        try {
            dispatch(setLoading(true))
            const data = await getCart()
            if (data?.cart) {
                dispatch(setCart(data.cart))
            }
            return data
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message
            dispatch(setError(errorMsg))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleUpdateQuantity(itemId, quantity) {
        try {
            dispatch(setLoading(true))
            const data = await updateCartItem(itemId, quantity)
            if (data?.cart) {
                dispatch(setCart(data.cart))
            }
            return data
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message
            dispatch(setError(errorMsg))
            throw err
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleRemoveItem(itemId) {
        try {
            dispatch(setLoading(true))
            const data = await removeCartItem(itemId)
            if (data?.cart) {
                dispatch(setCart(data.cart))
            }
            return data
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message
            dispatch(setError(errorMsg))
            throw err
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleIncrementCartItem({ productId, variantId }) {
        return handleAddItem({ productId, variantId, quantity: 1 })
    }

    async function handleCreateCartOrder() {
        try {
            dispatch(setLoading(true))
            const data = await createPaymentOrder()
            return data
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Failed to create payment order"
            dispatch(setError(errorMsg))
            throw err
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleVerifyCartOrder(payload) {
        try {
            dispatch(setLoading(true))
            const data = await verifyPaymentOrder(payload)
            if (data?.success) {
                dispatch(setCart({ items: [] }))
            }
            return data
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Payment verification failed"
            dispatch(setError(errorMsg))
            throw err
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        cart: cartState?.cart,
        items: cartState?.items || [],
        loading: cartState?.loading,
        error: cartState?.error,
        handleAddItem,
        handleGetCart,
        handleUpdateQuantity,
        handleRemoveItem,
        handleIncrementCartItem,
        handleCreateCartOrder,
        handleVerifyCartOrder
    }
}