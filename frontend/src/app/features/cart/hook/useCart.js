import { useDispatch } from "react-redux"
import { addItem } from "../service/cart.api"
import { addItem as addItemToCart } from "../state/cart.slice"

export const useCart = () => {
    const dispatch = useDispatch()

    async function handleAddItem({ productId, varientId, quantity = 1 }) {
        const data = await addItem({ productId, varientId, quantity })
        if (data?.cart) {
            dispatch(addItemToCart(data.cart))
        }
        return data
    }
    return { handleAddItem }
}