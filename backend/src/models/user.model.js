import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {type : String, required : true, unique : true},
    contact : {type : String, required: true},
    password : {type : String, required : true},
    fullname : {type : String, required : true},

    role : {
        type : String,
        enum : ["buyer","seller"],
        default : "buyer"
    }
})


/**
 * email
 * contact
 * password
 * fullname
 */

const userModel = mongoose.model("user", userSchema)

export default userModel