import express from 'express';
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from './product.controller.js';
import { protect, authorizeRoles } from '../../middlewares/auth.middleware.js';
import upload from '../../utils/upload.js';

const router = express.Router();

/**
 * PUBLIC ROUTES
 */
router.get('/', getProducts);

/**
 * IMAGE UPLOAD ROUTE
 * ------------------
 * Only SELLER / ADMIN
 */
router.post(
  '/upload-image',
  protect,
  authorizeRoles('SELLER', 'ADMIN', 'SUPER_ADMIN'),
  upload.single("image"),
  (req, res) => {
    try {
      /**
       * Multer attaches uploaded file to req.file
       */
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      /**
       * Image URL (local for now)
       */
      const imageUrl = `/uploads/${req.file.filename}`;

      res.status(201).json({
        message: 'Image uploaded successfully',
        image: {
          url: imageUrl,
        },
      });
    } catch (error) {
      console.error('UPLOAD ERROR:', error.message);
      res.status(500).json({ message: 'Image upload failed' });
    }
  }
);

/**
 * PROTECTED ROUTES
 */
router.post(
  '/',
  protect,
  authorizeRoles('SELLER', 'ADMIN', 'SUPER_ADMIN'),
  createProduct
);

// UPDATE PRODUCT
router.put(
  '/:id',
  protect,
  authorizeRoles('SELLER', 'ADMIN', 'SUPER_ADMIN'),
  updateProduct
);

// DELETE PRODUCT
router.delete(
  '/:id',
  protect,
  authorizeRoles('SELLER', 'ADMIN', 'SUPER_ADMIN'),
  deleteProduct
);

export default router;