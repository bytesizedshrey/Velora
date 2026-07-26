import { useDispatch, useSelector } from "react-redux"
import { addItem, getCart, updateCartItem, removeCartItem } from "../service/cart.api"
import { setCart, addItem as addItemToCart, setLoading, setError } from "../state/cart.slice"

export const useCart = () => {
    const dispatch = useDispatch()
    const cartState = useSelector(state => state.cart)

    async function handleAddItem({ productId, varientId, quantity = 1 }) {
        try {
            dispatch(setLoading(true))
            const data = await addItem({ productId, varientId, quantity })
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

    return {
        cart: cartState?.cart,
        items: cartState?.items || [],
        loading: cartState?.loading,
        error: cartState?.error,
        handleAddItem,
        handleGetCart,
        handleUpdateQuantity,
        handleRemoveItem
    }
}