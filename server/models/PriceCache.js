import mongoose from 'mongoose';

const priceCacheSchema = new mongoose.Schema(
  {
    ticker: { type: String, required: true, uppercase: true, trim: true },
    type: { type: String, required: true, enum: ['quote', 'daily'] },
    price: { type: Number }, // quote only
    close: { type: Number }, // daily only
    date: { type: String }, // daily only, YYYY-MM-DD
    tradingDay: { type: String }, // quote only, YYYY-MM-DD
    changePercent: { type: Number }, // quote only
    fetchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Quote docs have no date (null in the index), so there is exactly one quote doc per ticker.
priceCacheSchema.index({ ticker: 1, type: 1, date: 1 }, { unique: true });

const PriceCache = mongoose.model('PriceCache', priceCacheSchema);

export default PriceCache;
