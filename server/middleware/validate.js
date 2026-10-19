import mongoose from 'mongoose';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TICKER_PATTERN = /^[A-Z0-9]{1,10}$/;

export function normalizeTicker(value) {
  return String(value ?? '').trim().toUpperCase();
}

export function isValidTicker(value) {
  return TICKER_PATTERN.test(value);
}

// Router-level param handler: router.param('ticker', validateTickerParam)
export function validateTickerParam(req, res, next, value) {
  const ticker = normalizeTicker(value);
  if (!isValidTicker(ticker)) {
    return res.status(400).json({ message: 'Invalid ticker' });
  }
  req.params.ticker = ticker;
  next();
}

export function validateObjectIdParam(req, res, next, value) {
  if (!mongoose.isValidObjectId(value)) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  next();
}

export function validateCredentials(req, res, next) {
  const { email, password } = req.body ?? {};
  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
    return res.status(400).json({ message: 'A valid email is required' });
  }
  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  req.body.email = email.trim().toLowerCase();
  next();
}

export function validateRegister(req, res, next) {
  const { name } = req.body ?? {};
  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ message: 'Name is required' });
  }
  return validateCredentials(req, res, next);
}

const isPositiveNumber = (v) => typeof v === 'number' && Number.isFinite(v) && v > 0;

// Validates the fields present in the body; with requireAll, missing fields are errors.
function checkHolding(body, requireAll) {
  const { symbol, shares, avgCost, buyDate } = body ?? {};

  if (symbol !== undefined || requireAll) {
    const ticker = normalizeTicker(symbol);
    if (!isValidTicker(ticker)) return 'symbol must be 1-10 alphanumeric characters';
    body.symbol = ticker;
  }
  if ((shares !== undefined || requireAll) && !isPositiveNumber(shares)) {
    return 'shares must be a number greater than 0';
  }
  if ((avgCost !== undefined || requireAll) && !isPositiveNumber(avgCost)) {
    return 'avgCost must be a number greater than 0';
  }
  if (buyDate !== undefined && buyDate !== null && Number.isNaN(new Date(buyDate).getTime())) {
    return 'buyDate must be a valid date';
  }
  return null;
}

export function validateHoldingCreate(req, res, next) {
  const error = checkHolding(req.body, true);
  if (error) return res.status(400).json({ message: error });
  next();
}

export function validateHoldingUpdate(req, res, next) {
  const error = checkHolding(req.body, false);
  if (error) return res.status(400).json({ message: error });
  next();
}
