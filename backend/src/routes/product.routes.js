import express from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import {
    createProduct,
    getAllProducts,
    getSellerProducts,
    getProductById,
    getProductDetails,
} from "../controllers/product.controller.js";
import multer from 'multer'
import { createProductValidator } from "../validator/product.validator.js";


const upload = multer ({
    storage : multer.memoryStorage(),
    limits : {
        fileSize : 5 * 1024 * 1024
    }
})

const router = express.Router()

router.post('/', authenticateSeller, upload.array('images', 7), createProductValidator, createProduct)

router.get("/seller",authenticateSeller,getSellerProducts)

router.get("/",getAllProducts)

router.get("/:id", getProductById)

router.get("/detail/:id",getProductDetails)

export default router 