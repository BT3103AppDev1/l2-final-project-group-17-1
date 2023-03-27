import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'w3-css/w3.css';
import VueChartkick from 'vue-chartkick'
import 'chartkick/chart.js'


const app = createApp(App).use(VueChartkick)

app.use(router)

app.mount('#app')
