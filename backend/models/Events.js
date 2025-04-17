import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  who: { type: mongoose.Schema.Types.ObjectId, ref: 'Team'},
  place: String,
  date: String,
  timePlay: String,
  timeBack: String,
  versus: { type: mongoose.Schema.Types.ObjectId, ref: 'Team'},
  what: Boolean,
  dismiss: String,
  leave: String,
  location: {
    lat: { type: Number, default: null },
  lng: { type: Number, default: null },
  name: { type: String, default: '' }
  }
});

function handleLocationSelect(loc) {
  form.value.location.lat = loc.lat
  form.value.location.lng = loc.lng
  form.value.location.name = loc.name
}


const Event = mongoose.model('Event', eventSchema);
export default Event;