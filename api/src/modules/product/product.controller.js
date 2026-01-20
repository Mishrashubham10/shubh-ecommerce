import Product from './product.model.js';
import {
  createProductService,
  getAllProductsService,
} from './product.service.js';
import { validateProductInput } from './product.validation.js';

/**
 * CREATE PRODUCT CONTROLLER
 * -------------------------
 * Only SELLER or ADMIN can create products
 */
export const createProduct = async (req, res) => {
  try {
    /**
     * req.user is injected by protect middleware
     */
    const sellerId = req.user._id;

    const productData = {
      ...req.body,
      sellerId, // NEVER TRUST FRONTEDN FOR THIS
    };

    const product = await createProductService(productData);

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('CREATE PRODUCT ERROR:', error.message);

    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * GET PRODUCTS (Public API)
 */
export const getProducts = async (req, res) => {
  try {
    const products = await getAllProductsService();

    if (!products) {
      return res.status(400).json({
        message: 'No Products in DB',
      });
    }

    res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error('GET PRODUCTS ERROR:', error.message);

    res.status(500).json({
      message: 'Failed to fetch products',
    });
  }
};

/**
 * UPDATE PRODUCT
 * --------------
 * Only:
 * - Product owner (SELLER)
 * - ADMIN / SUPER_ADMIN
 */
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // 1. VALIDATE INPUT
    const validationError = validateProductInput(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    // 2. FETCH PRODUCT
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    /**
     * 3. Ownership / Role Check
     * -------------------------
     * Seller can update only their own products
     */
    const isOwner = product.sellerId.toString() === req.user._id.toString();
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: 'You are not allowed to update this product',
      });
    }

    // 4. UPDATE PRODUCT
    Object.assign(product, req.body);
    await product.save();

    res.status(200).json({
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.log('UPDATE PRODUCT ERROR:', error.message);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

/**
 * DELETE PRODUCT (SOFT DELETE)
 * ----------------------------
 * We mark product as inactive instead of removing from DB.
 */
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(404).json({ message: 'ProductId is required' });
    }

    // FIND PRODUCT WITH PRODUCTID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // LOOK FOR OWNER OR ADMIN
    const isOwner = product.sellerId.toString() === req.user._id.toString();
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: 'You are not allowed to delete this product',
      });
    }

    product.isActive = false;
    await product.save();

    res.status(200).json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('DELETE PRODUCT ERROR:', error.message);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};