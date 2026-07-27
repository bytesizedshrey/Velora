import productModel from "../models/product.model.js";

export const stockOfVariant = async (productId, variantId) => {
    const product = await productModel.findOne({
        _id: productId,
        $or: [
            { "variants._id": variantId },
            { "varients._id": variantId }
        ]
    });

    if (!product) return 0;

    const variantsList = product.variants || product.varients || [];
    const variant = variantsList.find(v => v._id?.toString() === variantId?.toString());
    return variant ? (variant.stock ?? 0) : (product.stock ?? 0);
};

export const stockOfVarient = stockOfVariant;