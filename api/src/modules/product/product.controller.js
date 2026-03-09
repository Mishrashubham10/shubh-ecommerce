import Product from './product.model.js';
import {
  createProductService,
  getAllProductsService,
} from './product.service.js';
import { validateProductInput } from './product.validation.js';

/**
 * CREATE PRODUCT
 * --------------
 * Only SELLER or ADMIN
 */
export const createProduct = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const productData = {
      ...req.body,
      sellerId,
    };

    const product = await createProductService(productData);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('CREATE PRODUCT ERROR:', error.message);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET ALL PRODUCTS (PUBLIC)
 */
export const getProducts = async (req, res) => {
  try {
    const products = await getAllProductsService();

    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error('GET PRODUCTS ERROR:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
    });
  }
};

/**
 * UPDATE PRODUCT
 * --------------
 * SELLER (owner) or ADMIN
 */
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const validationError = validateProductInput(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const isOwner = product.sellerId.toString() === req.user._id.toString();
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to update this product',
      });
    }

    Object.assign(product, req.body);
    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('UPDATE PRODUCT ERROR:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to update product',
    });
  }
};

/**
 * DELETE PRODUCT (SOFT DELETE)
 */
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const isOwner = product.sellerId.toString() === req.user._id.toString();
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to delete this product',
      });
    }

    product.isActive = false;
    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('DELETE PRODUCT ERROR:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete product',
    });
  }
};