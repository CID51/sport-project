<template>
  <div>
    <nav class="navbar is-light is-fixed-top">
      <div class="container">
        <div class="navbar-brand">
          <a role="button" class="navbar-burger" :class="{ 'is-active': burger }" @click="burger = !burger">
            <span></span><span></span><span></span>
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
        <h1 class="title is-3">Admin Dashboard</h1>

        <div class="columns is-multiline">
          <div class="column is-half">
            <DashboardEvents @show-map="openMap"/>
          </div>
          <div class="column is-half">
            <DashboardLeagues />
          </div>
          <div class="column is-full">
            <DashboardTeams />
          </div>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import DashboardEvents from './DashboardEvents.vue';
import DashboardLeagues from './DashboardLeague.vue';
import DashboardTeams from './DashboardTeams.vue';

const router = useRouter();
const burger = ref(false);
const isLoggedIn = ref(!!localStorage.getItem('token'));

const mapVisible = ref(false);
const selectedLocation = ref({ lat: null, lng: null, name: '' });

const logout = () => {
  localStorage.removeItem('token');
  isLoggedIn.value = false;
  router.push('/schedule');
};

const openMap = (loc) => {
  selectedLocation.value = {
    lat: loc.lat,
    lng: loc.lng,
    name: loc.name
  }
  mapVisible.value = true;
}
</script>

<style scoped>
.section.mt-6 {
  margin-top: 5rem;
}
</style>
