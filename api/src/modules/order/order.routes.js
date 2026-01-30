import express from 'express';
import { createOrder } from './order.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * USER PROTECTED ROUTES
 */
router.post('/', protect, createOrder);

export default router;