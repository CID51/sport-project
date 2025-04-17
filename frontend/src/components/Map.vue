<template>
    <div ref="mapContainer" class="map-container"></div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import axios from 'axios'
  
  const props = defineProps({
    address: String
  })
  
  const mapContainer = ref(null)
  const mapLoaded = ref(false)
  
  function loadGoogleMapsScript(key) {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve()
        return
      }
  
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`
      script.async = true
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
  
  async function initMap() {
    try {
      const { data: { key } } = await axios.get('/api/maps-key')
      await loadGoogleMapsScript(key)
  
      const { data: coords } = await axios.get('/api/geocode', {
        params: { address: props.address }
      })
  
      new google.maps.Map(mapContainer.value, {
        center: coords,
        zoom: 15
      })
  
      new google.maps.Marker({
        position: coords,
        map: new google.maps.Map(mapContainer.value, {
          center: coords,
          zoom: 15
        })
      })
  
      mapLoaded.value = true
    } catch (err) {
      console.error('Map load or geocode failed:', err)
    }
  }
  
  onMounted(() => {
    if (props.address) {
      initMap()
    }
  })
  
  watch(() => props.address, () => {
    if (props.address) {
      initMap()
    }
  })
  </script>
  
  <style scoped>
  .map-container {
    height: 300px;
    width: 100%;
    border-radius: 12px;
    margin-top: 1rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  </style>
