import 'bulma/css/bulma.min.css'
import './style.css'   
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')