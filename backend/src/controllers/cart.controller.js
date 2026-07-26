import { stockOfVarient } from '../dao/product.dao.js';
import cartModel from '../models/cart.model.js';
import productModel from '../models/product.model.js';

export const addToCart = async (req, res) => {
    try {
        const { productId, varientId } = req.params
        const { quantity = 1 } = req.body
        const numQuantity = Number(quantity) || 1

        // 1. Fetch product
        const product = await productModel.findById(productId)

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            })
        }

        // 2. Resolve target variant or default to product
        let variantObj = product.varients?.find(v => v._id?.toString() === varientId)
        if (!variantObj && product.varients?.length > 0) {
            variantObj = product.varients[0]
        }

        const effectiveVarientId = variantObj ? variantObj._id.toString() : (varientId || product._id.toString())
        const stock = variantObj ? (variantObj.stock ?? 0) : (product.stock ?? 0)
        const variantPrice = variantObj?.price?.amount ? variantObj.price : product.price

        // 3. Fetch or create cart for user
        const cart = (await cartModel.findOne({ user: req.user._id })) || await cartModel.create({ user: req.user._id, items: [] })

        // 4. Check if item already exists in cart
        const isProductAlreadyInCart = cart.items.find(
            item => item.product?.toString() === productId && item.variant?.toString() === effectiveVarientId
        )

        if (isProductAlreadyInCart) {
            const quantityInCart = isProductAlreadyInCart.quantity
            if (quantityInCart + numQuantity > stock) {
                return res.status(400).json({
                    message: `Only ${stock - quantityInCart} ${stock - quantityInCart === 1 ? 'item' : 'items'} left in stock`,
                    success: false
                })
            }
            isProductAlreadyInCart.quantity = quantityInCart + numQuantity
            await cart.save()
            const updatedCart = await cartModel.findOne({ user: req.user._id }).populate("items.product")
            return res.status(200).json({
                message: "Cart updated successfully",
                success: true,
                cart: updatedCart
            })
        }

        if (numQuantity > stock) {
            return res.status(400).json({
                message: `Only ${stock} ${stock === 1 ? 'item' : 'items'} left in stock`,
                success: false
            })
        }

        // 5. Add new item to cart
        cart.items.push({
            product: productId,
            variant: effectiveVarientId,
            quantity: numQuantity,
            price: variantPrice
        })

        await cart.save()
        const updatedCart = await cartModel.findOne({ user: req.user._id }).populate("items.product")

        return res.status(200).json({
            message: "Item added to cart successfully",
            success: true,
            cart: updatedCart
        })
    } catch (err) {
        console.error("Error in addToCart controller:", err)
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        })
    }
}

export const getCart = async (req, res) => {
    try {
        const user = req.user._id
        const cart = await cartModel.findOne({ user }).populate("items.product")
        return res.status(200).json({ success: true, cart: cart || { items: [] } })
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message })
    }
}

export const updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params
        const { quantity } = req.body
        const newQty = Number(quantity)

        const cart = await cartModel.findOne({ user: req.user._id })
        if (!cart) {
            return res.status(404).json({ message: "Cart not found", success: false })
        }

        const item = cart.items.id(itemId) || cart.items.find(i => i._id.toString() === itemId)
        if (!item) {
            return res.status(404).json({ message: "Cart item not found", success: false })
        }

        if (newQty <= 0) {
            cart.items = cart.items.filter(i => i._id.toString() !== itemId)
        } else {
            const product = await productModel.findById(item.product)
            const variantObj = product?.varients?.find(v => v._id.toString() === item.variant?.toString())
            const stock = variantObj ? (variantObj.stock ?? 0) : (product?.stock ?? 0)

            if (newQty > stock) {
                return res.status(400).json({
                    message: `Only ${stock} items available in stock`,
                    success: false
                })
            }
            item.quantity = newQty
        }

        await cart.save()
        const updatedCart = await cartModel.findOne({ user: req.user._id }).populate("items.product")
        return res.status(200).json({ message: "Cart updated successfully", success: true, cart: updatedCart })
    } catch (err) {
        return res.status(500).json({ message: err.message, success: false })
    }
}

export const removeCartItem = async (req, res) => {
    try {
        const { itemId } = req.params
        const cart = await cartModel.findOne({ user: req.user._id })
        if (!cart) {
            return res.status(404).json({ message: "Cart not found", success: false })
        }

        cart.items = cart.items.filter(i => i._id.toString() !== itemId)
        await cart.save()
        const updatedCart = await cartModel.findOne({ user: req.user._id }).populate("items.product")
        return res.status(200).json({ message: "Item removed from cart", success: true, cart: updatedCart })
    } catch (err) {
        return res.status(500).json({ message: err.message, success: false })
    }
}