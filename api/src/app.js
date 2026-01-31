import express from 'express';
import cors from 'cors';
import path from 'path';

// ROUTES
import productRoutes from "./modules/product/product.routes.js";
import cartRoutes from './modules/cart/cart.routes.js';
import orderRoutes from "./modules/order/order.routes.js";
import paymentRoutes from "./modules/payment/payment.routes.js";
import addressRoutes from "./modules/address/address.routes.js";

const app = express();

const API_VERSION = "/api/v1";

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
 * HEALTH CHECK ROUTE
 * Used to verify server is alive
 */
app.use(`${API_VERSION}/products`, productRoutes);
// SERVE UPLOADED IMAGES PUBLICALY
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(`${API_VERSION}/carts`, cartRoutes);
app.use(`${API_VERSION}/orders`, orderRoutes);
app.use(`${API_VERSION}/payments`, paymentRoutes);
app.use(`${API_VERSION}/addresses`, addressRoutes)

export default app;