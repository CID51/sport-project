<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-4">Manage Teams</h1>


      <div class="box">
        <form @submit.prevent="submitTeam">
          <div class="field">
            <label class="label">Team Name</label>
            <div class="control">
              <input
                v-model="form.name"
                class="input"
                type="text"
                placeholder="e.g. Eagles"
                required
              />
            </div>
          </div>


          <div class="field" v-if="editingId && form.league">
            <label class="label">League</label>
            <div class="control">
              <input
                class="input"
                :value="getLeagueName(form.league)"
                readonly
              />
            </div>
          </div>

          <div class="field">
            <label class="label">Season</label>
            <div class="control">
              <input
                v-model="form.season"
                class="input"
                type="text"
                placeholder="e.g. Fall 2024"
              />
            </div>
          </div>

          <div class="field">
            <label class="label">Assign Events</label>
            <Multiselect
              v-model="form.events"
              :options="eventOptions"
              label="what"
              valueProp="_id"
              placeholder="Select events"
              multiple
              class="is-fullwidth"
            />
          </div>

          <div class="field is-grouped mt-4">
            <div class="control">
              <button class="button is-primary" type="submit">
                {{ editingId ? 'Update Team' : 'Add Team' }}
              </button>
            </div>
            <div class="control" v-if="editingId">
              <button class="button is-light" type="button" @click="clearForm">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>

      <div class="box">
        <h2 class="subtitle is-5">All Teams</h2>
        <div v-if="teams.length === 0" class="has-text-grey-light">
          No teams found.
        </div>
        <div v-else>
          <div v-for="team in teams" :key="team._id" class="box mb-3">
            <p><strong>{{ team.name }}</strong></p>
            <p>League: {{ team.league?.name || 'None' }}</p>
            <p>Season: {{ team.season || 'N/A' }}</p>
            <p>
              Events:
              <span v-if="team.events && team.events.length">
                {{ team.events.map(e => e.what).join(', ') }}
              </span>
              <span v-else class="has-text-grey-light">None</span>
            </p>
            <div class="buttons mt-2">
              <button class="button is-small is-info" @click="editTeam(team)">
                Edit
              </button>
              <button class="button is-small is-danger" @click="deleteTeam(team._id)">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

const token = localStorage.getItem('token')
const authConfig = { headers: { Authorization: `Bearer ${token}` } }

const teams = ref([])
const leagueOptions = ref([])
const eventOptions = ref([])

const form = ref({
  name: '',
  league: null,
  season: '',
  events: []
})

const editingId = ref(null)


async function loadTeams() {
  try {
    const res = await axios.get('/api/teams')
    teams.value = [...res.data];
  } catch (err) {
    console.error('Failed to load teams:', err)
  }
}

async function loadLeagues() {
  try {
    const res = await axios.get('/api/leagues')
    leagueOptions.value = res.data
  } catch (err) {
    console.error('Failed to load leagues:', err)
  }
}

async function loadEvents() {
  try {
    const res = await axios.get('/api/events')
    eventOptions.value = res.data
  } catch (err) {
    console.error('Failed to load events:', err)
  }
}

async function submitTeam() {
  const payload = {
    name: form.value.name,
    season: form.value.season,
    events: form.value.events
  }

  try {
    if (editingId.value) {
      await axios.put(`/api/teams/${editingId.value}`, payload, authConfig)
    } else {
      await axios.post('/api/teams/create', payload, authConfig)
    }
    clearForm()
    await loadTeams()
  } catch (err) {
    console.error('Failed to save team:', err.response?.data || err.message)
    alert('Failed to save team.')
  }
}

function editTeam(team) {
  editingId.value = team._id
  form.value.name = team.name
  form.value.league = team.league?._id || null
  form.value.season = team.season
  form.value.events = team.events ? team.events.map(e => e._id) : []
}

async function deleteTeam(id) {
  if (!confirm('Delete this team?')) return
  try {
    await axios.delete(`/api/teams/${id}`, authConfig)
    await loadTeams()
  } catch (err) {
    console.error('Failed to delete team:', err)
    alert('Failed to delete team.')
  }
}

function clearForm() {
  editingId.value = null
  form.value = { name: '', league: null, season: '', events: [] }
}

function getLeagueName(leagueId) {
  const l = leagueOptions.value.find(x => x._id === leagueId)
  return l ? l.name : 'None'
}

onMounted(async () => {
  await Promise.all([loadTeams(), loadLeagues(), loadEvents()])
})
</script>

<style scoped>
</style>
