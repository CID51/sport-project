import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();


router.get('/maps-key', (req, res) => {
  res.json({ apiKey: process.env.MAPS_KEY });
});

router.get('/geocode', async (req, res) => {
  const address = req.query.address;
  if (!address) return res.status(400).json({ error: 'Address required' });

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          address,
          key: process.env.MAPS_KEY,
        },
      }
    );

    const location = response.data.results[0]?.geometry?.location;
    if (!location) return res.status(404).json({ error: 'Location not found' });

    res.json(location); 
  } catch (error) {
    res.status(500).json({ error: 'Failed to geocode address' });
  }
});

export default router;