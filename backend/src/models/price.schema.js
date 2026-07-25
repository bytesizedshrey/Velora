import mongoose from "mongoose";

const priceSchema = new mongoose.Schema({
    amount : {
        type : Number,
        required : true,
    },
    currency : {
        type : String,
        enum : ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'],
        default : "INR",
    },
},{
    _id : false
});

export default priceSchema;