import mongoose from 'mongoose';

/**
 * PRODUCT SCHEMA
 * --------------
 * This represents a product sold on the platform.
 * A product ALWAYS belongs to a seller.
 */
const productSchema = new mongoose.Schema(
  {
    // PRODCUT TITLE
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // DETAILED DESCRIPTION
    description: {
      type: String,
      required: true,
    },

    // ORIGINAL PRICE
    price: {
      type: Number,
      required: true,
    },

    // OPTIONAL DISCOUNTED PRICE
    discountPrice: {
      type: Number,
    },

    // SELLER WHO OWNS THIS PRODUCT
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // CATEGORY REFRENCE
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      index: true,
    },

    // IMAGE WILL BE URLS
    images: [
      {
        url: String,
        alt: String,
      },
    ],

    // INVENTORY STOCK
    stock: {
      type: Number,
      default: 0,
    },

    // CACHED RATNG
    rating: {
      type: Number,
      default: 0,
    },

    // PRODUCT VISIBILITY
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ title: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;