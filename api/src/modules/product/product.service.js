import Product from './product.model.js';

/**
 * CREATE PRODUCT
 * --------------
 * Business logic only (no HTTP here)
 */
export const createProductService = async (data) => {
  const product = await Product.create(data);
  return product;
};

/**
 * GET ALL PRODUCTS (Public)
 */
export const getAllProductsService = async () => {
  return await Product.find({ isActive: true }).sort({ createdAt: -1 });
};