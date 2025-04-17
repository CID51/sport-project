import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import leagueRoutes from './routes/leagues.js';
import mapsKeyRoute from './routes/maps.js';
import protectRoutes from './routes/protected.js';
import teamsRoutes from './routes/teams.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


app.use('/api/maps', mapsKeyRoute);             
app.use('/api/events', eventRoutes);
app.use('/api/leagues', leagueRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/', authRoutes); 
app.use('/api/', protectRoutes);


app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});


app.use((req, res) => {
  res.status(404).send('Page not found');
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});
