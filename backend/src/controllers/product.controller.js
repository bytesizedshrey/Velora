import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export const createProduct = async (req, res) => {
    try {
        const { title, description, priceAmount, priceCurrency, stock } = req.body
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

        const productStock = stock !== undefined && stock !== null && stock !== "" ? Number(stock) : 100

        const product = await productModel.create({
            title,
            description,
            price: {
                amount: priceAmount,
                currency: priceCurrency || "INR"
            },
            stock: productStock,
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

        // Auto update stock to 100 for existing products with 0 or missing stock
        await productModel.updateMany(
            { seller: seller._id, $or: [{ stock: { $exists: false } }, { stock: 0 }, { stock: null }] },
            { $set: { stock: 100 } }
        )

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

export async function getAllProducts(req, res) {
    try {
        // Auto update stock to 100 for all existing products with 0 or missing stock
        await productModel.updateMany(
            { $or: [{ stock: { $exists: false } }, { stock: 0 }, { stock: null }] },
            { $set: { stock: 100 } }
        )

        const products = await productModel.find()
            .populate('seller', 'fullname email')
            .sort({ createdAt: -1 })

        return res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products
        })
    } catch (error) {
        console.error("Error in getAllProducts controller:", error);
        return res.status(500).json({ message: "Internal server error", success: false, error: error.message });
    }
}

export async function getProductById(req, res) {
    try {
        const { id } = req.params
        const product = await productModel.findById(id).populate('seller', 'fullname email')
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false })
        }
        if (!product.stock || product.stock === 0) {
            product.stock = 100
            await product.save()
        }
        return res.status(200).json({
            message: "Product fetched successfully",
            success: true,
            product
        })
    } catch (error) {
        console.error("Error in getProductById controller:", error);
        return res.status(500).json({ message: "Internal server error", success: false, error: error.message });
    }
}

export async function getProductDetails(req,res) {
    const {id} = req.params

    const product = await productModel.findById(id)

    if(!product){
        return res.status(404).json({
            message : "Product not found",
            success : false
        })
    }

    if (!product.stock || product.stock === 0) {
        product.stock = 100
        await product.save()
    }

    return res.status(200).json({
        message : "Product details fetched successfully",
        success : true,
        product
    })
}

export async function addProductVarient(req, res) {
  try {
    const productId = req.params.productId
    const seller = req.seller || req.user

    if (!seller) {
      return res.status(401).json({ message: "Seller not authenticated", success: false })
    }

    const product = await productModel.findOne({
      _id: productId,
      seller: seller._id
    })

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
        success: false
      })
    }

    const files = req.files || []
    let images = []

    if (files.length > 0) {
      images = await Promise.all(files.map(async (file) => {
        try {
          const uploadResult = await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
          })
          return {
            url: uploadResult.url
          }
        } catch (err) {
          console.error("Variant image upload failed, using fallback:", err.message)
          return {
            url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
          }
        }
      }))
    } else {
      images = [{
        url: product.images?.[0]?.url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
      }]
    }

    const priceAmount = Number(req.body.priceAmount || req.body.price || product.price?.amount || 0)
    const priceCurrency = req.body.priceCurrency || product.price?.currency || "INR"
    const stock = Number(req.body.stock || 100)

    let attribute = {}
    if (req.body.attribute) {
      try {
        attribute = typeof req.body.attribute === 'string' ? JSON.parse(req.body.attribute) : req.body.attribute
      } catch (e) {
        console.error("Failed to parse variant attributes:", e)
      }
    }

    const newVariant = {
      images,
      stock,
      attribute,
      price: {
        amount: priceAmount,
        currency: priceCurrency
      }
    }

    if (!product.varients) {
      product.varients = []
    }
    product.varients.push(newVariant)

    await product.save()

    return res.status(201).json({
      message: "Variant added successfully",
      success: true,
      product
    })
  } catch (error) {
    console.error("Error in addProductVarient controller:", error)
    return res.status(500).json({ message: "Internal server error", success: false, error: error.message })
  }
}
