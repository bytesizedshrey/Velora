import express from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import { createPaymentOrder, verifyPayment } from "../controllers/payment.controller.js";

const paymentRouter = express.Router();

// POST /api/payments/create-order
paymentRouter.post("/create-order", isAuth, createPaymentOrder);

// POST /api/payments/verify
paymentRouter.post("/verify", isAuth, verifyPayment);

export default paymentRouter;
