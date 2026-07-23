import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export const createProduct = async (req, res) => {
    try {
        const { title, description, priceAmount, priceCurrency } = req.body
        const seller = req.seller || req.user

        if (!seller) {
            return res.status(401).json({ message: "Seller not authenticated", success: false })
        }

        const files = req.files || [];
        let images = [];

        if (files.length > 0) {
            images = await Promise.all(files.map(async (file) => {
                try {
                    const uploadResult = await uploadFile({
                        buffer: file.buffer,
                        fileName: file.originalname
                    })
                    return {
                        url: uploadResult.url,
                        alt: file.originalname || "Product Image"
                    }
                } catch (err) {
                    console.error("Image upload failed, using fallback:", err.message);
                    return {
                        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
                        alt: file.originalname || "Placeholder"
                    }
                }
            }))
        } else {
            images = [{
                url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
                alt: "Default Product Image"
            }]
        }

        const product = await productModel.create({
            title,
            description,
            price: {
                amount: priceAmount,
                currency: priceCurrency || "INR"
            },
            images,
            seller: seller._id
        })

        return res.status(201).json({
            message: "Product Created Successfully",
            success: true,
            product
        })
    } catch (error) {
        console.error("Error in createProduct controller:", error);
        return res.status(500).json({ message: "Internal server error", success: false, error: error.message });
    }
};

export async function getSellerProducts(req, res) {
    try {
        const seller = req.user
        if (!seller) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }
        const products = await productModel.find({ seller: seller._id })

        return res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products
        })
    } catch (error) {
        console.error("Error in getSellerProducts controller:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}
