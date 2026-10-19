import mongoose from 'mongoose';

const holdingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    shares: { type: Number, required: true, min: 0 },
    avgCost: { type: Number, required: true, min: 0 },
    currentPrice: { type: Number, default: 0 },
    buyDate: { type: Date },
  },
  { timestamps: true }
);

const Holding = mongoose.model('Holding', holdingSchema);

export default Holding;
