import express from 'express';
import cors from 'cors';
import path from 'path';

// ROUTES
import productRoutes from "./modules/product/product.routes.js";
import cartRoutes from './modules/cart/cart.routes.js';
import orderRoutes from "./modules/order/order.routes.js";

const app = express();

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
app.use('/api/v1/products', productRoutes);
// SERVE UPLOADED IMAGES PUBLICALY
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/v1/carts', cartRoutes);
app.use('/api/v1/orders', orderRoutes);

export default app;