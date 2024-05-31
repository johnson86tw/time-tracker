import { createWebHistory, createRouter } from 'vue-router'

const routes = [
	{
		path: '/login',
		name: 'login',
		component: () => import('./pages/login.vue'),
	},
	{ path: '/', name: 'home', component: () => import('./pages/home.vue') },
	{ path: '/list', name: 'list', component: () => import('./pages/list.vue') },
	{ path: '/clipboard', name: 'clipboard', component: () => import('./pages/clipboard.vue') },
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
