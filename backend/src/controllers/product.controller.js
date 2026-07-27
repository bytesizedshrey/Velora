import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";
import mongoose from "mongoose";

/**
 * Helper to ensure a product has at least one valid variant in `variants`
 */
const ensureProductVariants = (product) => {
    if (!product) return product;

    const doc = product.toObject ? product.toObject() : product;

    if ((!doc.variants || doc.variants.length === 0) && doc.varients && doc.varients.length > 0) {
        doc.variants = doc.varients;
    }

    const docImages = doc.images || [];
    const existingVariants = doc.variants || [];

    if (existingVariants.length === 0) {
        let newVariants = [];

        if (docImages.length > 0) {
            newVariants = docImages.map((imgObj, i) => {
                const baseAmount = Number(doc.price?.amount || 200);
                return {
                    _id: imgObj._id || new mongoose.Types.ObjectId(),
                    title: doc.title || `Variant ${i + 1}`,
                    images: [imgObj],
                    stock: 100 - (i * 15),
                    attributes: {
                        Style: `Variant ${i + 1}`
                    },
                    price: {
                        amount: baseAmount,
                        currency: doc.price?.currency || "USD"
                    }
                };
            });
        } else {
            newVariants = [{
                _id: doc._id || new mongoose.Types.ObjectId(),
                title: "Standard",
                images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", alt: doc.title || "Product Image" }],
                stock: doc.stock || 100,
                attributes: { Style: "Standard" },
                price: doc.price || { amount: 200, currency: "USD" }
            }];
        }

        doc.variants = newVariants;
    }
    return doc;
};

export const createProduct = async (req, res) => {
    try {
        const { title, description, priceAmount, priceCurrency, stock } = req.body;
        const seller = req.seller || req.user;

        if (!seller) {
            return res.status(401).json({ message: "Seller not authenticated", success: false });
        }

        const files = req.files || [];
        let uploadedImages = [];

        if (files.length > 0) {
            uploadedImages = await Promise.all(files.map(async (file) => {
                try {
                    const uploadResult = await uploadFile({
                        buffer: file.buffer,
                        fileName: file.originalname
                    });
                    return {
                        url: uploadResult.url,
                        alt: file.originalname || "Product Image"
                    };
                } catch (err) {
                    console.error("Image upload failed, using fallback:", err.message);
                    return {
                        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
                        alt: file.originalname || "Placeholder"
                    };
                }
            }));
        } else {
            uploadedImages = [{
                url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
                alt: "Default Product Image"
            }];
        }

        const productStock = stock !== undefined && stock !== null && stock !== "" ? Number(stock) : 100;
        const basePrice = {
            amount: Number(priceAmount || 0),
            currency: priceCurrency || "USD"
        };

        let parsedVariants = [];
        if (req.body.variants) {
            try {
                parsedVariants = typeof req.body.variants === 'string' ? JSON.parse(req.body.variants) : req.body.variants;
            } catch (e) {
                console.error("Failed to parse variants JSON:", e);
            }
        }

        let finalVariants = [];
        if (Array.isArray(parsedVariants) && parsedVariants.length > 0) {
            finalVariants = parsedVariants.map((v, i) => {
                let varImages;
                if (v.imageStartIndex !== undefined && v.imageCount !== undefined && v.imageCount > 0) {
                    varImages = uploadedImages.slice(v.imageStartIndex, v.imageStartIndex + v.imageCount);
                    if (varImages.length === 0) varImages = uploadedImages;
                } else if (v.images && v.images.length > 0) {
                    varImages = v.images;
                } else {
                    varImages = uploadedImages;
                }

                const varStock = (v.stock !== undefined && v.stock !== null) ? Number(v.stock) : productStock;
                const varPrice = v.priceAmount ? { amount: Number(v.priceAmount), currency: v.priceCurrency || basePrice.currency } : basePrice;
                const varAttributes = v.attributes || v.attribute || { Style: v.title || `Variant ${i + 1}` };

                return {
                    title: v.title || `Variant ${i + 1}`,
                    images: varImages,
                    stock: varStock,
                    attributes: varAttributes,
                    price: varPrice
                };
            });
        } else {
            finalVariants = [{
                title: "Standard",
                images: uploadedImages,
                stock: productStock,
                attributes: { Style: "Standard" },
                price: basePrice
            }];
        }

        const product = await productModel.create({
            title,
            description,
            price: basePrice,
            stock: productStock,
            images: uploadedImages,
            variants: finalVariants,
            seller: seller._id
        });

        return res.status(201).json({
            message: "Product Created Successfully",
            success: true,
            product
        });
    } catch (error) {
        console.error("Error in createProduct controller:", error);
        return res.status(500).json({ message: "Internal server error", success: false, error: error.message });
    }
};

export async function getSellerProducts(req, res) {
    try {
        const seller = req.user;
        if (!seller) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }

        let products = await productModel.find({ seller: seller._id }).lean();
        products = products.map(p => ensureProductVariants(p));

        return res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products
        });
    } catch (error) {
        console.error("Error in getSellerProducts controller:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export async function getAllProducts(req, res) {
    try {
        let products = await productModel.find()
            .populate('seller', 'fullname email')
            .sort({ createdAt: -1 })
            .lean();

        products = products.map(p => ensureProductVariants(p));

        return res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products
        });
    } catch (error) {
        console.error("Error in getAllProducts controller:", error);
        return res.status(500).json({ message: "Internal server error", success: false, error: error.message });
    }
}

export async function getProductById(req, res) {
    try {
        const { id } = req.params;
        let product = await productModel.findById(id).populate('seller', 'fullname email').lean();
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        product = ensureProductVariants(product);

        return res.status(200).json({
            message: "Product fetched successfully",
            success: true,
            product
        });
    } catch (error) {
        console.error("Error in getProductById controller:", error);
        return res.status(500).json({ message: "Internal server error", success: false, error: error.message });
    }
}

export async function getProductDetails(req, res) {
    try {
        const { id } = req.params;
        let product = await productModel.findById(id).lean();

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        product = ensureProductVariants(product);

        return res.status(200).json({
            message: "Product details fetched successfully",
            success: true,
            product
        });
    } catch (error) {
        console.error("Error in getProductDetails controller:", error);
        return res.status(500).json({ message: "Internal server error", success: false, error: error.message });
    }
}

export async function addProductVariant(req, res) {
    try {
        const productId = req.params.productId;
        const seller = req.seller || req.user;

        if (!seller) {
            return res.status(401).json({ message: "Seller not authenticated", success: false });
        }

        const product = await productModel.findOne({
            _id: productId,
            seller: seller._id
        });

        if (!product) {
            return res.status(404).json({
                message: "Product Not Found",
                success: false
            });
        }

        const files = req.files || [];
        let images = [];

        if (files.length > 0) {
            images = await Promise.all(files.map(async (file) => {
                try {
                    const uploadResult = await uploadFile({
                        buffer: file.buffer,
                        fileName: file.originalname
                    });
                    return {
                        url: uploadResult.url,
                        alt: file.originalname || "Variant Image"
                    };
                } catch (err) {
                    console.error("Variant image upload failed, using fallback:", err.message);
                    return {
                        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
                        alt: "Fallback Variant Image"
                    };
                }
            }));
        } else {
            images = [{
                url: product.images?.[0]?.url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
                alt: product.title || "Variant Image"
            }];
        }

        const priceAmount = Number(req.body.priceAmount || req.body.price || product.price?.amount || 0);
        const priceCurrency = req.body.priceCurrency || product.price?.currency || "USD";
        const stock = Number(req.body.stock || 100);
        const title = req.body.title || `Variant ${(product.variants?.length || 0) + 1}`;

        let attributes = {};
        if (req.body.attributes || req.body.attribute) {
            try {
                const rawAttr = req.body.attributes || req.body.attribute;
                attributes = typeof rawAttr === 'string' ? JSON.parse(rawAttr) : rawAttr;
            } catch (e) {
                console.error("Failed to parse variant attributes:", e);
            }
        }

        const newVariant = {
            title,
            images,
            stock,
            attributes,
            price: {
                amount: priceAmount,
                currency: priceCurrency
            }
        };

        if (!product.variants) {
            product.variants = [];
        }
        product.variants.push(newVariant);

        await product.save();

        return res.status(201).json({
            message: "Variant added successfully",
            success: true,
            product
        });
    } catch (error) {
        console.error("Error in addProductVariant controller:", error);
        return res.status(500).json({ message: "Internal server error", success: false, error: error.message });
    }
}
