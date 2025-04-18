<template>
  <div>
    <nav class="navbar is-light is-fixed-top" role="navigation" aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand">
          <a role="button" class="navbar-burger" :class="{ 'is-active': burger }" @click="burger = !burger">
            <span></span>
            <span></span>
            <span></span>
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
      <div class="container has-text-centered">
        <div class="box" style="max-width: 400px; margin: 0 auto;">
          <h2 class="title is-4">Login</h2>
          <form @submit.prevent="login">
            <div class="field">
              <div class="control">
                <input class="input" v-model="username" placeholder="Username" required />
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input class="input" v-model="password" type="password" placeholder="Password" required />
              </div>
            </div>
            <div class="field">
              <button class="button is-dark is-fullwidth" type="submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const router = useRouter();
const burger = ref(false);
const isLoggedIn = ref(!!localStorage.getItem('token'));

const logout = () => {
  localStorage.removeItem('token');
  isLoggedIn.value = false;
  router.push('/schedule');
};

const login = async () => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, {
      username: username.value,
      password: password.value,
    });
    localStorage.setItem('token', response.data.token);
    isLoggedIn.value = true;
    router.push('/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    alert('Invalid login credentials or server error.');
  }
};
</script>

<style scoped>
.section.mt-6 {
  margin-top: 5rem;
}
</style>
