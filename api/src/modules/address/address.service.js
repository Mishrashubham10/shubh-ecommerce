import Address from './address.model.js';

/**
 * CREATE ADDRESS
 */
export const createAddressService = async (userId, data) => {
  // If this is default, unset previous defaults
  if (data.isDefault) {
    await Address.updateMany({ userId }, { $set: { isDefault: false } });
  }

  return await Address.create({
    userId,
    ...data,
  });
};

/**
 * GET USER ADDRESSES
 */
export const getUserAddressessService = async (userId) => {
  return await Address.find({ userId }).sort({
    isDefault: -1,
    createdAt: -1,
  });
};

/**
 * GET ADDRESS BY ID (OWNERSHIP CHECK)
 */
export const getAddressByIdService = async (userId, addressId) => {
  const address = await Address.findOne({
    _id: addressId,
    userId,
  });

  if (!address) {
    throw new Error('Address not found');
  }

  return address;
};

/**
 * DELETE ADDRESS
 */
export const deleteAddressService = async (userId, addressId) => {
  const address = await Address.findOneAndDelete({
    _id: addressId,
    userId,
  });

  if (!address) {
    throw new Error('Address not found');
  }

  return address;
};