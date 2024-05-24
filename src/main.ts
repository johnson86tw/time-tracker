import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import Vue3EasyDataTable from 'vue3-easy-data-table'
import vue3GoogleLogin from 'vue3-google-login'

import 'vue3-easy-data-table/dist/style.css'
import 'vant/lib/index.css' // vant 4
import './style.css'
import { googleClientId } from './config'

const app = createApp(App)

app.use(router)
app.use(createPinia())

app.component('EasyDataTable', Vue3EasyDataTable)

app.use(vue3GoogleLogin, {
	clientId: googleClientId,
	error: (err: any) => {
		console.error('vue3GoogleLogin', err)
	},
})

app.mount('#app')
