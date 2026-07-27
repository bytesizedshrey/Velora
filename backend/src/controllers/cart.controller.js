import { stockOfVariant } from '../dao/product.dao.js';
import { getCartAggregation } from '../dao/cart.dao.js';
import cartModel from '../models/cart.model.js';
import productModel from '../models/product.model.js';

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const variantId = req.params.variantId || req.params.varientId || req.body.variantId || req.body.variant;
        const { quantity = 1 } = req.body;
        const numQuantity = Number(quantity) || 1;

        console.log("📥 [Backend Add To Cart API] Received Request Params:", {
            productId,
            variantId,
            quantity: numQuantity
        });

        // 1. Fetch product from DB
        const product = await productModel.findById(productId);
        if (!product) {
            console.log("❌ [Backend Add To Cart] Product Not Found:", productId);
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        // 2. Resolve target variant from product.variants
        const variantsList = product.variants || product.varients || [];
        let variantObj = variantsList.find(v => v._id?.toString() === variantId?.toString());

        if (!variantObj && variantsList.length > 0) {
            console.log("⚠️ [Backend Add To Cart] variantId", variantId, "not found in product.variants array, defaulting to first variant.");
            variantObj = variantsList[0];
        }

        const effectiveVariantId = variantObj ? variantObj._id.toString() : (variantId || product._id.toString());
        const stock = variantObj ? (variantObj.stock ?? 0) : (product.stock ?? 0);
        const variantPrice = (variantObj?.price?.amount) ? variantObj.price : product.price;

        console.log("🎯 [Backend Add To Cart] Target Variant Resolved:", {
            productId: product._id,
            productTitle: product.title,
            effectiveVariantId,
            variantTitle: variantObj?.title,
            variantPrice,
            stock
        });

        // 3. Fetch or create cart for user
        const cart = (await cartModel.findOne({ user: req.user._id })) || await cartModel.create({ user: req.user._id, items: [] });

        // 4. Check if item already exists in cart
        const existingItem = cart.items.find(
            item => item.product?.toString() === productId && item.variant?.toString() === effectiveVariantId
        );

        if (existingItem) {
            const quantityInCart = existingItem.quantity;
            if (quantityInCart + numQuantity > stock) {
                return res.status(400).json({
                    message: `Only ${stock - quantityInCart} ${stock - quantityInCart === 1 ? 'item' : 'items'} left in stock`,
                    success: false
                });
            }
            existingItem.quantity = quantityInCart + numQuantity;
            existingItem.price = variantPrice;
            await cart.save();
        } else {
            if (numQuantity > stock) {
                return res.status(400).json({
                    message: `Only ${stock} ${stock === 1 ? 'item' : 'items'} left in stock`,
                    success: false
                });
            }
            cart.items.push({
                product: productId,
                variant: effectiveVariantId,
                quantity: numQuantity,
                price: variantPrice
            });
            await cart.save();
        }

        console.log("💾 [Backend Add To Cart] Stored Cart Document in DB:", JSON.stringify(cart, null, 2));

        // 5. Fetch fully populated aggregated cart using getCartAggregation pipeline
        const updatedCart = await getCartAggregation(req.user._id);

        console.log("✨ [Backend Add To Cart] Returning Aggregated Cart Response:", JSON.stringify(updatedCart, null, 2));

        return res.status(200).json({
            message: "Item added to cart successfully",
            success: true,
            cart: updatedCart
        });
    } catch (err) {
        console.error("Error in addToCart controller:", err);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

export const getCart = async (req, res) => {
    try {
        const user = req.user._id;
        console.log("📖 [Backend GET /cart/get] Fetching aggregated cart for user:", user);
        const cart = await getCartAggregation(user);
        return res.status(200).json({ success: true, cart: cart || { items: [] } });
    } catch (err) {
        console.error("Error in getCart controller:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

export const getCartAggregate = async (req, res) => {
    try {
        const user = req.user._id;
        const cart = await getCartAggregation(user);
        return res.status(200).json({ success: true, cart: cart || { items: [] } });
    } catch (err) {
        console.error("Error in getCartAggregate controller:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        const newQty = Number(quantity);

        const cart = await cartModel.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found", success: false });
        }

        const item = cart.items.id(itemId) || cart.items.find(i => i._id?.toString() === itemId);
        if (!item) {
            return res.status(404).json({ message: "Cart item not found", success: false });
        }

        if (newQty <= 0) {
            cart.items = cart.items.filter(i => i._id?.toString() !== itemId);
        } else {
            const product = await productModel.findById(item.product);
            const variantsList = product?.variants || product?.varients || [];
            const variantObj = variantsList.find(v => v._id?.toString() === item.variant?.toString());
            const stock = variantObj ? (variantObj.stock ?? 0) : (product?.stock ?? 0);

            if (newQty > stock) {
                return res.status(400).json({
                    message: `Only ${stock} items available in stock`,
                    success: false
                });
            }
            item.quantity = newQty;
        }

        await cart.save();
        const updatedCart = await getCartAggregation(req.user._id);
        return res.status(200).json({ message: "Cart updated successfully", success: true, cart: updatedCart });
    } catch (err) {
        console.error("Error in updateCartItem controller:", err);
        return res.status(500).json({ message: err.message, success: false });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const cart = await cartModel.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found", success: false });
        }

        cart.items = cart.items.filter(i => i._id?.toString() !== itemId);
        await cart.save();
        const updatedCart = await getCartAggregation(req.user._id);
        return res.status(200).json({ message: "Item removed from cart", success: true, cart: updatedCart });
    } catch (err) {
        console.error("Error in removeCartItem controller:", err);
        return res.status(500).json({ message: err.message, success: false });
    }
};