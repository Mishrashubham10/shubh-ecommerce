import express from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import { createPayment, paymentWebhook } from './payment.controller.js';

const router = express.Router();

/**
 * USER STARTS PAYMENT
 */
router.post('/', protect, createPayment);

/**
 * PAYMENT PROVIDER WEBHOOK
 * ⚠️ NO AUTH MIDDLEWARE
 */
router.post('/webhook', paymentWebhook);

export default router;