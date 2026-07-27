import express from 'express'
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { validateAddToCart } from '../validator/cart.validator.js';
import { addToCart, getCart, getCartAggregate, updateCartItem, removeCartItem } from '../controllers/cart.controller.js';

const router = express.Router();

// Support both /variantId and /varientId route parameters
router.post('/add/:productId/:variantId', authenticateUser, validateAddToCart, addToCart)
router.post('/add/:productId/:varientId', authenticateUser, validateAddToCart, addToCart)
router.get('/get', authenticateUser, getCart)
router.get('/aggregate', authenticateUser, getCartAggregate)
router.put('/update/:itemId', authenticateUser, updateCartItem)
router.delete('/remove/:itemId', authenticateUser, removeCartItem)

export default router;