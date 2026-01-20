/**
 * CART VALIDATION
 * ---------------
 * Backend must NEVER trust frontend
 */
export const validateAddToCart = ({ productId, quantity }) => {
  if (!productId) {
    return 'Product ID is required';
  }

  if (!quantity || quantity <= 0) {
    return 'Quantity must be greater than 0';
  }

  return null;
};

export const validateUpdateCart = ({ productId, quantity }) => {
  if (!productId) {
    return 'Product ID is required';
  }

  if (quantity === undefined) {
    return 'Quantity is required';
  }

  return null;
};