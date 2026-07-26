import express from 'express'
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { validateAddToCart } from '../validator/cart.validator.js';
import { addToCart, getCart, updateCartItem, removeCartItem } from '../controllers/cart.controller.js';

const router = express.Router();

router.post('/add/:productId/:varientId', authenticateUser, validateAddToCart, addToCart)
router.get('/get', authenticateUser, getCart)
router.put('/update/:itemId', authenticateUser, updateCartItem)
router.delete('/remove/:itemId', authenticateUser, removeCartItem)

export default router;