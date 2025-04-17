<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-4">Manage Leagues</h1>

      <div class="box">
        <form @submit.prevent="submitLeague">
          <div class="field">
            <label class="label">League Name</label>
            <input v-model="form.name" class="input" type="text" required />
          </div>

          <div class="field">
            <label class="label">Division</label>
            <input v-model="form.division" class="input" type="text" />
          </div>

          <div class="field">
            <label class="label">Season</label>
            <input v-model="form.season" class="input" type="text" />
          </div>

          <div class="field mt-3">
            <label class="label">Assign Teams</label>
            <Multiselect
              v-model="form.teams"
              :options="teamOptions"
              label="name"
              valueProp="_id"
              trackBy="_id"
              placeholder="Select teams"
              mode="tags"
              class="is-fullwidth"
            />
          </div>

          <div class="field is-grouped mt-4">
            <button class="button is-primary" type="submit">
              {{ editingId ? 'Update League' : 'Add League' }}
            </button>
            <button v-if="editingId" class="button is-light" type="button" @click="clearForm">Cancel</button>
          </div>
        </form>
      </div>

      <div class="box">
        <h2 class="subtitle is-5">All Leagues</h2>
        <div v-if="leagues.length === 0" class="has-text-grey">No leagues found.</div>
        <div v-else>
          <div v-for="league in leagues" :key="league._id" class="box mb-3">
            <p><strong>{{ league.name }}</strong></p>
            <p>Division: {{ league.division }}</p>
            <p>Season: {{ league.season }}</p>
            <p>
              Teams:
              <span v-if="league.teams && league.teams.length">
                {{ league.teams.map(t => t.name || 'Unnamed').join(', ') }}
              </span>
              <span v-else class="has-text-grey-light">None</span>
            </p>
            <div class="buttons mt-2">
              <button class="button is-small is-info" @click="editLeague(league)">Edit</button>
              <button class="button is-small is-danger" @click="deleteLeague(league._id)">Delete</button>
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
const config = { headers: { Authorization: `Bearer ${token}` } }

const leagues = ref([])
const teamOptions = ref([])

const form = ref({
  name: '',
  division: '',
  season: '',
  teams: []
})

const newTeam = ref({ name: '', coach: '' })
const editingId = ref(null)

const loadTeams = async () => {
  try {
    const res = await axios.get('/api/teams')
    teamOptions.value = res.data
  } catch (err) {
    console.error('Failed to load teams:', err)
  }
}

const loadLeagues = async () => {
  const res = await axios.get('/api/leagues')
  leagues.value = res.data
}

const submitLeague = async () => {
  const leagueData = {
    name: form.value.name,
    division: form.value.division,
    season: form.value.season,
    teams: form.value.teams
  }

  try {
    if (editingId.value) {
      await axios.put(`/api/leagues/${editingId.value}`, leagueData, config)
    } else {
      await axios.post('/api/leagues/create', leagueData, config)
    }
    clearForm()
    loadLeagues()
  } catch (err) {
    console.error('Failed to save league:', err.response?.data || err.message)
    alert('Failed to save league.')
  }
}

const submitTeam = async () => {
  try {
    await axios.post('/api/teams/create', newTeam.value, config)
    newTeam.value = { name: '', coach: '' }
    await loadTeams()
  } catch (err) {
    console.error('Failed to add team:', err.response?.data || err.message)
  }
}

const editLeague = (league) => {
  editingId.value = league._id
  form.value.name = league.name
  form.value.division = league.division
  form.value.season = league.season
  form.value.teams = league.teams.map(t => t._id || t) 
}

const deleteLeague = async (id) => {
  try {
    await axios.delete(`/api/leagues/${id}`, config)
    loadLeagues()
  } catch (err) {
    alert('Failed to delete league.')
  }
}

const clearForm = () => {
  editingId.value = null
  form.value = {
    name: '',
    division: '',
    season: '',
    teams: []
  }
}

onMounted(() => {
  loadLeagues()
  loadTeams()
})
</script>
