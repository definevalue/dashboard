import { createApp, markRaw } from 'vue'
import App from './App.vue'
import router from './router'

// Plugins
import websocket from './plugins/websocket'
import notyf from '@/plugins/notyf'

import 'notyf/notyf.min.css'
import './assets/styles/styles.css'

import { createPinia } from 'pinia'
const pinia = createPinia()
pinia.use(({ store }) => {
  store.$router = markRaw(router)
})

const app = createApp(App)
app.use(pinia)

app.use(router)
app.use(notyf, {
  duration: 5000,
  dismissible: true,
  ripple: false,
  position: { x: 'right', y: 'bottom' },
  types: [
    {
      type: 'info',
      background: '#009efa'
    }
  ]
})
app.use(websocket, {
  socketPath: process.env.VUE_APP_SOCKET_PATH
})

// import and register vue components globally
const files = require.context('./components', true, /\.vue$/i)
files.keys().map(key =>
  app.component(
    key
      .split('/')
      .pop()
      .split('.')[0],
    files(key).default
  )
)

app.mount('#app')
