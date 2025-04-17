import mongoose from 'mongoose';

const leagueSchema = new mongoose.Schema({
  name: String,
  division: String,
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: [] } ],
  season: String    
});

const League = mongoose.model('League', leagueSchema);
export default League;