import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import cookieParser from "cookie-parser";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { config } from "./config/config.js";

const app = express()

// Trust reverse proxies (Render, Vercel, Cloudflare) for HTTPS protocol detection
app.set("trust proxy", 1)

app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://velora-one-rouge.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some(o => origin.startsWith(o))) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true
}))

app.use(passport.initialize())
if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET) {
    const backendHost = process.env.BACKEND_URL || 
      (process.env.NODE_ENV === "production" ? "https://by-jessika-backend.onrender.com" : "http://localhost:3000");

    const callbackURL = `${backendHost.replace(/\/$/, '')}/api/auth/google/callback`;

    passport.use(new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL
    }, (accessToken, refreshToken, profile, done) => {
        return done(null, profile)
    }))
}

app.get("/",(_req, res)=>{
    res.status(200).json({message : "Velora server is running"})
})

app.use("/api/auth",authRouter)
app.use("/api/products",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/payments",paymentRouter)

export default app