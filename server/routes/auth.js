import express from 'express';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateCredentials, validateRegister } from '../middleware/validate.js';
import User from '../models/User.js';

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', validateRegister, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = new User({ name: name.trim(), email });
    await user.setPassword(password);
    await user.save();

    const token = signToken(user._id.toString());
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

router.post('/login', validateCredentials, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.verifyPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = signToken(user._id.toString());
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
});

export default router;
