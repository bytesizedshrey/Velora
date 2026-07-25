import cartModel from '../models/cart.model.js';
import productModel from '../models/product.model.js';

export const addToCart=async(req,res)=>{

    const {productId, varientId} = req.params

    const product = await productModel.findOne({
        _id : productId,
        "varients._id" : varientId
    })

    if(!product){
        return res.status(404).json({
            message : "Product or Varient not found",
            success : false
        })
    }

    const cart = (await cartModel.findOne({user : req.user._id})) || await cartModel.create({user : req.user._id})

    const isProductAlreadyInCart = cart.items.find(item => item.product.equals(productId) && item.variant.equals(varientId))

}