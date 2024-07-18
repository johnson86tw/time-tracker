import { disableLogin } from '@/config'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
	state: (): {
		credential: string
		lastRouteName: string
	} => ({
		credential: '',
		lastRouteName: 'home',
	}),
	getters: {
		isLogin(): boolean {
			return disableLogin || this.credential !== ''
		},
	},
	actions: {
		setCredential(credential: string): void {
			this.credential = credential
		},
		clearCredential(): void {
			this.credential = ''
		},
		setLastRouteName(routeName: string) {
			this.lastRouteName = routeName
		},
	},
	persist: {
		key: 'time-tracker-password',
		paths: ['credential', 'lastRouteName'],
	},
})
