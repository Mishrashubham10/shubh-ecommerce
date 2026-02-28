import express from 'express';
import cors from 'cors';
import path from 'path';

// ROUTES
import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from './modules/product/product.routes.js';
import cartRoutes from './modules/cart/cart.routes.js';
import orderRoutes from './modules/order/order.routes.js';
import paymentRoutes from './modules/payment/payment.routes.js';
import addressRoutes from './modules/address/address.routes.js';
import shipmentRoutes from './modules/shipment/shipment.routes.js';
import notificationRoutes from './modules/notification/notification.routes.js';
import { ApiError } from './utils/ApiError.js';

const app = express();

const API_VERSION = '/api/v1';

/***
 * ---------------------
 * GLOBAL MIDDLEWARES
 * ---------------------
 */

// ALLOW FRONTEND TO TALK TO BACKEND
app.use(cors());
// PARSES INCOMING JSON PAYLOADS
app.use(express.json());

/**
 * ROUTE
 * Used to verify server is alive
 */
app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/products`, productRoutes);
// SERVE UPLOADED IMAGES PUBLICALY
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(`${API_VERSION}/carts`, cartRoutes);
app.use(`${API_VERSION}/orders`, orderRoutes);
app.use(`${API_VERSION}/payments`, paymentRoutes);
app.use(`${API_VERSION}/addresses`, addressRoutes);
app.use(`${API_VERSION}/shipments`, shipmentRoutes);
app.use(`${API_VERSION}/notifications`, notificationRoutes);

// GLOBAL ERROR HANDLER
// app.use(globalErrorHandler);
app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
});

export default app;