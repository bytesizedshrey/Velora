import productModel from "../models/product.model.js";

export const stockOfVarient = async (productId, varientId) => {
    const product = await productModel.findOne({
        _id: productId,
        "varients._id": varientId
    });

    if (!product) return 0;

    const variant = product.varients.find(v => v._id.toString() === varientId);
    return variant ? (variant.stock ?? 0) : (product.stock ?? 0);
};