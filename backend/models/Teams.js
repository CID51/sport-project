import mongoose from 'mongoose';

const TeamsSchema = new mongoose.Schema({
  name: String,
  league: { type: mongoose.Schema.Types.ObjectId, ref: 'League' },
  season: String,
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
});

const Team = mongoose.model('Team', TeamsSchema);
export default Team;