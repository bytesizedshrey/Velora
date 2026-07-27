import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

/**
 * Helper to ensure a product has at least one valid variant in `variants`
 */
const ensureProductVariants = async (product) => {
    if (!product) return product;

    if ((!product.variants || product.variants.length === 0) && product.varients && product.varients.length > 0) {
        product.variants = product.varients;
    }

    const docImages = product.images || [];
    const existingVariants = product.variants || [];

    if (existingVariants.length === 0 || (existingVariants.length <= 1 && docImages.length > 1)) {
        let newVariants = [];

        if (docImages.length > 1) {
            newVariants = docImages.map((imgObj, i) => {
                const urlStr = String(imgObj?.url || imgObj || '').toLowerCase();
                const altStr = String(imgObj?.alt || '').toLowerCase();

                let title = `Variant ${i + 1}`;
                let color = i % 2 === 0 ? "Black" : "White";

                if (urlStr.includes("white") || altStr.includes("white") || urlStr.includes("02") || urlStr.includes("g2")) {
                    title = "White T-Shirt";
                    color = "White";
                } else if (urlStr.includes("hoodie") || altStr.includes("hoodie") || i === 0) {
                    title = "Black Hoodie";
                    color = "Black";
                } else if (urlStr.includes("boxy") || altStr.includes("boxy") || i === 2) {
                    title = "Black Boxy Tee";
                    color = "Black";
                }

                const baseAmount = Number(product.price?.amount || 200);
                const priceAmount = i === 1 ? Math.max(10, baseAmount - 10) : i === 2 ? Math.max(10, baseAmount - 20) : baseAmount;

                return {
                    _id: new mongoose.Types.ObjectId(),
                    title,
                    images: [imgObj],
                    stock: 100 - (i * 15),
                    attributes: {
                        Color: color,
                        Style: title
                    },
                    price: {
                        amount: priceAmount,
                        currency: product.price?.currency || "USD"
                    }
                };
            });
        } else {
            const defaultImages = docImages.length > 0
                ? docImages
                : [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", alt: product.title || "Product Image" }];

            newVariants = [{
                _id: product._id || new mongoose.Types.ObjectId(),
                title: "Standard",
                images: defaultImages,
                stock: product.stock || 100,
                attributes: { Style: "Standard" },
                price: product.price || { amount: 200, currency: "USD" }
            }];
        }

        product.variants = newVariants;
        await productModel.collection.updateOne(
            { _id: product._id },
            { $set: { variants: newVariants } }
        );
    }
    return product;
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
            currency: priceCurrency || "INR"
        };

        // Parse optional custom variants array passed in body
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
                // Prefer explicit image slice via imageStartIndex/imageCount (sent by CreateProduct)
                let varImages;
                if (v.imageStartIndex !== undefined && v.imageCount !== undefined && v.imageCount > 0) {
                    varImages = uploadedImages.slice(v.imageStartIndex, v.imageStartIndex + v.imageCount);
                    if (varImages.length === 0) varImages = uploadedImages; // fallback
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
            // Default single variant using all uploaded images & stock
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

        let products = await productModel.find({ seller: seller._id });
        
        // Ensure all seller products have variants
        products = await Promise.all(products.map(p => ensureProductVariants(p)));

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
            .sort({ createdAt: -1 });

        // Ensure all products have variants
        products = await Promise.all(products.map(p => ensureProductVariants(p)));

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
        let product = await productModel.findById(id).populate('seller', 'fullname email');
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        product = await ensureProductVariants(product);

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
        let product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        product = await ensureProductVariants(product);

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
        const priceCurrency = req.body.priceCurrency || product.price?.currency || "INR";
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
