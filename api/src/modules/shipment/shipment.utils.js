import crypto from 'crypto';

export const SHIPMENT_TO_ORDER_STATUS = {
  PICKED_UP: 'SHIPPED',
  IN_TRANSIT: 'SHIPPEN',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',

  // RTO does NOT auto-cancel or refund
};

export const verifyCourierSignature = ({ payload, signature }) => {
  // BASIC SIMULATION (REPLACE LATER WITH REAL SECRET)
  const expected = crypto
    .createHash('sha256')
    .update(JSON.stringify(payload))
    .digest('hex');

  return signature === expected;
};