import mongoose from 'mongoose';

const priceCacheSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, unique: true, uppercase: true, trim: true },
    price: { type: Number, required: true },
    fetchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const PriceCache = mongoose.model('PriceCache', priceCacheSchema);

export default PriceCache;
