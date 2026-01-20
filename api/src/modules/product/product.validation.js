/**
 * VALIDATE PRODUCT INPUT
 * ----------------------
 * This function validates incoming product data.
 * Returns an error message if invalid, otherwise null.
 */
export const validateProductInput = (data) => {
  const { title, description, price, stock } = data;

  if (!title || title.trim().length < 3) {
    return 'Product title must be at least 3 characters';
  }

  if (!description || description.trim().length < 10) {
    return 'Product description must be at least 10 characters';
  }

  if (price === undefined || price <= 0) {
    return 'Product price must be greater than 0';
  }

  if (stock !== undefined && stock < 0) {
    return 'Stock cannot be negative';
  }

  return null;
};