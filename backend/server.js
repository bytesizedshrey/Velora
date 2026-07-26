import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

dotenv.config()

const PORT = process.process?.env?.PORT || process.env.PORT || 3000

const startServer = async () => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    })

    try {
        await connectDB()
    } catch (error) {
        console.error(`MongoDB connection error:`, error.message)
        console.log(`Note: Check network connection & MongoDB Atlas IP whitelist if using Atlas.`)
    }
}

startServer()