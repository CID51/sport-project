<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-4">Manage Events</h1>

      <div class="box">
        <form @submit.prevent="submitEvent">
          <div class="field">
            <label class="label">Team</label>
            <div class="control">
              <select v-model="form.who" class="input" required>
                <option :value="null" disabled>Select a team</option>
                <option v-for="team in teams" :key="team._id" :value="team._id">
                  {{ team.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="field">
            <label class="label">Place</label>
            <MapAutocomplete @location-selected="handleLocationSelect" />
          </div>

          <div class="field">
            <label class="label">Date</label>
            <div class="control">
              <input v-model="form.date" class="input" type="date" required />
            </div>
          </div>

          <div class="field">
            <label class="label">Play</label>
            <div class="control">
              <input v-model="form.timePlay" class="input" type="text" placeholder="Start time" required />
            </div>
          </div>

          <div class="field">
            <label class="label">Back</label>
            <div class="control">
              <input v-model="form.timeBack" class="input" type="text" placeholder="Return time" />
            </div>
          </div>

          <div class="field">
            <label class="label">What</label>
            <div class="select is-fullwidth">
              <select v-model="form.what">
                <option :value="true">Game</option>
                <option :value="false">Practice</option>
              </select>
            </div>
          </div>

          <div class="field">
            <label class="label">Versus (Opponent)</label>
            <div class="select is-fullwidth">
              <select v-model="form.versus" :disabled="!form.what">
                <option disabled value="">Select opponent</option>
                <option
                  v-for="team in filteredOpponentOptions"
                  :key="team._id"
                  :value="team._id"
                >
                  {{ team.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="field">
            <label class="label">Dismiss</label>
            <div class="control">
              <input v-model="form.dismiss" class="input" type="text" placeholder="Dismissal time" />
            </div>
          </div>

          <div class="field">
            <label class="label">Leave</label>
            <div class="control">
              <input v-model="form.leave" class="input" type="text" placeholder="Leave time" />
            </div>
          </div>

          <div class="field is-grouped">
            <div class="control">
              <button class="button is-primary" type="submit">
                {{ editingId ? 'Update Event' : 'Add Event' }}
              </button>
            </div>
            <div class="control" v-if="editingId">
              <button class="button is-light" type="button" @click="clearForm">Cancel</button>
            </div>
          </div>
        </form>
      </div>

      <div>
        <h2 class="title is-5 mt-5">All Events</h2>

        <div v-if="events.length === 0">
          <p>No events found.</p>
        </div>

        <div v-else>
          <div v-for="event in events" :key="event._id" class="box mb-3">
            <p>
              <strong>{{ event.what ? 'Game' : 'Practice' }}</strong> - {{ event.who?.name || event.who }}
              <span v-if="event.what">vs {{ event.versus?.name || event.versus }}</span>
            </p>
            <p>Date: {{ event.date }}</p>
            <p>Time: {{ event.timePlay }} (Back: {{ event.timeBack }})</p>
            <p>
              Place:
              <button class="button is-small is-link is-light" @click="$emit('show-map', event.location)">
                View Map
              </button>
            </p>
            <p>Dismiss: {{ event.dismiss }}, Leave: {{ event.leave }}</p>

            <div class="buttons mt-2">
              <button class="button is-small is-info" @click="editEvent(event)">Edit</button>
              <button class="button is-small is-danger" @click="deleteEvent(event._id)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import MapAutocomplete from '../components/MapAutocomplete.vue'

const token = localStorage.getItem('token')
const config = { headers: { Authorization: `Bearer ${token}` } }

const events = ref([])
const teams = ref([])
const editingId = ref(null)

const form = ref({
  who: null,
  date: '',
  timePlay: '',
  timeBack: '',
  versus: null,
  what: true,
  dismiss: '',
  leave: '',
  location: {
    lat: null,
    lng: null,
    name: ''
  }
})

const handleLocationSelect = (loc) => {
  form.value.location.lat = loc.lat
  form.value.location.lng = loc.lng
  form.value.location.name = loc.name
}

const loadTeams = async () => {
  try {
    const res = await axios.get('/api/teams') // Added /api prefix
    teams.value = res.data
  } catch (err) {
    console.error('Failed to load teams:', err)
  }
}

const loadEvents = async () => {
  try {
    const res = await axios.get('/api/events') // Added /api prefix
    events.value = res.data
  } catch (err) {
    console.error('Failed to load events:', err)
  }
}

const submitEvent = async () => {
  try {
    form.value.what = form.value.what === true || form.value.what === 'true';

    if (editingId.value) {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/events/${editingId.value}`, form.value, config);
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/events`, form.value, config);
    }
    clearForm();
    await loadEvents();
  } catch (err) {
    console.error('Failed to submit event:', err.response?.data || err.message);
  }
}

const editEvent = (event) => {
  editingId.value = event._id
  form.value = {
    who: event.who?._id || null,
    date: event.date,
    timePlay: event.timePlay,
    timeBack: event.timeBack,
    versus: event.versus?._id || null,
    what: event.what,
    dismiss: event.dismiss,
    leave: event.leave,
    location: {
      lat: event.location?.lat || null,
      lng: event.location?.lng || null,
      name: event.location?.name || ''
    }
  }
}

const deleteEvent = async (id) => {
  try {
    await axios.delete(`/api/events/${id}`, config)
    await loadEvents()
  } catch (err) {
    console.error('Failed to delete event', err)
  }
}

const clearForm = () => {
  editingId.value = null
  form.value = {
    who: null,
    date: '',
    timePlay: '',
    timeBack: '',
    versus: null,
    what: true,
    dismiss: '',
    leave: '',
    location: {
      lat: null,
      lng: null,
      name: ''
    }
  }
}

const filteredOpponentOptions = computed(() =>
  teams.value.filter((t) => t._id !== form.value.who)
)

onMounted(async () => {
  await Promise.all([loadTeams(), loadEvents()])
})
</script>
