import mongoose, { Document, Schema } from 'mongoose';

const DisputeSchema = new mongoose.Schema({
  initiator: { type: String, required: true },
  seller_id: { type: String },
  buyer_id: { type: String },
  status: {
    type: String,
    enum: [
      'WAITING_FOR_SOLVER',
      'IN_PROGRESS', // taken by a solver
      'SETTLED', // settled seller's invoice by admin/solver and started to pay sats to buyer
      'SELLER_REFUNDED', // canceled by admin/solver and refunded to seller
      'RELEASED', // release by the seller
    ],
  },
  community_id: { type: String, default: null },
  order_id: { type: String, default: null },
  solver_id: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Dispute', DisputeSchema);
