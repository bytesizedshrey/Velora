import { stockOfVarient } from '../dao/product.dao.js';
import cartModel from '../models/cart.model.js';
import productModel from '../models/product.model.js';

export const addToCart = async (req, res) => {

    const { productId, varientId } = req.params
    const { quantity = 1 } = req.body

    const product = await productModel.findOne({
        _id: productId,
        "varients._id": varientId
    })

    if (!product) {
        return res.status(404).json({
            message: "Product or Varient not found",
            success: false
        })
    }

    const stock = await stockOfVarient(productId, varientId)

    const cart = (await cartModel.findOne({ user: req.user._id })) || await cartModel.create({ user: req.user._id })

    const isProductAlreadyInCart = cart.items.find(item => item.product.equals(productId) && item.variant.equals(varientId))

    if (isProductAlreadyInCart) {
        const quantityInCart = isProductAlreadyInCart.quantity
        if (quantityInCart + quantity > stock) {
            return res.status(400).json({
                message: `Only ${stock - quantityInCart} ${stock - quantityInCart === 1 ? 'item' : 'items'} left in stock`,
                success: false
            })
        }
        isProductAlreadyInCart.quantity = quantityInCart + quantity
        await cart.save()
        return res.status(200).json({
            message: "Cart updated successfully",
            success: true,
            cart
        })
    }

    if (quantity > stock) {
        return res.status(400).json({
            message: `Only ${stock} ${stock === 1 ? 'item' : 'items'} left in stock`,
            success: false
        })
    }

    const variantObj = product.varients.find(v => v._id.toString() === varientId)
    const variantPrice = variantObj?.price?.amount ? variantObj.price : product.price

    const updatedCart = await cartModel.findOneAndUpdate(
        { user: req.user._id },
        {
            $push: {
                items: {
                    product: productId,
                    variant: varientId,
                    quantity: quantity,
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

}