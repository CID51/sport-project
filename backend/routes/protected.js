import express from 'express';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard-data', authMiddleware, (req, res) => {
  res.json({ message: 'Secure dashboard content', userId: req.user.id });
});

export default router;