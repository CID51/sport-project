<template>
    <div>
      <input
        ref="input"
        class="input"
        type="text"
        placeholder="Search for a location"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const emit = defineEmits(['location-selected'])
  const input = ref(null)
  
  onMounted(async () => {
    const { data } = await axios.get('/api/maps/maps-key')
    const key = data.apiKey
  
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = initAutocomplete
    document.head.appendChild(script)
  })
  
  function initAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(input.value, {
      types: ['geocode']
    })
  
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.geometry) return
  
      const lat = parseFloat(place.geometry.location.lat())
      const lng = parseFloat(place.geometry.location.lng())
      const name = place.formatted_address || place.name
  
      emit('location-selected', { lat, lng, name })
    })
  }
  </script>
