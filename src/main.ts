import { createApp } from 'vue'
import App from './app.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import Vue3EasyDataTable from 'vue3-easy-data-table'
import vue3GoogleLogin from 'vue3-google-login'

import 'vue3-easy-data-table/dist/style.css'
import 'vant/lib/index.css' // vant 4
import './style.css'
import { googleClientId } from './config'

const app = createApp(App)

// ========== set vant default language to English ==========
import { Locale } from 'vant'
import enUS from 'vant/es/locale/lang/en-US'

Locale.use('en-US', enUS)
// ==========================================================

app.use(router)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.component('EasyDataTable', Vue3EasyDataTable)

app.use(vue3GoogleLogin, {
	clientId: googleClientId,
	error: (err: any) => {
		console.error('vue3GoogleLogin', err)
	},
})

app.mount('#app')
