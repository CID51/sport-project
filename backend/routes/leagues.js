import express from 'express';
import authMiddleware from '../middleware/auth.js';
import League from '../models/League.js';
import Team from '../models/Teams.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const leagues = await League.find().populate('teams');
    res.json(leagues);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get leagues' });
  }
});


router.post('/create', authMiddleware, async (req, res) => {
  try {
    const league = new League(req.body);
    await league.save();
    if (Array.isArray(req.body.teams)) {
      await Team.updateMany(
        { _id: { $in: req.body.teams } },
        { league: league._id }
      );
    }

    res.status(201).json(league);
  } catch (err) {
    console.error('Add league error:', err);
    res.status(400).json({ message: 'Failed to add league' });
  }
});


router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const league = await League.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!league) {
      return res.status(404).json({ message: 'League not found' });
    }
    
     await Team.updateMany(
      { league: league._id },
      { $unset: { league: "" } }
    );


    if (Array.isArray(req.body.teams)) {
      await Team.updateMany(
        { _id: { $in: req.body.teams } },
        { league: league._id }
      );
    }

    res.json(league);
  } catch (err) {
    console.error('League update error:', err);
    res.status(400).json({ message: 'Failed to update league' });
  }
});



router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await League.findByIdAndDelete(req.params.id);
    res.json({ message: 'League deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete league' });
  }
});

export default router;