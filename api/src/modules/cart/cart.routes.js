import express from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import {
  updateCartItem,
  getCart,
  addToCart,
  removeFromCart,
} from './cart.controller.js';

const router = express.Router();

/**
 * All cart routes are USER protected
 */
router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove', removeFromCart);

export default router;