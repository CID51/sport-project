<template>
  <div>
    <nav class="navbar is-light is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand">
          <a role="button" class="navbar-burger" :class="{ 'is-active': burger }" @click="burger = !burger" aria-label="menu" aria-expanded="false">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div class="navbar-menu" :class="{ 'is-active': burger }">
          <div class="navbar-start">
            <router-link class="navbar-item" to="/schedule">Public Schedule</router-link>
            <router-link v-if="isLoggedIn" class="navbar-item" to="/dashboard">Admin Dashboard</router-link>
          </div>
          <div class="navbar-end">
            <div class="navbar-item">
              <router-link v-if="!isLoggedIn" class="button is-primary" to="/login">
                <span class="icon"><i class="fas fa-sign-in-alt"></i></span>
                <span>Login</span>
              </router-link>
              <button v-else class="button is-danger" @click="logout">
                <span class="icon"><i class="fas fa-sign-out-alt"></i></span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <section class="section mt-6">
      <div class="container">
        <h1 class="title is-3">Public Schedule</h1>

        <div class="box">
          <h2 class="title is-4">Events</h2>
          <div class="table-container">
            <table class="table is-fullwidth is-striped">
              <thead>
                <tr>
                  <th>What</th>
                  <th>Team</th>
                  <th>Opponent</th>
                  <th>Date</th>
                  <th>Play</th>
                  <th>Map</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ev in events" :key="ev._id">
                  <td>{{ ev.what ? 'Game' : 'Practice' }}</td>
                  <td>{{ ev.who?.name || ev.who }}</td>
                  <td>{{ ev.what ? (ev.versus?.name || ev.versus) : 'N/A' }}</td>
                  <td>{{ ev.date }}</td>
                  <td>{{ ev.timePlay }}</td>
                  <td>
                    <button class="button is-small is-link is-light" @click="openMap(ev.location)">Map</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="box">
          <h2 class="title is-4">Teams</h2>
          <ul>
            <li v-for="team in teams" :key="team._id">{{ team.name }} - {{ team.season }}</li>
          </ul>
        </div>

        <div class="box">
          <h2 class="title is-4">Leagues</h2>
          <ul>
            <li v-for="league in leagues" :key="league._id">{{ league.name }} - {{ league.season }}</li>
          </ul>
        </div>
      </div>
    </section>

    <div class="modal" :class="{ 'is-active': mapVisible }">
  <div class="modal-background" @click="mapVisible = false"></div>
  <div class="modal-card">
    <header class="modal-card-head is-flex is-justify-content-space-between is-align-items-center">
      <p class="modal-card-title">{{ selectedLocation.name }}</p>
      <button class="button is-small is-danger" @click="mapVisible = false">Close</button>
    </header>
    <section class="modal-card-body">
      <iframe
        v-if="selectedLocation.lat && selectedLocation.lng"
        width="100%"
        height="300"
        style="border:0"
        loading="lazy"
        :src="`https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}&hl=en&z=15&output=embed`"
      ></iframe>
    </section>
  </div>
</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const burger = ref(false)
const events = ref([])
const teams = ref([])
const leagues = ref([])
const isLoggedIn = ref(!!localStorage.getItem('token'))

const mapVisible = ref(false)
const selectedLocation = ref({ lat: null, lng: null, name: '' })

const openMap = (loc) => {
  selectedLocation.value = {
    lat: loc.lat,
    lng: loc.lng,
    name: loc.name
  }
  mapVisible.value = true
}

const logout = () => {
  localStorage.removeItem('token')
  isLoggedIn.value = false
}

onMounted(async () => {
  try {
    const [ev, tm, lg] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/api/events`),
      axios.get(`${import.meta.env.VITE_API_URL}/api/teams`),
      axios.get(`${import.meta.env.VITE_API_URL}/api/leagues`)
    ])
    events.value = ev.data
    teams.value = tm.data
    leagues.value = lg.data
  } catch (err) {
    console.error('Failed to load data:', err)
    alert('Failed to load schedule data. Please try again later.')
  }
})
</script>

<style scoped>
.section.mt-6 {
  margin-top: 5rem;
}

.table-container {
  overflow-x: auto;
}

.table th,
.table td {
  white-space: nowrap;
}

@media screen and (max-width: 768px) {
  .modal-card {
    width: 90vw;
  }
  .navbar-menu {
    text-align: center;
  }
}
</style>
