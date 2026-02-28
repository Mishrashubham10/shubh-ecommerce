import { sendSuccess } from '../../utils/apiResponse.js';
import {
  createAddressService,
  deleteAddressService,
  getUserAddressessService,
} from './address.service.js';

/**
 * CREATE ADDRESS
 */
export const createAddress = async (req, res) => {
  try {
    const address = await createAddressService(req.user._id, req.body);

    sendSuccess({
      success: true,
      message: 'Address added successfully',
      address,
    });
  } catch (err) {
    console.error('CREATE ADDRESS ERROR:', err.message);
    res.status(400).json({ message: err.message });
  }
};

/**
 * GET USER ADDRESSES
 */
export const getAddress = async (req, res) => {
  try {
    const addresses = await getUserAddressessService(req.user._id);

    sendSuccess({
      success: true,
      message: 'Address fetched successfully',
      addresses,
    });
  } catch (err) {
    console.error('GET ADDRESS ERROR:', err.message);
    res.status(500).json({ message: 'Failed to fetch addresses' });
  }
};

/**
 * DELETE ADDRESS
 */
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    await deleteAddressService(req.user._id, addressId);

    sendSuccess({
      success: true,
      message: 'Address deleted successfully',
      addressId,
    });
  } catch (err) {
    console.error('DELETE ADDRESS ERROR:', err.message);
    res.status(400).json({ message: err.message });
  }
};