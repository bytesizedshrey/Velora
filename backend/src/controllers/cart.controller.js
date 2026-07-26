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
            return res.status(200).json({
                message: "Cart updated successfully",
                success: true,
                cart
            })
        }

        if (numQuantity > stock) {
            return res.status(400).json({
                message: `Only ${stock} ${stock === 1 ? 'item' : 'items'} left in stock`,
                success: false
            })
        }

        // 5. Add new item to cart
        const updatedCart = await cartModel.findOneAndUpdate(
            { user: req.user._id },
            {
                $push: {
                    items: {
                        product: productId,
                        variant: effectiveVarientId,
                        quantity: numQuantity,
                        price: variantPrice
                    }
                }
            },
            { new: true }
        )

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
        return res.status(200).json({ success: true, cart })
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message })
    }
}