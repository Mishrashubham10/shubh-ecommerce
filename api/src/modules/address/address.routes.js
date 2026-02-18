import express from 'express';
// import { protect } from '../../middlewares/auth.middleware.js';
import {
  createAddress,
  deleteAddress,
  getAddress,
} from './address.controller.js';

const router = express.Router();

/**
 * All address routes require authentication
 */
// router.use(protect);

router.post('/', createAddress);
router.get('/', getAddress);
router.delete('/:addressId', deleteAddress);

export default router;