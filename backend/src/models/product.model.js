import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const variantSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "Standard Variant"
    },
    images: [
        {
            url: {
                type: String,
                required: true
            },
            alt: {
                type: String,
                default: "Variant Image"
            }
        }
    ],
    stock: {
        type: Number,
        default: 100
    },
    attributes: {
        type: Map,
        of: String,
        default: {}
    },
    price: {
        type: priceSchema,
        required: false
    }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    price: {
        type: priceSchema,
        required: true,
    },
    stock: {
        type: Number,
        default: 100
    },
    images: [
        {
            url: {
                type: String,
                required: true
            },
            alt: {
                type: String,
                default: "Product Image"
            }
        }
    ],
    variants: [variantSchema]
}, { timestamps: true });

const productModel = mongoose.model('product', productSchema);

export default productModel;