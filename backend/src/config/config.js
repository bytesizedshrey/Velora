import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined.");
}
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined.");
}

export const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV || "development",
    IMAGE_PRIVATE_KEY: process.env.IMAGE_PRIVATE_KEY,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "rzp_test_VeloraStoreKey",
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "VeloraSecretKey1234567890"
};