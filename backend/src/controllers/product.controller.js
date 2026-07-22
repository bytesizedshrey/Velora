import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";


// Create a new product
export const createProduct = async (req, res) => {
    const {title, description,priceAmount,priceCurrency} = req.body
    const seller = req.seller

    const images = await Promise.all(req.files.map(async (file)=>{
        const uploadResult = await uploadFile({
            buffer : file.buffer,
            fileName : file.originalname
        })
        return {
            url: uploadResult.url,
            alt: file.originalname || "Product Image"
        }
    }))

    const product = await productModel.create({
        title,
        description,
        price : {
            amount : priceAmount,
            current : priceCurrency || "INR"
        },
        images,
        seller: seller._id
    })

    res.status(201).json({
        message : "Product Create Sucessfully",
        success : true,
        product
    })
};
